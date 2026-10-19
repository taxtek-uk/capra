import { priceCart } from "@/lib/shop";
import { rateLimit, ipOf } from "@/lib/ratelimit";

/**
 * Prices a basket. The browser stores ids and quantities; every figure it shows comes
 * back from here, recomputed from the engine catalogue — the same trust boundary as
 * /api/quote, so there is no second place where a total could be invented.
 */
export async function POST(req: Request) {
  const rl = await rateLimit(`cart:${ipOf(req)}`, 60, 60_000, "open");
  if (!rl.ok) return Response.json({ ok: false, error: "Too many requests." }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  const raw = await req.text();
  if (raw.length > 10_000) return Response.json({ ok: false, error: "Basket too large" }, { status: 413 });
  let body: unknown = null;
  try {
    body = JSON.parse(raw);
  } catch {
    /* an unreadable body prices as an empty basket */
  }
  const items = (body as { items?: unknown } | null)?.items;
  return Response.json({ ok: true, cart: await priceCart(items) });
}
