# SEO, browser and performance validation

Validated 19 October 2026 against a local **production build**, not the deployed domain. Full machine-readable results: `docs/research/audit-summary.json`. Raw Lighthouse HTML/JSON and responsive screenshots are in the ignored `artifacts/` directory.

## Outcomes

| Scope | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| 44 public mobile pages excluding home | 93–99 | 100 | 100 | 100 |
| Homepage, 3 isolated mobile reruns | 90 / 96 / 93 (median 93) | 100 | 100 | 100 |
| 8 sampled desktop pages | 100 | 100 | 100 | 100 |
| 4 public private-entry screens, mobile | 91–99 | 100 | 100 | Excluded: noindex |

The initial homepage baseline was **84** performance with LCP about **4.1 seconds**. The full 45-page post-change mobile sweep recorded one below-budget result, homepage **88**; all other routes passed. The subsequent homepage runs above all met the 90-point performance budget. The report preserves the 88 and every repeat rather than substituting the best result. The homepage repeat LCP range was **2.68–3.41 seconds**, so its 2.5-second LCP target remains an opportunity despite green overall performance scores. This is lab evidence and does not establish live Core Web Vitals or guaranteed scores on every run.

## Changes that affect performance and quality

- Hero images receive an explicit high-priority preload. Mobile heroes no longer use scroll parallax or SVG turbulence overlays; the desktop treatment remains.
- Product-card image size hints reflect actual grid gutters and maximum card width.
- Footer WebGL context creation, shader compilation and animation wait until the footer is near the viewport. GPU resources are released on cleanup; hidden tabs stop animating, and reduced-motion/save-data users receive the CSS gradient.
- Collection tables read exact variants through shop helpers. A capacity-specific quick-add uses that capacity, including after changing collections.
- Organization price bounds are derived from the product price source; the homepage description no longer hardcodes a starting price. Answer-engine product lists respect listed/sellable catalogue entries.

## Checks completed

- `npm run build`: production build passed, including type checking.
- `npm run typecheck` and `npm run lint`: passed.
- `npm run check:shop` and `npm run check:db`: passed; database checks use the existing in-memory test harness.
- `npm run check:seo`: **45 indexable pages, 45 sitemap URLs, zero issues**. Checks titles/descriptions, duplicate metadata, one H1, canonical tags, JSON-LD, image alt attributes and sitemap integrity.
- `npm run check:browser`: **45 indexable pages, 49 internal destinations**, 390 px mobile checks, links and district anchors, canonical URLs, missing routes, private Markdown rejection, new public Markdown variants, combined thermos/city search and 3 L quick-add. No browser exceptions.
- Representative pages checked at **390, 768, 1024 and 1440 px** without horizontal page overflow. Wide comparison tables intentionally scroll inside their containers.
- Browser verification confirms no footer WebGL initialisation during the first viewport and successful rendering after approaching the footer. Synthetic browser analytics are intercepted.

## Audited URLs

Public mobile uses Lighthouse default mobile settings: 412 × 823 CSS px, DPR 1.75, simulated 4G and 4× CPU slowdown. All 45 sitemap pages were audited sequentially. The homepage was repeated three times in isolation.

