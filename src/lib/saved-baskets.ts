import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { BRAND } from "@/lib/brand";
import type { CartItem } from "@/lib/shop";

/**
 * "Email me my basket": a basket the customer asked us to email them. Logged here and listed in
 * /admin/saved-baskets. The reminder is the customer's own opt-in, sent once by /api/cron/daily.
 * Only ids, variants and quantities are stored; the basket is re-priced whenever it is opened.
 */
export const REMIND_TEXT = "Email me one reminder tomorrow if I have not ordered yet.";

export type SavedBasket = { id: string; token: string; email: string; items: CartItem[]; total: number; remind: boolean; remindedAt: string | null; createdAt: string };

const fromRow = (r: Record<string, unknown>): SavedBasket => ({
  id: String(r.id), token: String(r.token), email: String(r.email), items: (r.items as CartItem[]) ?? [], total: Number(r.total),
  remind: Boolean(r.remind), remindedAt: r.reminded_at ? String(r.reminded_at) : null, createdAt: String(r.created_at),
});

/** The emailed link back into the basket: the id alone opens nothing without its token. */
export const basketLink = (s: Pick<SavedBasket, "id" | "token">) => `${BRAND.domain}/cart?saved=${s.id}.${s.token}`;

export async function saveBasket(input: { email: string; items: CartItem[]; total: number; page: string; remind: boolean }) {
  const sql = db();
  if (!sql) throw new Error("No database");
  const id = randomBytes(9).toString("base64url");
  const token = randomBytes(16).toString("base64url");
  await sql`insert into saved_baskets (id, token, email, items, total, page, remind, remind_text)
            values (${id}, ${token}, ${input.email.toLowerCase()}, ${JSON.stringify(input.items)}::jsonb, ${input.total}, ${input.page}, ${input.remind}, ${input.remind ? REMIND_TEXT : null})`;
  return { id, token };
}

export async function basketByLink(link: string) {
  const [id, token] = link.split(".");
  const sql = db();
  if (!sql || !id || !token) return null;
  const rows = await sql`select * from saved_baskets where id = ${id} and token = ${token} and created_at > now() - interval '180 days'`;
  return rows[0] ? fromRow(rows[0]) : null;
}

export async function listSavedBaskets(q = "") {
  const sql = db();
  if (!sql) return [];
  return (await sql`select * from saved_baskets where (${q}::text = '' or email ilike ${"%" + q + "%"}) order by created_at desc limit 200`).map(fromRow);
}

/** Opted-in baskets 24–72 hours old, not yet reminded, whose address has not ordered since (one reminder a week per person). */
export async function dueReminders() {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select s.* from saved_baskets s
    where s.remind and s.reminded_at is null
      and s.created_at <= now() - interval '24 hours' and s.created_at > now() - interval '72 hours'
      and not exists (select 1 from orders o where lower(o.contact->>'email') = s.email and o.created_at > s.created_at)
      and not exists (select 1 from saved_baskets r where r.email = s.email and r.reminded_at > now() - interval '7 days')
    order by s.created_at limit 100`).map(fromRow);
}

/** Claimed before it is sent: the guard on reminded_at makes a re-run send nothing twice. */
export async function claimReminder(id: string) {
  const sql = db();
  if (!sql) return false;
  return (await sql`update saved_baskets set reminded_at = now() where id = ${id} and reminded_at is null returning id`).length === 1;
}

export async function purgeOldBaskets() {
  const sql = db();
  if (!sql) return 0;
  return (await sql`delete from saved_baskets where created_at < now() - interval '180 days' returning id`).length;
}
