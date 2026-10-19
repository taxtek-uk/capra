import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { db, dbUrl } from "@/lib/db";
import { MARKETING_CONSENT_TEXT } from "@/content/marketing";

/**
 * Customer accounts.
 *
 * Sign-in is a 6-digit code emailed to the address — no passwords, so nothing to reset or leak.
 * A code rather than a magic link: people read the email on a phone while checking out on a
 * laptop, and mail scanners open links before the customer does, which would spend a single-use link.
 *
 * Identity is the verified, lower-case email. An order belongs to a customer when its email
 * matches, and nothing is shown for an address until a code sent to it has been entered.
 *
 * CUSTOMER_SESSION_SECRET signs the cookie, the code hashes and the order links (orders.ts), each
 * under its own prefix. Without it, accounts are off and checkout stays guest-only.
 */
const COOKIE = "capra_customer";
const MAX_AGE = 60 * 60 * 24 * 30;
export const CODE_TTL_SECONDS = 10 * 60;
export const MAX_ATTEMPTS = 5;
export const MAX_CODES_PER_15_MIN = 3;

const secret = () => process.env.CUSTOMER_SESSION_SECRET ?? "";
/** Accounts need the signing secret and a database; without either, checkout stays guest-only. */
export const accountsEnabled = () => Boolean(secret() && dbUrl());

/** Every signature is prefixed with its purpose, so a code hash, a session and an order link never stand in for each other. */
const sign = (purpose: string, body: string) => createHmac("sha256", secret()).update(`${purpose}:${body}`).digest("base64url");
function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length > 0 && x.length === y.length && timingSafeEqual(x, y);
}

export type Address = { line1: string; line2: string; city: string; province: string; postcode: string };
export type Customer = { id: number; email: string; name: string; phone: string; address: Address | null; version: number };
/** What checkout and the details page fill in. */
export type SavedDetails = { email: string; name: string; phone: string; address: Address | null; subscribed: boolean };
export type CustomerOrder = { ref: string; status: string; payment_method: string; payment_status: string; total: number; items: number; created_at: string };

export const normaliseEmail = (s: string) => s.trim().toLowerCase();

/* ─── Codes ─────────────────────────────────────────────────────────────── */

export const makeCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
/** Bound to the address, so a code sent to one email cannot sign in another. */
export const hashCode = (email: string, code: string) => sign("code", `${normaliseEmail(email)}:${code}`);

/* ─── Session cookie: id.version.expiry.signature ───────────────────────── */

export const signSession = (id: number, version: number, expiresAt: number) => {
  const body = `${id}.${version}.${expiresAt}`;
  return `${body}.${sign("customer", body)}`;
};

export function parseSession(raw: string, now = Date.now()) {
  if (!secret()) return null;
  const [id, version, exp, sig] = raw.split(".");
  if (!id || !version || !exp || !sig) return null;
  if (!same(sign("customer", `${id}.${version}.${exp}`), sig)) return null;
  if (!(Number(exp) > now)) return null;
  return { id: Number(id), version: Number(version) };
}

/** Where to send someone after signing in: a path on this site, never another host. */
export const safeNext = (raw: unknown, fallback = "/account") =>
  typeof raw === "string" && raw.length <= 300 && /^\/(?![/\\])[\x21-\x7e]*$/.test(raw) && !raw.includes("\\") ? raw : fallback;

const toCustomer = (r: Record<string, unknown>): Customer => ({
  id: Number(r.id),
  email: String(r.email),
  name: String(r.name ?? ""),
  phone: String(r.phone ?? ""),
  address: (r.default_address as Address | null) ?? null,
  version: Number(r.session_version),
});

/** Cached per request: the page, the checkout and an action may all ask. */
export const currentCustomer = cache(async (): Promise<Customer | null> => {
  const s = parseSession((await cookies()).get(COOKIE)?.value ?? "");
  const sql = db();
  if (!s || !sql) return null;
  const [row] = await sql`select * from customers where id = ${s.id}`;
  // A bumped session_version signs out every device holding an older cookie.
  return row && Number(row.session_version) === s.version ? toCustomer(row) : null;
});

export async function requireCustomer(next: string) {
  const c = await currentCustomer();
  if (!c) redirect(`/account/sign-in?next=${encodeURIComponent(next)}`);
  return c;
}

export async function clearCustomerCookie() {
  (await cookies()).delete(COOKIE);
}

/**
 * Makes a code for an address. Any address gets one — whether it has ordered before is never
 * revealed — and its account is created when the code is entered.
 */
export async function createCode(email: string): Promise<{ code: string } | { error: "slow" | "off" }> {
  const sql = db();
  if (!sql || !accountsEnabled()) return { error: "off" };
  const e = normaliseEmail(email);
  await sql`delete from customer_codes where created_at < now() - interval '1 day'`;
  const [recent] = await sql`select count(*)::int as n from customer_codes where email = ${e} and created_at > now() - interval '15 minutes'`;
  if (Number(recent?.n ?? 0) >= MAX_CODES_PER_15_MIN) return { error: "slow" };
  const code = makeCode();
  await sql`insert into customer_codes (email, code_hash, expires_at) values (${e}, ${hashCode(e, code)}, now() + make_interval(secs => ${CODE_TTL_SECONDS}))`;
  return { code };
}

