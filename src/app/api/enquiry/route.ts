import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail, MAIL } from "@/lib/email";
import { rateLimit, ipOf } from "@/lib/ratelimit";
import { buildEnquiryEmails } from "@/lib/emails/enquiry";
import { isPkPhone, normalisePhone } from "@/lib/utils";

/** Contact, product and wholesale enquiries: logged, then emailed to the shop and (with an email) the customer. */
const Schema = z.object({
  kind: z.enum(["contact", "wholesale", "product", "warranty"]).default("contact"),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().max(24).refine(isPkPhone),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]).optional().default(""),
  city: z.string().trim().max(80).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  subject: z.string().trim().max(160).optional().default(""),
  quantity: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().max(4000).optional().default(""),
  product: z.string().trim().max(160).optional(),
  page: z.string().trim().max(300).optional().default(""),
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
  const rl = await rateLimit(`enq:${ip}`, 6, 10 * 60_000, "open");
  if (!rl.ok) return Response.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "Please check your name and mobile number." }, { status: 400 });
  const d = { ...parsed.data, phone: normalisePhone(parsed.data.phone) };

  try {
    const ref = `ENQ-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.random().toString(36).toUpperCase().slice(2, 5)}`;
    const extra = { company: d.company, quantity: d.quantity, city: d.city, ...d.meta };
    const sql = db();
    if (sql) await sql`insert into enquiries (ref, kind, name, email, phone, city, subject, message, product, page, ip, extra) values (${ref}, ${d.kind}, ${d.name}, ${d.email.toLowerCase()}, ${d.phone}, ${d.city}, ${d.subject}, ${d.message}, ${d.product ?? null}, ${d.page}, ${ip}, ${JSON.stringify(extra)}::jsonb)`;

    const mail = buildEnquiryEmails({ ref, ...d, ip });
    const sends = [sendEmail({ subject: mail.adminSubject, replyTo: d.email || undefined, html: mail.adminHtml })];
    if (MAIL.sendCustomerCopy && d.email) sends.push(sendEmail({ to: [d.email], subject: mail.customerSubject, html: mail.customerHtml }));
    await Promise.all(sends);
    return Response.json({ ok: true, ref });
  } catch (err) {
    console.error("[enquiry]", err);
    return Response.json({ ok: false, error: "We could not send that just now. Please WhatsApp or call us." }, { status: 500 });
  }
}
