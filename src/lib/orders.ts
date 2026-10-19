import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "./db";
import { takeStock, returnStock } from "./shop";

/**
 * Read side of the shop: the `orders` table as the dashboard and the order page see it. Money is never
 * recomputed here — an order is a record of what was charged, so `lines` and `totals` are read verbatim.
 */

export const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;
export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;
export const PAYMENT_METHODS = ["cod", "bank", "jazzcash", "easypaisa"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cod: "Cash on delivery",
  bank: "Bank transfer",
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
};

export interface OrderLine {
  id: string;
  sku: string;
  name: string;
  qty: number;
  unit: number;
  amount: number;
  variant: string;
  variantLabel: string;
}

export interface OrderRow {
  ref: string;
  status: string;
  payment_method: PaymentMethod;
  payment_status: string;
  payment_ref: string | null;
  contact: { name: string; phone: string; email: string; notes: string };
  address: { line1: string; line2: string; city: string; province: string; postcode: string };
  lines: OrderLine[];
  totals: { subtotal: number; delivery: number; total: number };
  total: string | number;
  tracking: string | null;
  admin_note: string | null;
  page: string | null;
  ip: string | null;
  meta: { ref?: string | null; utmSource?: string | null; utmCampaign?: string | null; landingPath?: string | null } | null;
  stock_taken_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export const oneLineAddress = (a: OrderRow["address"]) => [a.line1, a.line2, a.city, a.province, a.postcode].filter(Boolean).join(", ");

export async function getOrder(ref: string): Promise<OrderRow | null> {
  const sql = db();
  if (!sql) return null;
  const rows = (await sql`select * from orders where ref = ${ref}`) as unknown as OrderRow[];
  return rows[0] ?? null;
}

/* ─── Who may see an order ──────────────────────────────────────────────── */

/**
 * A ref is read out on the phone and written on the parcel, so it is not a secret. The order page shows a
 * name, phone and home address, so it opens only with this token (in the order email, the confirmation
 * redirect and the WhatsApp message) or an admin session. No CUSTOMER_SESSION_SECRET: nothing verifies.
 */
const orderSecret = () => process.env.CUSTOMER_SESSION_SECRET ?? "";

export const orderToken = (ref: string) =>
  orderSecret() ? createHmac("sha256", orderSecret()).update(`order:${ref}`).digest("base64url").slice(0, 32) : "";

export function verifyOrderToken(ref: string, token: unknown) {
  const want = Buffer.from(orderToken(ref));
  const got = Buffer.from(typeof token === "string" ? token : "");
  return want.length > 0 && want.length === got.length && timingSafeEqual(want, got);
}

/** Site-relative link to the customer's order page. Every link to it goes through here. */
export const orderPath = (ref: string) => `/order/${ref}?k=${orderToken(ref)}`;

/* ─── Stock ─────────────────────────────────────────────────────────────── */

/** Every payment method here is confirmed at order time (cash or a manual transfer), so a live order holds stock. */
export const holdsStock = (o: Pick<OrderRow, "status">) => o.status !== "cancelled";

/**
 * Brings counted stock in line with `holdsStock`. `stock_taken_at` flips by a guarded update first, so a
 * double-submitted admin save moves stock once. Returns true when stock moved (revalidate the shop).
 */
export async function syncOrderStock(o: OrderRow) {
  const sql = db();
  if (!sql) return false;
  const hold = holdsStock(o);
  const flipped = hold
    ? await sql`update orders set stock_taken_at = now() where ref = ${o.ref} and stock_taken_at is null returning ref`
    : await sql`update orders set stock_taken_at = null where ref = ${o.ref} and stock_taken_at is not null returning ref`;
  if (!flipped.length) return false;
  await (hold ? takeStock(o.lines) : returnStock(o.lines));
  return true;
}
