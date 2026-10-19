import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { sendEmail, MAIL } from "@/lib/email";
import { rateLimit, ipOf } from "@/lib/ratelimit";
import { priceCart, makeOrderRef } from "@/lib/shop";
import { orderPath, syncOrderStock, PAYMENT_METHODS, type OrderRow } from "@/lib/orders";
import { currentCustomer, saveCustomerDetails, setMarketingConsent } from "@/lib/customer";
import { buildOrderEmails } from "@/lib/emails/order";
import { PROVINCES } from "@/lib/brand";
import { isPkPhone, normalisePhone } from "@/lib/utils";

/**
 * Places an order.
 *
 * The body carries ids, variants and quantities; the money is recomputed here from the price list and that
 * recomputed total is what is stored, emailed and collected. A client total is never read.
 */
const Schema = z.object({
  items: z.array(z.object({ id: z.string().max(120), qty: z.number(), variant: z.string().max(60).optional() })).max(40),
  paymentMethod: z.enum(PAYMENT_METHODS),
  contact: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(24).refine(isPkPhone, "Invalid phone"),
    email: z.union([z.literal(""), z.string().trim().email().max(200)]).optional().default(""),
    notes: z.string().trim().max(2000).optional().default(""),
  }),
  address: z.object({
    line1: z.string().trim().min(4).max(200),
    line2: z.string().trim().max(200).optional().default(""),
    city: z.string().trim().min(2).max(80),
    province: z.enum(PROVINCES),
    postcode: z.string().trim().max(10).optional().default(""),
  }),
  saveDetails: z.boolean().optional().default(false),
  /** A ticked marketing box. Unticked records nothing, so it never unsubscribes anyone. */
  marketing: z.boolean().optional().default(false),
  page: z.string().max(300).optional().default(""),
  meta: z.object({
    ref: z.string().max(40).nullable().optional(),
    utmSource: z.string().max(80).nullable().optional(),
    utmCampaign: z.string().max(80).nullable().optional(),
    landingPath: z.string().max(300).nullable().optional(),
    sourceSlug: z.string().max(60).nullable().optional(),
  }).optional().default({}),
});

export async function POST(req: Request) {
  const ip = ipOf(req);
  // "open": losing a customer costs more than a few extra requests if the database cannot count.
  const rl = await rateLimit(`order:${ip}`, 6, 15 * 60_000, "open");
  if (!rl.ok) return Response.json({ ok: false, error: "Too many orders from this connection. Please WhatsApp us instead." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });

  const raw = await req.text();
  if (raw.length > 20_000) return Response.json({ ok: false, error: "Payload too large" }, { status: 413 });
  let body: unknown = null;
  try { body = JSON.parse(raw); } catch { /* falls through to the validation error */ }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "Please check your name, mobile number and delivery address." }, { status: 400 });
  const d = parsed.data;

  const cart = await priceCart(d.items);
  if (!cart.lines.length) return Response.json({ ok: false, error: "Nothing in your basket is available to order. Please refresh the shop." }, { status: 400 });

  const sql = db();
  if (!sql) return Response.json({ ok: false, error: "Online ordering is not available just now. Please WhatsApp us to order." }, { status: 503 });

  // Signed in: the order belongs to the verified address, whatever email the form sent.
  const me = await currentCustomer();
  const contact = { ...d.contact, phone: normalisePhone(d.contact.phone), email: (me?.email ?? d.contact.email).toLowerCase() };
  const ref = makeOrderRef();
  const totals = { subtotal: cart.subtotal, delivery: cart.delivery, total: cart.total };
  const lines = cart.lines.map((l) => ({ id: l.id, sku: l.sku, name: l.name, qty: l.qty, unit: l.unit, amount: l.amount, variant: l.variant, variantLabel: l.variantLabel }));

  try {
    const [order] = (await sql`insert into orders (ref, payment_method, contact, address, lines, totals, total, page, ip, meta)
                    values (${ref}, ${d.paymentMethod}, ${JSON.stringify(contact)}::jsonb, ${JSON.stringify(d.address)}::jsonb, ${JSON.stringify(lines)}::jsonb,
                            ${JSON.stringify(totals)}::jsonb, ${cart.total}, ${d.page}, ${ip}, ${JSON.stringify(d.meta)}::jsonb)
                    returning *`) as unknown as OrderRow[];

    // The order is committed: nothing below may fail it.
    if (await syncOrderStock(order).catch((err) => { console.error("[order stock]", err); return false; })) revalidatePath("/shop");
    if (me && d.saveDetails) await saveCustomerDetails(me.id, { name: contact.name, phone: contact.phone, address: d.address }).catch((err) => console.error("[order save details]", err));
    if (d.marketing && contact.email) await setMarketingConsent(contact.email, true, "checkout").catch((err) => console.error("[order marketing consent]", err));

    const mail = buildOrderEmails({ ref, cart, contact, address: d.address, paymentMethod: d.paymentMethod, page: d.page, meta: d.meta, ip });
    const sends = [sendEmail({ subject: mail.adminSubject, replyTo: contact.email || undefined, html: mail.adminHtml })];
    if (MAIL.sendCustomerCopy && contact.email) sends.push(sendEmail({ to: [contact.email], subject: mail.customerSubject, html: mail.customerHtml }));
    await Promise.allSettled(sends).then((r) => r.forEach((x) => x.status === "rejected" && console.error("[order email]", x.reason)));

    return Response.json({ ok: true, ref, path: `${orderPath(ref)}&placed=1`, total: cart.total });
  } catch (err) {
    console.error("[order]", err);
    return Response.json({ ok: false, error: "We could not place that order just now. Please WhatsApp us and we will take it there." }, { status: 500 });
  }
}
