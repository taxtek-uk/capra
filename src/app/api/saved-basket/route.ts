import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { rateLimit, ipOf } from "@/lib/ratelimit";
import { priceCart, sanitiseCart } from "@/lib/shop";
import { basketByLink, basketLink, saveBasket } from "@/lib/saved-baskets";
import { savedBasketEmail } from "@/lib/emails/saved-basket";

/**
 * POST: "Email me my basket". Ids and quantities only; re-priced here. Emails the customer alone.
 * GET ?s=<id>.<token>: the basket behind an emailed link, so /cart can restore it. No contact details.
 */
const Schema = z.object({
  email: z.string().trim().email().max(200),
  remind: z.boolean().default(false),
  items: z.array(z.unknown()).max(40),
  page: z.string().trim().max(300).optional().default(""),
});

export async function POST(req: Request) {
  const rl = await rateLimit(`saved:${ipOf(req)}`, 5, 15 * 60_000);
  if (!rl.ok) return Response.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const raw = await req.text();
  if (raw.length > 20_000) return Response.json({ ok: false, error: "Payload too large" }, { status: 413 });
  let body: unknown = null; try { body = JSON.parse(raw); } catch { /* fallthrough */ }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return Response.json({ ok: false, error: "Please check the email address." }, { status: 400 });

  const cart = await priceCart(parsed.data.items);
  if (!cart.lines.length) return Response.json({ ok: false, error: "Your basket is empty." }, { status: 400 });
  const items = sanitiseCart(cart.lines.map(({ id, qty, variant }) => ({ id, qty, variant })));
  try {
    const saved = await saveBasket({ email: parsed.data.email, items, total: cart.total, page: parsed.data.page, remind: parsed.data.remind });
    const mail = savedBasketEmail({ cart, link: basketLink(saved), remind: parsed.data.remind });
    await sendEmail({ to: [parsed.data.email], subject: mail.subject, html: mail.html });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[saved-basket]", err);
    return Response.json({ ok: false, error: "We could not send that just now. Please try again." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!(await rateLimit(`saved-get:${ipOf(req)}`, 30, 10 * 60_000)).ok) return Response.json({ ok: false }, { status: 429 });
  const link = new URL(req.url).searchParams.get("s") ?? "";
  if (!/^[\w-]{8,40}\.[\w-]{16,64}$/.test(link)) return Response.json({ ok: false }, { status: 404 });
  const saved = await basketByLink(link).catch(() => null);
  if (!saved) return Response.json({ ok: false }, { status: 404 });
  return Response.json({ ok: true, items: sanitiseCart(saved.items) }, { headers: { "cache-control": "no-store" } });
}