/**
 * Checks a code and signs the customer in. Only the newest live code for the address counts, the
 * guess is counted before it is compared (so parallel guesses cannot beat the cap), and a code
 * is spent by a guarded update, so it works once.
 */
export async function verifyCode(email: string, code: string): Promise<Customer | "wrong" | "expired"> {
  const sql = db();
  if (!sql || !accountsEnabled()) return "expired";
  const e = normaliseEmail(email);
  const [row] = await sql`select id, code_hash from customer_codes where email = ${e} and used_at is null and expires_at > now() order by created_at desc, id desc limit 1`;
  if (!row) return "expired";
  const [counted] = await sql`update customer_codes set attempts = attempts + 1 where id = ${row.id} and attempts < ${MAX_ATTEMPTS} returning id`;
  if (!counted) return "expired";
  if (!same(hashCode(e, code), String(row.code_hash))) return "wrong";
  const [spent] = await sql`update customer_codes set used_at = now() where id = ${row.id} and used_at is null returning id`;
  if (!spent) return "expired";

  const [created] = await sql`insert into customers (email, last_login_at) values (${e}, now())
                              on conflict (email) do update set last_login_at = now() returning *`;
  const customer = toCustomer(created);
  (await cookies()).set(COOKIE, signSession(customer.id, customer.version, Date.now() + MAX_AGE * 1000), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE,
  });
  return customer;
}

/* ─── Details and orders ────────────────────────────────────────────────── */

/** The customer's saved details, falling back to what they typed on their last order. */
export async function savedDetails(c: Customer): Promise<SavedDetails> {
  const sql = db();
  const [last, subscribed] = await Promise.all([
    sql ? sql`select contact, address from orders where lower(contact->>'email') = ${c.email} order by created_at desc limit 1`.then((r) => r[0]) : null,
    isSubscribed(c.email),
  ]);
  const lc = (last?.contact ?? {}) as Partial<Record<"name" | "phone", string>>;
  return {
    email: c.email,
    name: c.name || lc.name || "",
    phone: c.phone || lc.phone || "",
    address: c.address ?? (last?.address as Address | undefined) ?? null,
    subscribed,
  };
}

export async function saveCustomerDetails(id: number, d: { name: string; phone: string; address: Address }) {
  const sql = db();
  if (!sql) return;
  await sql`update customers set name = ${d.name}, phone = ${d.phone},
            default_address = ${JSON.stringify(d.address)}::jsonb, updated_at = now() where id = ${id}`;
}

/** Every order placed with the verified address.   */
export async function customerOrders(email: string): Promise<CustomerOrder[]> {
  const sql = db();
  if (!sql) return [];
  return (await sql`
    select ref, status, payment_method, payment_status, total::float as total, created_at,
           (select coalesce(sum((l->>'qty')::int), 0) from jsonb_array_elements(lines) l)::int as items
    from orders
    where lower(contact->>'email') = ${normaliseEmail(email)}
    order by created_at desc limit 100`) as unknown as CustomerOrder[];
}

/* ─── Marketing consent ─────────────────────────────────────────────────── */

export async function isSubscribed(email: string) {
  const sql = db();
  if (!sql) return false;
  const [r] = await sql`select status from marketing_consents where email = ${normaliseEmail(email)}`;
  return r?.status === "subscribed";
}

/**
 * Records an explicit choice: a ticked box at checkout, the switch on /account/details, or a staff
 * unsubscribe in /admin. An unticked checkout box never calls this, so it can never undo a
 * subscription. A repeat of the current choice changes nothing, so the original date and wording
 * stand. An unsubscribe keeps the row as the record that this address must not be emailed.
 *
 * The overloads make it a type error for staff to subscribe anyone: consent comes from the customer.
 *
 * ponytail: consent record only. The marketing emails go out from an external tool that is not
 * synced, so a change reaches it by the owner's CSV export until that tool is integrated.
 */
export async function setMarketingConsent(email: string, subscribed: boolean, source: "checkout" | "account"): Promise<void>;
export async function setMarketingConsent(email: string, subscribed: false, source: "admin"): Promise<void>;
export async function setMarketingConsent(email: string, subscribed: boolean, source: "checkout" | "account" | "admin") {
  const sql = db();
  if (!sql) return;
  const e = normaliseEmail(email);
  if (subscribed)
    await sql`insert into marketing_consents (email, status, source, consent_text, subscribed_at)
              values (${e}, 'subscribed', ${source}, ${MARKETING_CONSENT_TEXT}, now())
              on conflict (email) do update set status = 'subscribed', source = excluded.source, consent_text = excluded.consent_text,
                subscribed_at = now(), unsubscribed_at = null, updated_at = now()
              where marketing_consents.status <> 'subscribed'`;
  else
    await sql`insert into marketing_consents (email, status, source, unsubscribed_at)
              values (${e}, 'unsubscribed', ${source}, now())
              on conflict (email) do update set status = 'unsubscribed', source = excluded.source, unsubscribed_at = now(), updated_at = now()
              where marketing_consents.status <> 'unsubscribed'`;
}
