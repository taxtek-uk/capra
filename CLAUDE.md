# CLAUDE.md — capra.pk

Next.js 16 App Router + React 19 + Tailwind v4 (`@theme` tokens in `src/app/globals.css`). Neon Postgres, Resend, Vercel. See README for the map. Mirrors github/thewallshop's patterns; read it when in doubt.

## Binding rules
- **Prices live only in `src/content/products.ts`**: whole rupees, the factory list (owner, 19 Oct 2026: retail = list price). A colour model is the "C" prefix of the same size at +Rs 100. Never write a price in a page, email or JSON-LD; read it through `src/lib/shop.ts`. A price change updates `LIST` in `scripts/check-shop.ts`.
- The basket holds ids, variants and quantities only. `/api/cart`, `/api/order` and `/api/saved-basket` re-price through `priceWith()`; a client-sent price is never read, stored or emailed. An order row's `lines`/`totals` are read back verbatim, never recalculated.
- Payments are cash on delivery, bank transfer, JazzCash and Easypaisa (no gateway). Account details come only from `PAYMENT_ACCOUNTS` in `src/lib/brand.ts`; never invent them.
- Phone is required at checkout and validated as Pakistani (`isPkPhone`); email is optional. An order without email gets no customer email, so the order page (signed link) and WhatsApp confirm it.
- `/order/[ref]` opens only with the `?k=` token (built by `orderPath()`), an admin session, or a signed-in customer whose verified email matches. Without `CUSTOMER_SESSION_SECRET` it fails closed.
- Stock is counted per series in `products.stock` (null = no cap). Only `syncOrderStock()` moves it, guarded by `stock_taken_at`. Every live order holds stock; cancelling returns it.
- /admin owns copy, image, SEO, listing and stock — never a price.
- SQL only through the neon tagged template; no ORM. Schema changes go in `docs/schema.sql` (idempotent) and must keep `npm run check:db` passing.
- Zod validates every API body. `escapeHtml()` every user value in email HTML. Rate limit before validation (`rateLimit()`, counted in the database; customer-capturing routes pass `"open"`).
- Company identity, contact details, delivery terms and service cities come from `src/lib/brand.ts`. One email address in copy: `CONTACT.email`.
- Never invent reviews, ratings or `aggregateRating`, or retention-hour claims the owner has not given.
- SEO is gated: `npm run build && npm run check:seo` must pass (title ≤ 60, description 70–160, one H1, canonical, BreadcrumbList/WebSite/LocalBusiness, alt text, sitemap integrity). Every public route sets `pageMeta()`; every page but the homepage has breadcrumbs.
- Client components must not call `useSearchParams()`; use `useSearchString()`.
- Above-the-fold headings use `.rise`, never an opacity-0 initial style.
- Tailwind v4 only; icons inline SVG or `lucide-react`. /admin uses the neutral `.dash` UI in `src/components/admin/ui.tsx`.
- Visit tracking is first-party: no raw IP stored (salted hash), bots dropped, beacons never fail a page.

## Commands
`npm run dev` · `npm run build` · `npm run typecheck` · `npm run lint` · `npm run check:shop` · `npm run check:db` · `npm run check:seo` (after a build) · `npm run icons` · `node scripts/apply-schema.mjs`
