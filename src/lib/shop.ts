import { SERIES, FAMILIES, seriesHref, type Series } from "@/content/products";
import { COMMERCIAL } from "./brand";
import { db } from "./db";
import { overrides, type Override } from "./catalogue";

/**
 * The shop.
 *
 * Nothing here invents a price: a line costs its size's list price plus its colour's surcharge, both from
 * src/content/products.ts. The `products` override row adds only what a shopkeeper owns — listed or not,
 * how many are left, and copy. A basket is always re-priced here, server-side; the browser sends ids,
 * variants and quantities and never a number.
 */

export interface ShopItem {
  /** Cart id: `p:<series slug>`. */
  id: string;
  slug: string;
  series: Series;
  name: string;
  summary: string;
  image: string;
  href: string;
  group: string;
  fromPrice: number;
  /** null = no cap; 0 = out of stock. */
  stock: number | null;
  /** Kept out of listings but still sold from its own page. */
  hidden: boolean;
}

export interface CartItem {
  id: string;
  qty: number;
  /** `<size>/<colour>`, e.g. `2l/copper`. */
  variant?: string;
}

export interface PricedLine extends CartItem {
  variant: string;
  name: string;
  href: string;
  image: string;
  sku: string;
  unit: number;
  amount: number;
  variantLabel: string;
  /** Quantity we could not honour, e.g. asked for 5 with 2 in stock. */
  clamped: boolean;
}

