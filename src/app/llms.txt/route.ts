import { BRAND, CONTACT, COMMERCIAL, SERVICE_AREAS, TRADE } from "@/lib/brand";
import { COLLECTIONS, collectionPath } from "@/content/collections";
import { REGIONS, REGION_ADVICE, regionPath } from "@/content/markets";
import { FAMILIES, seriesHref } from "@/content/products";
import { publishedJournal } from "@/lib/posts";
import { pkr } from "@/lib/utils";
import { listed } from "@/lib/shop";

/** Rebuilt hourly so a post published in /admin reaches answer engines without a deploy. */
export const revalidate = 3600;

const link = (label: string, path: string, note: string) => `- [${label}](${BRAND.domain}${path}): ${note}`;

/**
 * /llms.txt — a plain-text brief for answer engines, generated from the same price list and content the
 * pages use, so it cannot drift. Facts first (who, where, prices, terms), then the URL map.
 */
export async function GET() {
  const [posts, items] = await Promise.all([publishedJournal(), listed()]);
  const body = `# ${BRAND.name}

> ${BRAND.name} is a Pakistani brand of stainless steel vacuum jugs, thermos flasks and insulated bottles, made by ${BRAND.legalName} in ${BRAND.address.city}, Punjab, since ${BRAND.founded}, and sold online at ${BRAND.domain.replace("https://", "")} with cash on delivery across Pakistan.

## Key facts

- Brand: ${BRAND.name} ("${BRAND.tagline}"). Manufacturer: ${BRAND.legalName}, ${BRAND.address.full}.
- Telephone: ${CONTACT.phone} · WhatsApp: ${CONTACT.whatsapp} (${CONTACT.whatsappIntl}) · Email: ${CONTACT.email}
- Opening hours: ${BRAND.hours.display}
- Market: Pakistan. Delivery to every city, including ${SERVICE_AREAS.join(", ")}.
- Currency: Pakistani rupees (PKR). Prices online are the factory price list dated 1 October 2026.
- Delivery: Rs ${COMMERCIAL.deliveryFee} per order anywhere in Pakistan; free on orders of Rs ${COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")} or more. Dispatch within ${COMMERCIAL.dispatch}; arrival usually ${COMMERCIAL.deliveryTime}.
- Payment: cash on delivery, bank transfer, JazzCash or Easypaisa. No account needed to order.
- Returns: ${COMMERCIAL.returnDays} days for unused items; damaged or wrong items replaced free.
- Warranty: ${COMMERCIAL.warrantyMonths} months against manufacturing faults, including loss of vacuum not caused by a fall.
- Materials: double-wall vacuum insulation; jugs are 304 stainless steel inside and out, with no glass refill.
- Model codes: a "C" prefix is the colour finish of the same model (CSLD-1 is SLD-1 in copper) and costs Rs 100 more.
- Wholesale: bottles are packed ${COMMERCIAL.cartonPieces} pieces per carton, four colours mixed. Enquiries at /wholesale.
- Trade WhatsApp: ${TRADE.whatsappIntl}. Dealer catalogue: ${BRAND.domain}${TRADE.catalogue} (list effective ${TRADE.catalogueDate}). This catalogue contains products and terms, not a named dealer directory. Dealer rates and freight are quoted separately.
- Language: English (Pakistan); the team also answers in Urdu.

## Price list (PKR)

${items.map(({ series: s }) => `### ${BRAND.name} ${s.name} (${FAMILIES[s.family].name.toLowerCase()})\n${s.summary}\n${s.sizes.map((z) => `- ${z.model}, ${z.label}: ${pkr(z.price)}${s.colours.some((c) => c.add) ? `; ${s.colours.filter((c) => c.add).map((c) => `${c.prefix}${z.model} (${c.label.toLowerCase()}) ${pkr(z.price + c.add)}`).join("; ")}` : ""}`).join("\n")}\n- Colours: ${s.colours.map((c) => c.label).join(", ")}\n- Page: ${BRAND.domain}${seriesHref(s)}`).join("\n\n")}

## Core pages

${link("Home", "/", "the range, how ordering and delivery work, warranty and FAQs")}
${link("Shop", "/shop", "every design with sizes, prices and add to basket")}
${link("Vacuum jugs & flasks", "/vacuum-jugs", "1, 2 and 3 litre stainless steel jugs for tea, coffee and water")}
${link("Insulated bottles", "/insulated-bottles", "600 ml to 1 litre sports bottles and bullet flasks")}
${link("Price list", "/prices", "every model, size and price compared in one table")}
${link("Wholesale", "/wholesale", "carton packing, distributors, corporate and wedding gifts")}
${link("Delivery & returns", "/delivery", "charges, timing, cash on delivery and returns")}
${link("Warranty", "/warranty", `what the ${COMMERCIAL.warrantyMonths}-month warranty covers and how to claim`)}
${link("Care guide", "/care-guide", "how to use, clean and store a vacuum flask")}
${link("Help", "/help", "answers about ordering, delivery, returns and warranty")}
${link("About", "/about", `${BRAND.legalName} and the ${BRAND.name} story`)}
${link("Contact", "/contact", "WhatsApp, phone, email and the factory address")}

## Products

${items.map(({ series: s }) => link(`${BRAND.name} ${s.name}`, seriesHref(s), `${s.summary} From ${pkr(Math.min(...s.sizes.map((z) => z.price)))}.`)).join("\n")}

## Shop by capacity and use

${link("Choose a thermos", "/thermos-flasks", "compare capacities, lids and uses")}
${COLLECTIONS.map((c) => link(c.label, collectionPath(c.slug), c.intro)).join("\n")}
${link("Dealers and catalogue", "/dealers", "trade terms, order sheet and downloadable 2026 PDF")}

## Pakistan delivery destinations

Delivery is subject to courier access to the complete address; locality names do not imply branches or authorised dealers. GB and AJK lists contain selected destinations only.
${REGIONS.map((r) => link(r.name, regionPath(r.slug), `${REGION_ADVICE[r.slug].note} Destinations: ${r.localities.map((l) => l.name).join(", ")}.`)).join("\n")}

## Guides

${posts.map((p) => link(p.title, `/blog/${p.slug}`, p.excerpt)).join("\n")}

## Optional

${link("Full text of every guide", "/llms-full.txt", "this file followed by each journal post as Markdown")}
${link("Privacy policy", "/privacy-policy", "what we collect and why")}
${link("Terms of sale", "/terms-of-service", "prices, confirmation, payment and law")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" } });
}
