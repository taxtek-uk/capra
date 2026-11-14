/**
 * Shop money self-check: the price list → basket → delivery rules, with no database.
 * Run: npm run check:shop
 */
import assert from "node:assert/strict";
import { SERIES } from "../src/content/products";
import { priceWith, variantFacts, type ShopItem } from "../src/lib/shop";

const cat: ShopItem[] = SERIES.map((s) => ({ id: `p:${s.slug}`, slug: s.slug, series: s, name: s.name, summary: "", image: "", href: "", group: "", fromPrice: 0, fromWas: 0, stock: null, hidden: false }));
const byModel = (id: string, variant: string) => priceWith(cat, [{ id, qty: 1, variant }]).lines[0];

// Every size lists at LIST and sells at 20% off it; the colour models add Rs 120 on the list, Rs 96 after the discount.
const sale = (list: number) => Math.round(list * 0.8);
const LIST: Record<string, number> = { "SLD-1": 2016, "SLD-2": 2142, "SLD-3": 2520, "RIT-010": 2104, "RIT-020": 2230, "CPR-010": 2470, "CPR-020": 2598, "SKM-1": 2470, "SKM-2": 2598, "SKM-3": 2976, "YKC-1": 2232, "YKC-2": 2358, "YKC-3": 2736, "MS-600": 1062, "MS-750": 1098, BM600: 1086, BM1000: 1260 };
for (const s of SERIES) for (const z of s.sizes) {
  assert.equal(z.was, LIST[z.model], `${z.model} list price`);
  assert.equal(z.price, sale(LIST[z.model]), `${z.model} sale price`);
  for (const c of s.colours) {
    const l = byModel(`p:${s.slug}`, `${z.value}/${c.value}`);
    assert.equal(l.unit, sale(LIST[z.model]) + (c.prefix ? 96 : 0));
    assert.equal(variantFacts(s, l.variant).was, LIST[z.model] + (c.prefix ? 120 : 0));
    assert.equal(l.sku, `${c.prefix}${z.model}`);
  }
}
assert.equal(byModel("p:sld-vacuum-jug", "2l/copper").sku, "CSLD-2");
assert.equal(byModel("p:sld-vacuum-jug", "2l/copper").unit, 1810);

// Client-sent prices are ignored; unknown ids are rejected; junk variants fall back to the first option.
const c1 = priceWith(cat, [{ id: "p:sld-vacuum-jug", qty: 2, variant: "1l/steel", price: 1 }, { id: "p:nope", qty: 1 }, { id: "p:bm-bullet-flask", qty: 1, variant: "x/y" }]);
assert.deepEqual(c1.rejected, ["p:nope"]);
// Jugs sell by the carton of 12 (2 is raised to 12); bottles sell singly. Delivery is never added.
assert.deepEqual(c1.lines.map((l) => [l.qty, l.min]), [[12, 12], [1, 1]]);
assert.equal(c1.subtotal, 12 * 1613 + 869);
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
