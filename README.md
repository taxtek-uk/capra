# CAPRA — capra.pk

E-commerce store for CAPRA vacuum jugs, thermos flasks and insulated bottles, made by CAPRA in
Gujranwala and sold across Pakistan with cash on delivery. Built on the same stack and design system as
thewallshop: Next.js 16 App Router, React 19, Tailwind v4 (`@theme` tokens in `src/app/globals.css`),
Neon Postgres, Resend, deployed on Vercel.

## Map

| Where | What |
| --- | --- |
| `src/content/products.ts` | The range and **every price** (factory list of 1 Oct 2026 + Rs 200). The only place a price is written. |
| `src/lib/brand.ts` | Name, contact, address, hours, delivery fee, warranty, payment accounts, service cities. |
| `src/lib/shop.ts` | Catalogue + server-side basket pricing (`priceWith`), variants, stock. |
| `src/app/api/order` | Places an order: validates, re-prices, stores, takes stock, emails. |
| `src/lib/orders.ts` | Order reads, signed order links, stock sync. |
| `src/lib/customer.ts` | Customer accounts (6-digit emailed code, no passwords) and marketing consent. |
| `src/app/admin/**` | Dashboard: orders, enquiries, customers, saved baskets, products, journal, analytics, users. |
| `src/lib/seo.tsx` | Metadata and JSON-LD builders. `src/app/{sitemap,robots,manifest}.ts`, `llms.txt`, `md/`, `og/`. |
| `src/content/blog.ts` | Built-in journal posts (database rows with the same slug win). |
| `docs/schema.sql` | Database schema. `docs/seo-keywords.md`: researched keyword map, city strategy and SEO/GEO rollout. |
| `scripts/make-icons.mjs` | Regenerates every favicon, PWA icon, tile and the OG card from `brand/capra-logo.png`. |

## Setup

```bash
npm install
cp .env.example .env.local        # fill in; see comments
node scripts/apply-schema.mjs     # creates the tables (idempotent)
node scripts/seed-admin-user.mjs "Name" you@capra.pk owner 'a-long-password'
npm run dev
```

Before deploying: verify `capra.pk` in Resend, set the env vars on Vercel, point `capra.pk` → `www.capra.pk`,
and fill `PAYMENT_ACCOUNTS` in `src/lib/brand.ts` with the bank, JazzCash and Easypaisa details.

## Checks

```bash
npm run typecheck && npm run lint
npm run check:shop                 # price list → basket → delivery rules
npm run check:db                   # every SQL path against an in-memory Postgres
npm run build && npm run check:seo # titles, descriptions, H1s, canonicals, JSON-LD, sitemap
npm run start -- --port 3100       # production server for browser/lab checks
npm run check:browser             # all public routes, links, Markdown, city search, capacity quick-add
npm run audit:lighthouse          # all sitemap pages; mobile, budget 90/100/100/100
```

## Changing things

- **A price**: edit `src/content/products.ts`, run `npm run check:shop` (update its `LIST` too), deploy.
- **Stock, listing, product copy, SEO title**: `/admin/products`, no deploy.
- **A blog post**: `/admin/journal`.
- **The logo**: replace `brand/capra-logo.png`, run `npm run icons`.

## Pakistan market coverage

`src/content/collections.ts` defines ten buying decisions under `/thermos-flasks`.
`src/content/pakistan-localities.json` and `src/content/markets.ts` drive seven regional delivery pages.
The directory includes PBS Census 2023 urban localities plus selected GB/AJK destinations; it is not a list
of branches, verified stockists or guaranteed courier coverage. `docs/research/sources.json` records provenance.

`/dealers` integrates the owner-provided 2026 catalogue. The PDF is a dated snapshot; live prices still come
from the shop. Retail and trade WhatsApp contacts are deliberately separate in `src/lib/brand.ts`.
`docs/dealer-intelligence.md` records what the catalogue establishes and what remains unknown.

Keyword research and candidate city phrases are in `docs/research/`. Volume/difficulty fields are unknown;
autocomplete and generated locality phrases do not establish demand. See `docs/seo-keywords.md` for mapping,
sources and rollout measurement. Audit HTML/JSON and responsive screenshots are saved under ignored
`artifacts/`. For selected desktop audits, use `AUDIT_DEVICE=desktop AUDIT_PATHS=/,/shop npm run audit:lighthouse`.