| Public page | Mobile performance in full sweep | Accessibility / best practices / SEO |
| --- | --- | --- |
| `/` | 88 | 100 / 100 / 100 |
| `/shop` | 93 | 100 / 100 / 100 |
| `/vacuum-jugs` | 96 | 100 / 100 / 100 |
| `/insulated-bottles` | 96 | 100 / 100 / 100 |
| `/prices` | 97 | 100 / 100 / 100 |
| `/vacuum-jugs/sld-vacuum-jug` | 98 | 100 / 100 / 100 |
| `/vacuum-jugs/rit-push-button-flask` | 98 | 100 / 100 / 100 |
| `/vacuum-jugs/cpr-vacuum-pot` | 97 | 100 / 100 / 100 |
| `/vacuum-jugs/skm-vacuum-coffee-pot` | 98 | 100 / 100 / 100 |
| `/vacuum-jugs/ykc-vacuum-jug` | 98 | 100 / 100 / 100 |
| `/insulated-bottles/ms-sports-bottle` | 97 | 100 / 100 / 100 |
| `/insulated-bottles/bm-bullet-flask` | 97 | 100 / 100 / 100 |
| `/wholesale` | 97 | 100 / 100 / 100 |
| `/blog` | 94 | 100 / 100 / 100 |
| `/dealers` | 98 | 100 / 100 / 100 |
| `/thermos-flasks` | 98 | 100 / 100 / 100 |
| `/thermos-flasks/1-litre` | 97 | 100 / 100 / 100 |
| `/thermos-flasks/2-litre` | 97 | 100 / 100 / 100 |
| `/thermos-flasks/3-litre` | 99 | 100 / 100 / 100 |
| `/thermos-flasks/tea` | 98 | 100 / 100 / 100 |
| `/thermos-flasks/coffee` | 98 | 100 / 100 / 100 |
| `/thermos-flasks/hot-water` | 97 | 100 / 100 / 100 |
| `/thermos-flasks/office` | 97 | 100 / 100 / 100 |
| `/thermos-flasks/travel` | 97 | 100 / 100 / 100 |
| `/thermos-flasks/school` | 97 | 100 / 100 / 100 |
| `/thermos-flasks/gifts` | 97 | 100 / 100 / 100 |
| `/delivery/punjab` | 98 | 100 / 100 / 100 |
| `/delivery/sindh` | 98 | 100 / 100 / 100 |
| `/delivery/khyber-pakhtunkhwa` | 98 | 100 / 100 / 100 |
| `/delivery/balochistan` | 94 | 100 / 100 / 100 |
| `/delivery/islamabad` | 98 | 100 / 100 / 100 |
| `/delivery/gilgit-baltistan` | 98 | 100 / 100 / 100 |
| `/delivery/azad-kashmir` | 98 | 100 / 100 / 100 |
| `/blog/thermos-price-in-pakistan` | 98 | 100 / 100 / 100 |
| `/blog/how-to-choose-a-vacuum-flask` | 98 | 100 / 100 / 100 |
| `/blog/how-long-does-a-vacuum-flask-keep-tea-hot` | 94 | 100 / 100 / 100 |
| `/blog/how-to-clean-a-thermos-flask` | 98 | 100 / 100 / 100 |
| `/delivery` | 98 | 100 / 100 / 100 |
| `/help` | 98 | 100 / 100 / 100 |
| `/care-guide` | 94 | 100 / 100 / 100 |
| `/warranty` | 98 | 100 / 100 / 100 |
| `/about` | 94 | 100 / 100 / 100 |
| `/contact` | 97 | 100 / 100 / 100 |
| `/privacy-policy` | 98 | 100 / 100 / 100 |
| `/terms-of-service` | 98 | 100 / 100 / 100 |

Desktop uses the official Lighthouse desktop configuration. Sampled routes: `/`, `/shop`, `/prices`, `/vacuum-jugs/sld-vacuum-jug`, `/thermos-flasks/3-litre`, `/delivery/punjab`, `/dealers`, `/contact`.

Private-entry mobile routes: `/cart` (91), `/checkout` (99), `/account/sign-in` (95), `/admin/login` (99). These checks load public entry or empty-basket states. They do not exercise authenticated admin content or a completed purchase.

## Reproduce

```sh
npm run build
npm run check:seo
npm run start -- --port 3100
```

In another terminal, with the production server running:

```sh
npm run check:browser
npm run audit:lighthouse
AUDIT_PATHS=/,/,/ AUDIT_OUTPUT=artifacts/lighthouse/home-repeat npm run audit:lighthouse
AUDIT_DEVICE=desktop AUDIT_PATHS=/,/shop,/prices,/vacuum-jugs/sld-vacuum-jug,/thermos-flasks/3-litre,/delivery/punjab,/dealers,/contact npm run audit:lighthouse
AUDIT_PRIVATE=true AUDIT_PATHS=/cart,/checkout,/account/sign-in,/admin/login AUDIT_OUTPUT=artifacts/lighthouse/private npm run audit:lighthouse
```

Run performance audits without other browser tests or compilation competing for CPU. The harness checks the actual Lighthouse form factor before recording a result and saves each repeated run separately. The gate is 90/100/100/100 for public pages; private noindex pages omit SEO. A below-budget result fails the command and remains in the report.

## Remaining scope

No authenticated administrative/order/account screens, outgoing OTP/email delivery, real payment confirmation or live order submission were audited. No orders or enquiries were submitted. Production deployment, CDN behavior, crawl/index status, search rankings, AI citations and field INP/Core Web Vitals require post-deployment verification. Search volume and difficulty remain unknown. The geographic directory has all 657 imported PBS urban rows for four provinces and Islamabad, plus 21 selected GB/AJK destinations; it is not an exhaustive rural or GB/AJK settlement register.
