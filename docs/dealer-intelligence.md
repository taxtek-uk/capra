# CAPRA dealer intelligence

Source: owner-provided `~/Downloads/CAPRA Dealer Catalogue 2026.pdf`, 11 pages, inspected 19 October 2026. Public copy: `public/documents/capra-dealer-catalogue-2026.pdf`. File hash and source provenance are in `docs/research/sources.json`.

## What the document establishes

The document is a trade sales catalogue, not a customer/dealer database. There are **no named dealers, distributor territories, outlet addresses, dealer purchase histories, margins or dealer-specific agreements**. The blank fields on page 10 are an order form, not filled-in dealer records. Do not turn them into a fabricated directory.

| Evidence | Pages | Application |
| --- | --- | --- |
| Salman Industries, factory in Gujranwala, established 2019 | 1–2, 11 | Manufacturer identity and supply origin |
| 7 designs and 17 base capacity models, 600 ml–3 L | 1–2, 3–10 | Collection filters and trade range summary |
| SLD 1/2/3 L, RIT 1/2 L, CPR 1/2 L, SKM 1/2/3 L, YKC 1/2/3 L | 3–7, 10 | Accurate capacity pages; no imaginary 3 L RIT/CPR |
| MS 600/750 ml; BM 600 ml/1 L | 8–10 | School/sports and travel pages; no 500 ml offer |
| C-prefixed colour jugs are the matching base model with a surcharge | 3–7, 10 | Read colour prices from the existing pricing source |
| CPR supplied in a printed CAPRA gift box | 5 | Gift page with verified packaging |
| MS/BM bottles: 36 pieces per carton, mixed colours; MS mentions four-colour mix | 8–11 | Trade FAQ and quotation requirements |
| Factory list effective 1 October 2026; dealer/carton rates on request | 1, 10–11 | No invented discounts or published dealer margins |
| Normally dispatch in 1–2 working days via cargo or courier | 11 | Distinguish dispatch from arrival and trade freight from retail shipping |
| 24-month manufacturing-fault warranty | 2, 11 | Link to existing warranty conditions |
| Trade WhatsApp +92 333 3324568 | 1, 10–11 | Separate `TRADE` contact in `src/lib/brand.ts` |
| Phone 055 4253697 and info@capra.pk | 11 | Matches existing company contact |

## Sales opportunities inferred from the range

These are merchandising hypotheses, not measured demand or existing dealer relationships.

- Crockery and household retailers: SLD and YKC as everyday shared tea jugs; compare capacity and lid at the shelf.
- Office procurement and counter service: RIT for repeated one-hand pouring; SKM for coffee, kahwa and meeting tables.
- Wedding, Eid and staff gifting: CPR boxed pots and other boxed jugs, with stock and event date checked before promising delivery. No guaranteed printing, engraving or wrapping service is established.
- School, sports and travel shops: MS bottles with strap/grip sleeve; BM personal flasks with cup caps. Confirm actual colour mixes.
- Guesthouses and hospitality buyers: serving jugs plus personal drinkware; route and freight confirmation especially matters for northern and remote destinations.

## Dealer enquiry fields

The existing wholesale form/WhatsApp flow can capture the shop name, city, complete address, contact, model codes, sizes, finishes, quantities/cartons, required date and transport preference. Do not assume exclusivity, minimum order quantities for jugs, credit terms, margins or custom branding: these are not stated.

## Geographic expansion

The seven region pages link to factory trade enquiries and address guidance. The locality directory identifies destinations and does not assert local branches or authorised stockists. To publish a future stockist page, obtain the business's trading name, public business phone/address, permission to publish, relationship status and last verification date. No outreach was performed as part of this work.

## Reconciliation

The catalogue uses a different WhatsApp number from the existing retail site. Both are retained with explicit purposes; the catalogue number is used only for trade resources. The PDF is a dated snapshot; current website prices still come from `src/content/products.ts` via shop helpers. No catalogue-derived price is hardcoded into a new page. The catalogue's model prices were compared with the shipped range; no price edit was required.
