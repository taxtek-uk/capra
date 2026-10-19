import { db } from "@/lib/db";
import { normaliseEmail, setMarketingConsent, type Address } from "@/lib/customer";

/**
 * The /admin side of customers: one person per lower-case email across orders, enquiries and accounts,
 * so a guest who never signed in is still a customer here. Orders placed without an email are grouped by
 * phone in /admin/orders instead.
 */
export const customerHref = (email: string) => `/admin/customers/${encodeURIComponent(normaliseEmail(email))}`;

export type CustomerSummary = { email: string; name: string | null; orders: number; spent: number; enquiries: number; last_at: string; has_account: boolean; consent: string | null };

export const CUSTOMER_FILTERS = [["", "Everyone"], ["buyers", "Has ordered"], ["account", "Has an account"], ["subscribed", "Subscribed to marketing"]] as const;
export const LIST_LIMIT = 200;

/**
 * Everyone we have heard from, most recent first. `spent` counts orders that were not cancelled.
 * ponytail: grouped live over three tables and capped at 200 rows; add a materialised view if it gets slow.
 */
export async function listCustomers(f: { q: string; show: string }): Promise<CustomerSummary[] | null> {
  const sql = db();
  if (!sql) return null;
  const like = `%${f.q}%`;
  return (await sql`
    with activity as (
      select lower(contact->>'email') as email, contact->>'name' as name, created_at, 'order' as kind,
             case when status <> 'cancelled' then total else 0 end as spent
      from orders
      union all select lower(email), name, created_at, 'enquiry', 0 from enquiries
      union all select email, name, coalesce(last_login_at, created_at), 'account', 0 from customers
    )
    select a.email,
           coalesce(max(c.name), (array_agg(a.name order by a.created_at desc) filter (where coalesce(a.name, '') <> ''))[1]) as name,
           count(*) filter (where a.kind = 'order')::int as orders,
           coalesce(sum(a.spent), 0)::float as spent,
           count(*) filter (where a.kind = 'enquiry')::int as enquiries,
           max(a.created_at) as last_at,
           bool_or(c.id is not null) as has_account,
           max(m.status) as consent
    from activity a
    left join customers c on c.email = a.email
    left join marketing_consents m on m.email = a.email
    where coalesce(a.email, '') <> ''
    group by a.email
    having (${f.q}::text = '' or a.email ilike ${like} or bool_or(a.name ilike ${like}))
       and (${f.show}::text = ''
            or (${f.show}::text = 'buyers' and count(*) filter (where a.kind = 'order') > 0)
            or (${f.show}::text = 'account' and bool_or(c.id is not null))
            or (${f.show}::text = 'subscribed' and max(m.status) = 'subscribed'))
    order by max(a.created_at) desc
    limit ${LIST_LIMIT}`) as unknown as CustomerSummary[];
}

export type CustomerProfile = {
  email: string;
  account: { name: string | null; phone: string | null; address: Address | null; created_at: string; last_login_at: string | null } | null;
  consent: { status: string; source: string; consent_text: string | null; subscribed_at: string | null; unsubscribed_at: string | null } | null;
  orders: { ref: string; status: string; payment_method: string; payment_status: string; total: number; created_at: string; name: string | null; phone: string | null; address: Address | null }[];
  enquiries: { ref: string | null; kind: string; subject: string | null; product: string | null; status: string; created_at: string; name: string | null; phone: string | null }[];
};

export async function customerProfile(email: string): Promise<CustomerProfile | null> {
  const sql = db();
  if (!sql) return null;
  const e = normaliseEmail(email);
  const [accounts, consents, orders, enquiries] = await Promise.all([
    sql`select name, phone, default_address as address, created_at, last_login_at from customers where email = ${e}`,
    sql`select status, source, consent_text, subscribed_at, unsubscribed_at from marketing_consents where email = ${e}`,
    sql`select ref, status, payment_method, payment_status, total::float as total, created_at, contact->>'name' as name, contact->>'phone' as phone, address
        from orders where lower(contact->>'email') = ${e} order by created_at desc`,
    sql`select ref, kind, subject, product, status, created_at, name, phone from enquiries where lower(email) = ${e} order by created_at desc`,
  ]);
  if (!accounts.length && !consents.length && !orders.length && !enquiries.length) return null;
  return { email: e, account: accounts[0] ?? null, consent: consents[0] ?? null, orders, enquiries } as unknown as CustomerProfile;
}

/** Every consent record for the external mailing tool. Unsubscribed rows are included on purpose: import them as do-not-email. */
export async function consentExportRows() {
  const sql = db();
  if (!sql) return [];
  return sql`
    select m.email, m.status, m.source, m.subscribed_at, m.unsubscribed_at, m.consent_text,
           coalesce(c.name, (select o.contact->>'name' from orders o where lower(o.contact->>'email') = m.email order by o.created_at desc limit 1)) as name
    from marketing_consents m left join customers c on c.email = m.email
    order by m.updated_at desc`;
}

/** Signs a customer out everywhere: every cookie they hold carries the old version. */
export async function signOutEverywhere(email: string) {
  const sql = db();
  if (!sql) return;
  await sql`update customers set session_version = session_version + 1, updated_at = now() where email = ${normaliseEmail(email)}`;
}

export const unsubscribeByStaff = (email: string) => setMarketingConsent(email, false, "admin");

/** Deletes saved details, codes and sessions and unsubscribes the address. Orders are kept: they are records of a sale. */
export async function deleteCustomerAccount(email: string) {
  const sql = db();
  if (!sql) return;
  const e = normaliseEmail(email);
  await sql`delete from customer_codes where email = ${e}`;
  await sql`delete from customers where email = ${e}`;
  await unsubscribeByStaff(e);
}
