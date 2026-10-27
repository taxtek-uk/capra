/**
 * Shop money self-check: the price list → basket → delivery rules, with no database.
 * Run: npm run check:shop
 */
import assert from "node:assert/strict";
import { SERIES } from "../src/content/products";
import { priceWith, type ShopItem } from "../src/lib/shop";

const cat: ShopItem[] = SERIES.map((s) => ({ id: `p:${s.slug}`, slug: s.slug, series: s, name: s.name, summary: "", image: "", href: "", group: "", fromPrice: 0, stock: null, hidden: false }));
const byModel = (id: string, variant: string) => priceWith(cat, [{ id, qty: 1, variant }]).lines[0];

// Every size of every series prices at the list price, and the colour models at +Rs 100.
const LIST: Record<string, number> = { "SLD-1": 1680, "SLD-2": 1785, "SLD-3": 2100, "RIT-010": 1753, "RIT-020": 1858, "CPR-010": 2058, "CPR-020": 2165, "SKM-1": 2058, "SKM-2": 2165, "SKM-3": 2480, "YKC-1": 1860, "YKC-2": 1965, "YKC-3": 2280, "MS-600": 885, "MS-750": 915, BM600: 905, BM1000: 1050 };
for (const s of SERIES) for (const z of s.sizes) {
  assert.equal(z.price, LIST[z.model], `${z.model} list price`);
  for (const c of s.colours) {
    const l = byModel(`p:${s.slug}`, `${z.value}/${c.value}`);
    assert.equal(l.unit, LIST[z.model] + c.add);
    assert.equal(l.sku, `${c.prefix}${z.model}`);
  }
}
assert.equal(byModel("p:sld-vacuum-jug", "2l/copper").sku, "CSLD-2");
assert.equal(byModel("p:sld-vacuum-jug", "2l/copper").unit, 1885);

// Client-sent prices are ignored; unknown ids are rejected; junk variants fall back to the first option.
const c1 = priceWith(cat, [{ id: "p:sld-vacuum-jug", qty: 2, variant: "1l/steel", price: 1 }, { id: "p:nope", qty: 1 }, { id: "p:bm-bullet-flask", qty: 1, variant: "x/y" }]);
assert.deepEqual(c1.rejected, ["p:nope"]);
// Jugs sell by the carton of 12 (2 is raised to 12); bottles sell singly. Delivery is never added.
assert.deepEqual(c1.lines.map((l) => [l.qty, l.min]), [[12, 12], [1, 1]]);
assert.equal(c1.subtotal, 12 * 1680 + 905);
assert.equal(c1.delivery, 0);
assert.equal(c1.total, c1.subtotal);

// Quantities clamp to stock; sold out, or fewer than a carton left, is rejected.
const limited = cat.map((i) => (i.slug === "rit-push-button-flask" ? { ...i, stock: 14 } : i.slug === "cpr-vacuum-pot" ? { ...i, stock: 0 } : i.slug === "sld-vacuum-jug" ? { ...i, stock: 11 } : i));
const c2 = priceWith(limited, [{ id: "p:rit-push-button-flask", qty: 20 }, { id: "p:cpr-vacuum-pot", qty: 12 }, { id: "p:sld-vacuum-jug", qty: 12 }]);
assert.equal(c2.lines[0].qty, 14);
assert.ok(c2.lines[0].clamped);
assert.deepEqual(c2.rejected, ["p:cpr-vacuum-pot", "p:sld-vacuum-jug"]);
// Two lines for the same variant merge and still respect the cap.
assert.equal(priceWith(limited, [{ id: "p:rit-push-button-flask", qty: 10, variant: "1l/steel" }, { id: "p:rit-push-button-flask", qty: 10, variant: "1l/steel" }, { id: "p:rit-push-button-flask", qty: 1 }]).lines[0].qty, 14);
assert.equal(priceWith(cat, []).total, 0);

console.log("check:shop passed");