export interface PricedCart {
  lines: PricedLine[];
  /** Ids dropped because they are unknown, unlisted or sold out. */
  rejected: string[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  note: string;
}

export const MAX_LINES = 20;
export const MAX_QTY = 50;

const apply = (s: Series, ov: Override | undefined): ShopItem | null => {
  if (ov && !ov.sellable) return null;
  return {
    id: `p:${s.slug}`,
    slug: s.slug,
    series: s,
    name: ov?.name || `CAPRA ${s.name}`,
    summary: ov?.summary || s.summary,
    image: ov?.image || s.images[0].src,
    href: seriesHref(s),
    group: FAMILIES[s.family].name,
    fromPrice: Math.min(...s.sizes.map((z) => z.price)),
    stock: ov?.stock ?? null,
    hidden: Boolean(ov?.hidden),
  };
};

/** Every series that can be bought online, in range order. */
export async function shopCatalogue(): Promise<ShopItem[]> {
  const o = await overrides();
  return SERIES.map((s) => apply(s, o.get(s.slug))).filter((i): i is ShopItem => i !== null);
}

/** What listing pages show: sellable and not hidden. */
export const listed = async () => (await shopCatalogue()).filter((i) => !i.hidden);

/** Factory list bounds, including colour finishes, for shared synchronous brand markup. */
export function listPriceBounds() {
  const prices = SERIES.flatMap((s) => s.sizes.flatMap((z) => s.colours.map((c) => z.price + c.add)));
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export const shopItem = async (slug: string) => (await shopCatalogue()).find((i) => i.slug === slug) ?? null;

/* ─── Variants ──────────────────────────────────────────────────────────── */

/** A clean `<size>/<colour>` for this series: anything unknown falls back to the first size or colour. */
export function cleanVariant(s: Series, variant: unknown) {
  const [size, colour] = typeof variant === "string" ? variant.slice(0, 60).split("/") : [];
  const z = s.sizes.find((x) => x.value === size) ?? s.sizes[0];
  const c = s.colours.find((x) => x.value === colour) ?? s.colours[0];
  return { size: z, colour: c, key: `${z.value}/${c.value}` };
}

export function variantFacts(s: Series, variant: unknown) {
  const { size, colour, key } = cleanVariant(s, variant);
  return {
    key,
    unit: size.price + colour.add,
    sku: `${colour.prefix}${size.model}`,
    label: `${size.label} · ${colour.label}${s.colourByRequest ? " (preferred)" : ""}`,
    image: s.images[colour.image]?.src ?? s.images[0].src,
  };
}

/* ─── Pricing ───────────────────────────────────────────────────────────── */

/** Whitelists an untrusted basket: string ids, whole quantities, at most MAX_LINES lines. */
export function sanitiseCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  for (const r of raw.slice(0, MAX_LINES * 2)) {
    const o = (r ?? {}) as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id.slice(0, 120) : "";
    const qty = Math.min(MAX_QTY, Math.max(1, Math.round(Number(o.qty) || 0)));
    if (!id) continue;
    const variant = typeof o.variant === "string" ? o.variant.slice(0, 60) : undefined;
    const same = out.find((x) => x.id === id && (x.variant ?? "") === (variant ?? ""));
    if (same) same.qty = Math.min(MAX_QTY, same.qty + qty);
    else out.push({ id, qty, variant });
    if (out.length >= MAX_LINES) break;
  }
  return out;
}

export const deliveryFor = (subtotal: number) => (subtotal >= COMMERCIAL.freeDeliveryFrom || subtotal === 0 ? 0 : COMMERCIAL.deliveryFee);

/** The one place a basket turns into money. Pure given a catalogue, so scripts/check-shop.ts can test it. */
export function priceWith(catalogue: ShopItem[], raw: unknown): PricedCart {
  const lines: PricedLine[] = [];
  const rejected: string[] = [];

  for (const c of sanitiseCart(raw)) {
    const item = catalogue.find((i) => i.id === c.id);
    if (!item || item.stock === 0) {
      rejected.push(c.id);
      continue;
    }
    const v = variantFacts(item.series, c.variant);
    const existing = lines.find((l) => l.id === item.id && l.variant === v.key);
    const cap = item.stock == null ? MAX_QTY : Math.min(MAX_QTY, item.stock);
    const wanted = c.qty + (existing?.qty ?? 0);
    const qty = Math.min(wanted, cap);
    if (existing) {
      existing.qty = qty;
      existing.amount = v.unit * qty;
      existing.clamped = qty < wanted;
      continue;
    }
    lines.push({
      id: item.id, qty, variant: v.key, name: item.name, href: item.href, image: v.image, sku: v.sku,
      unit: v.unit, amount: v.unit * qty, variantLabel: v.label, clamped: qty < wanted,
    });
  }

  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  const delivery = deliveryFor(subtotal);
  return {
    lines,
    rejected,
    count: lines.reduce((a, l) => a + l.qty, 0),
    subtotal,
    delivery,
    total: subtotal + delivery,
    note: delivery
      ? `Delivery Rs ${COMMERCIAL.deliveryFee} anywhere in Pakistan. Free on orders of Rs ${COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")} or more.`
      : subtotal ? "Free delivery anywhere in Pakistan." : "",
  };
}

/** Server-side cart pricing: the catalogue comes from the database overlay, never the client. */
export async function priceCart(raw: unknown): Promise<PricedCart> {
  return priceWith(await shopCatalogue(), raw);
}

/**
 * Moves counted stock for an order: 1 takes it, -1 puts it back. Only series with a counted stock are
 * touched; `greatest(…, 0)` keeps two orders at once from driving it negative. Call through
 * `syncOrderStock()`, which guards against moving the same order twice.
 *
 * ponytail: stock is counted per series, not per size and colour. Add a per-variant count (jsonb on
 * products) if the factory starts running out of one size while the others are plentiful.
 */
async function moveStock(lines: { id: string; qty: number }[], sign: 1 | -1) {
  const sql = db();
  if (!sql) return;
  for (const l of lines) {
    if (!l.id.startsWith("p:")) continue;
    await sql`update products set stock = greatest(stock - ${sign * l.qty}, 0), updated_at = now()
              where slug = ${l.id.slice(2)} and stock is not null`;
  }
}
export const takeStock = (lines: { id: string; qty: number }[]) => moveStock(lines, 1);
export const returnStock = (lines: { id: string; qty: number }[]) => moveStock(lines, -1);

/** Order references are short enough to read out on the phone. */
export const makeOrderRef = () => `CAP-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.random().toString(36).toUpperCase().slice(2, 5)}`;

/** What to tell a shopper about availability; mirrors `availability` in the product's structured data. */
export function stockStatus(item: Pick<ShopItem, "stock">): { label: string; tone: "success" | "warning" | "danger"; schema: "InStock" | "OutOfStock" } {
  if (item.stock === 0) return { label: "Out of stock", tone: "danger", schema: "OutOfStock" };
  if (item.stock != null && item.stock <= 5) return { label: `${item.stock} left`, tone: "warning", schema: "InStock" };
  return { label: "In stock", tone: "success", schema: "InStock" };
}
