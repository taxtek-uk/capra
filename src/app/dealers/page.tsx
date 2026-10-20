import Link from "next/link";
import { InfoPage } from "@/components/site/InfoPage";
import { FaqSection } from "@/components/site/sections";
import { ButtonLink } from "@/components/ui/primitives";
import { REGIONS, regionPath } from "@/content/markets";
import { listed } from "@/lib/shop";
import { BRAND, COMMERCIAL, TRADE } from "@/lib/brand";
import { JsonLd, faqLd, itemListLd, pageMeta } from "@/lib/seo";
import { pkr } from "@/lib/utils";

export const revalidate = 3600;
export const metadata = pageMeta({ title: "CAPRA Dealers & Distributor Catalogue 2026", description: "Download CAPRA's 2026 dealer catalogue. Compare flask models, 36-piece bottle cartons and gift packaging; request trade terms from the Gujranwala factory.", path: "/dealers" });
const FAQ = [
  { q: "Does the catalogue list authorised dealers by city?", a: "No. It presents the CAPRA product range, factory price list, order sheet and trade terms. Contact the factory for confirmed dealer availability in your city." },
  { q: "Are the catalogue prices dealer discounts?", a: "They are factory list prices effective 1 October 2026. Dealer rates and carton terms are quoted for your quantities; no discount or territorial exclusivity is implied." },
  { q: "How many bottles are in a carton?", a: `MS and BM bottles are packed ${COMMERCIAL.cartonPieces} pieces per carton with colours mixed. MS cartons use four colours; confirm the available mix and model quantities with the trade team.` },
];
export default async function Page() {
  const items = await listed();
  return <>
    <JsonLd data={[faqLd(FAQ), itemListLd("CAPRA dealer product range", items.map((i) => ({ name: i.name, path: i.href })))]} />
    <InfoPage crumb="Dealers & catalogue" path="/dealers" eyebrow="Trade resources" title="Stock CAPRA, direct from the factory." lede={`The 2026 dealer catalogue brings together seven designs, 17 base models and trade ordering information from ${BRAND.name}, ${BRAND.address.city}.`}
      aside={<><p className="font-medium">Trade WhatsApp</p><a href={TRADE.whatsappLink} className="mt-2 inline-flex min-h-11 items-center text-clay-700 underline underline-offset-4">{TRADE.whatsapp}</a><p className="mt-3 text-stone-600">Send your shop name, city, model codes, quantities and required date.</p><div className="mt-5"><ButtonLink href="/wholesale#enquiry">Send an enquiry</ButtonLink></div></>}>
      <h2>Download the dealer catalogue</h2>
      <p><a href={TRADE.catalogue} download>CAPRA Dealer Catalogue 2026 — PDF, 11 pages, 6.3 MB</a>. Includes product specifications, finish options, model codes, a printable order sheet and trade terms. List prices are effective {TRADE.catalogueDate} and are subject to change; check the live price list before ordering.</p>
      <h2>Compare the current range</h2>
      <table><caption>Current starting prices by design; select a product for exact sizes and finishes.</caption><thead><tr><th scope="col">Design</th><th scope="col">Sizes</th><th scope="col">From (PKR)</th></tr></thead><tbody>{items.map((i) => <tr key={i.id}><th scope="row"><Link href={i.href}>{i.name}</Link></th><td>{i.series.sizes.map((z) => z.label).join(", ")}</td><td>{pkr(i.fromPrice)}</td></tr>)}</tbody></table>
      <h2>Dealer terms and order planning</h2>
      <p>The catalogue gives factory list prices. Carton and dealer rates are quoted on your quantities. MS and BM bottles are packed {COMMERCIAL.cartonPieces} pieces per carton, colours mixed; jugs and pots come in printed boxes. Confirm the model and colour mix with the trade team before payment.</p>
      <p>Fill in the catalogue order sheet and send a photo with your city on <a href={TRADE.whatsappLink}>trade WhatsApp</a>, or use the <Link href="/wholesale#enquiry">wholesale enquiry form</Link>. The team replies within one working day. Dispatch is normally {COMMERCIAL.dispatch} from {BRAND.address.city}, by cargo or courier; the quote confirms transport arrangements.</p>
      <h2>Retail shelves, offices and gifting</h2>
      <p>SLD and YKC cover everyday tea serving; RIT adds push-button pouring for counters. SKM suits coffee, kahwa and meetings, while CPR comes in a printed gift box for household gifting. MS sports bottles and BM bullet flasks cover school, commuting and travel. For wedding, Eid or corporate quantities, send a date as well as a model list so stock and packaging can be confirmed.</p>
      <h2>Find supply for your city</h2>
      <p>Contact the factory for a confirmed local stockist or delivery arrangement. The catalogue does not contain a named dealer directory. Browse regional address guidance below, or ask about your town directly.</p>
      <ul>{REGIONS.map((r) => <li key={r.slug}><Link href={regionPath(r.slug)}>{r.name} delivery and trade enquiries</Link></li>)}</ul>
      <p>Every piece carries a {COMMERCIAL.warrantyMonths}-month warranty against manufacturing faults. Keep the invoice and model code for after-sales support; see the <Link href="/warranty">warranty policy</Link> for conditions.</p>
    </InfoPage>
    <FaqSection items={FAQ} title="Dealer catalogue questions." />
  </>;
}
