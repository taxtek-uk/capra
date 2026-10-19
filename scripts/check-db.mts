/**
 * Database self-check: applies docs/schema.sql to an in-memory Postgres (PGlite) and runs the real
 * order, stock, customer, consent, saved-basket, analytics and rate-limit queries against it.
 * Touches no real database. Run: npm run check:db
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { setCheckDb } from "../src/lib/db";
import { priceCart } from "../src/lib/shop";
import { syncOrderStock, getOrder, type OrderRow } from "../src/lib/orders";
import { listCustomers, customerProfile, consentExportRows, deleteCustomerAccount } from "../src/lib/customers-admin";
import { setMarketingConsent, isSubscribed, customerOrders } from "../src/lib/customer";
import { saveBasket, basketByLink, dueReminders, claimReminder, purgeOldBaskets, listSavedBaskets } from "../src/lib/saved-baskets";
import { overview, series, topPages, sources, places, channels, activity, allTime, breakdown, topEvents, webVitals, recentSessions } from "../src/lib/analytics";
import { rateLimit } from "../src/lib/ratelimit";
import { overrides } from "../src/lib/catalogue";
import { allJournal } from "../src/lib/posts";

const pg = new PGlite();
const src = fs.readFileSync("docs/schema.sql", "utf8").split("\n").map((l) => l.replace(/--.*$/, "")).join("\n");
for (const stmt of src.split(";").map((s) => s.trim()).filter(Boolean)) await pg.exec(stmt);
const query = (strings: TemplateStringsArray, ...vals: unknown[]) => pg.query<Record<string, unknown>>(strings.reduce((a, s, i) => a + "$" + i + s), vals).then((r) => r.rows);
const sql = query as never;
setCheckDb(sql);

// Products override + stock.
await pg.query("insert into products (slug, stock, keywords) values ('rit-push-button-flask', 3, '{a,b}')");
assert.equal((await overrides()).get("rit-push-button-flask")?.stock, 3);
const cart = await priceCart([{ id: "p:rit-push-button-flask", qty: 5, variant: "2l/blue" }]);
assert.equal(cart.lines[0].qty, 3); assert.equal(cart.lines[0].sku, "CRIT-020"); assert.equal(cart.total, 3 * 1758);

// Order insert exactly as /api/order does, then stock take and give-back on cancel.
const lines = cart.lines.map((l) => ({ id: l.id, sku: l.sku, name: l.name, qty: l.qty, unit: l.unit, amount: l.amount, variant: l.variant, variantLabel: l.variantLabel }));
const [order] = (await query`insert into orders (ref, payment_method, contact, address, lines, totals, total, page, ip, meta)
  values (${"CAP-T1"}, ${"cod"}, ${JSON.stringify({ name: "Ali Khan", phone: "03001234567", email: "ali@example.com", notes: "" })}::jsonb, ${JSON.stringify({ line1: "H1", line2: "", city: "Lahore", province: "Punjab", postcode: "" })}::jsonb,
  ${JSON.stringify(lines)}::jsonb, ${JSON.stringify({ subtotal: cart.subtotal, delivery: cart.delivery, total: cart.total })}::jsonb, ${cart.total}, ${"/checkout"}, ${"1.1.1.1"}, ${"{}"}::jsonb) returning *`) as unknown as OrderRow[];
assert.equal(await syncOrderStock(order), true);
assert.equal(await syncOrderStock(order), false, "replay moves nothing");
assert.equal((await overrides()).get("rit-push-button-flask")?.stock, 0);
await pg.query("update orders set status = 'cancelled' where ref = 'CAP-T1'");
assert.equal(await syncOrderStock((await getOrder("CAP-T1"))!), true);
assert.equal((await overrides()).get("rit-push-button-flask")?.stock, 3);

// Customers, consent, account deletion.
await pg.query("insert into enquiries (ref, kind, name, email, phone) values ('ENQ-1', 'wholesale', 'Sara', 'sara@example.com', '03211234567')");
await setMarketingConsent("Ali@Example.com", true, "checkout");
assert.equal(await isSubscribed("ali@example.com"), true);
const people = await listCustomers({ q: "", show: "" });
assert.equal(people?.length, 2);
assert.equal((await listCustomers({ q: "", show: "subscribed" }))?.[0].email, "ali@example.com");
assert.equal((await customerProfile("ali@example.com"))?.orders.length, 1);
assert.equal((await customerOrders("ali@example.com")).length, 1);
assert.equal((await consentExportRows()).length, 1);
await deleteCustomerAccount("ali@example.com");
assert.equal(await isSubscribed("ali@example.com"), false);

// Saved baskets: save, reopen by link, reminder window and claim.
const saved = await saveBasket({ email: "zara@example.com", items: [{ id: "p:bm-bullet-flask", qty: 1, variant: "1l/black" }], total: 1100, page: "/cart", remind: true });
assert.equal((await basketByLink(`${saved.id}.${saved.token}`))?.items[0].id, "p:bm-bullet-flask");
assert.equal(await basketByLink(`${saved.id}.wrongtoken`), null);
await pg.query("update saved_baskets set created_at = now() - interval '30 hours'");
assert.equal((await dueReminders()).length, 1);
assert.equal(await claimReminder(saved.id), true);
assert.equal(await claimReminder(saved.id), false);
assert.equal((await dueReminders()).length, 0);
assert.equal((await listSavedBaskets("zara")).length, 1);
assert.equal(await purgeOldBaskets(), 0);

// Analytics reads and rate limits run against the real schema.
await pg.query("insert into sessions (id, visitor_id, landing_path, views) values ('s1','v1','/',2)");
await pg.query("insert into page_views (id, session_id, visitor_id, path) values ('p1','s1','v1','/')");
await pg.query("insert into events (session_id, visitor_id, name, label, meta) values ('s1','v1','web_vital','LCP','{\"value\":1200}')");
await Promise.all([overview(30), series(30), topPages(30), sources(30), places(30), channels(30), activity(10), allTime(), breakdown(30, "device"), topEvents(30), webVitals(30), recentSessions()]);
assert.equal((await activity(10)).length, 2);
for (let i = 0; i < 3; i++) assert.equal((await rateLimit("t", 3, 60_000)).ok, true);
assert.equal((await rateLimit("t", 3, 60_000)).ok, false);
assert.ok((await allJournal()).length >= 4);
console.log("check-db passed");
