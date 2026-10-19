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
const LIST: Record<string, number> = { "SLD-1": 1480, "SLD-2": 1585, "SLD-3": 1900, "RIT-010": 1553, "RIT-020": 1658, "CPR-010": 1858, "CPR-020": 1965, "SKM-1": 1858, "SKM-2": 1965, "SKM-3": 2280, "YKC-1": 1660, "YKC-2": 1765, "YKC-3": 2080, "MS-600": 685, "MS-750": 715, BM600: 705, BM1000: 850 };
for (const s of SERIES) for (const z of s.sizes) {
  assert.equal(z.price, LIST[z.model], `${z.model} list price`);
  for (const c of s.colours) {
    const l = byModel(`p:${s.slug}`, `${z.value}/${c.value}`);
    assert.equal(l.unit, LIST[z.model] + c.add);
    assert.equal(l.sku, `${c.prefix}${z.model}`);
  }
}
assert.equal(byModel("p:sld-vacuum-jug", "2l/copper").sku, "CSLD-2");
assert.equal(byModel("p:sld-vacuum-jug", "2l/copper").unit, 1685);

// Client-sent prices are ignored; unknown ids are rejected; junk variants fall back to the first option.
const c1 = priceWith(cat, [{ id: "p:sld-vacuum-jug", qty: 2, variant: "1l/steel", price: 1 }, { id: "p:nope", qty: 1 }, { id: "p:bm-bullet-flask", qty: 1, variant: "x/y" }]);
assert.deepEqual(c1.rejected, ["p:nope"]);
assert.equal(c1.subtotal, 2 * 1480 + 705);
assert.equal(c1.delivery, 250);
assert.equal(c1.total, c1.subtotal + 250);

// Free delivery from Rs 5,000; quantities clamp to stock; sold out is rejected.
assert.equal(priceWith(cat, [{ id: "p:skm-vacuum-coffee-pot", qty: 3, variant: "3l/steel" }]).delivery, 0);
const limited = cat.map((i) => (i.slug === "rit-push-button-flask" ? { ...i, stock: 2 } : i.slug === "cpr-vacuum-pot" ? { ...i, stock: 0 } : i));
const c2 = priceWith(limited, [{ id: "p:rit-push-button-flask", qty: 5 }, { id: "p:cpr-vacuum-pot", qty: 1 }]);
assert.equal(c2.lines[0].qty, 2);
assert.ok(c2.lines[0].clamped);
assert.deepEqual(c2.rejected, ["p:cpr-vacuum-pot"]);
// Two lines for the same variant merge and still respect the cap.
assert.equal(priceWith(limited, [{ id: "p:rit-push-button-flask", qty: 1, variant: "1l/steel" }, { id: "p:rit-push-button-flask", qty: 1, variant: "1l/steel" }, { id: "p:rit-push-button-flask", qty: 1 }]).lines[0].qty, 2);
assert.equal(priceWith(cat, []).total, 0);

console.log("check:shop passed");
