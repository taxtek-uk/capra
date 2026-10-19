import Link from "next/link";
import { notFound } from "next/navigation";
import { REGIONS, REGION_ADVICE, regionPath, localityAnchor } from "@/content/markets";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FaqSection } from "@/components/site/sections";
import { Container, Section, Eyebrow, Heading, Lede, ButtonLink } from "@/components/ui/primitives";
import { BRAND, COMMERCIAL, CONTACT, TRADE } from "@/lib/brand";
import { JsonLd, faqLd, pageMeta } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => REGIONS.map(({ slug }) => ({ region: slug }));
const find = (slug: string) => REGIONS.find((r) => r.slug === slug);
export async function generateMetadata({ params }: { params: Promise<{ region: string }> }) {
  const r = find((await params).region);
  if (!r) notFound();
  return pageMeta({ title: `Thermos Flask Delivery in ${r.name}`, description: `Buy CAPRA thermos flasks in ${r.name}. Check city and town addresses, delivery charges, payment options and factory-direct dealer enquiries.`, path: regionPath(r.slug) });
}
export default async function Page({ params }: { params: Promise<{ region: string }> }) {
  const r = find((await params).region);
  if (!r) notFound();
  const advice = REGION_ADVICE[r.slug];
  const districts = [...new Set(r.localities.map((l) => l.district))].sort();
  const faq = [
    { q: `Can I order a CAPRA thermos in ${r.name}?`, a: `Yes. Order online for delivery from ${BRAND.address.city}. Confirm your complete address with the team for remote locations; a directory entry does not guarantee courier access.` },
    { q: `What does delivery to ${r.name} cost?`, a: `The published retail delivery fee is Rs ${COMMERCIAL.deliveryFee} per order, free from Rs ${COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")}. Dispatch is normally ${COMMERCIAL.dispatch}; arrival is usually ${COMMERCIAL.deliveryTime}, with extra time possible for remote routes. Trade freight is quoted separately.` },
    { q: `Is there a CAPRA dealer in every listed town?`, a: `The list identifies destinations, not dealers or branches. Contact the trade team for confirmed local availability or order directly from the ${BRAND.address.city} factory.` },
  ];
  return <>
    <JsonLd data={faqLd(faq)} />
    <Section className="pt-32 sm:pt-40"><Container>
      <Breadcrumbs items={[{ name: "Delivery", path: "/delivery" }, { name: r.name, path: regionPath(r.slug) }]} />
      <div className="mt-6 max-w-3xl"><Eyebrow>Delivery destinations</Eyebrow><Heading as="h1">Thermos flasks in {r.name}.</Heading><Lede>{advice.intro}</Lede></div>
      <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/thermos-flasks">Choose a thermos</ButtonLink><ButtonLink href={CONTACT.whatsappLink} variant="ghost">Check your address</ButtonLink></div>
      <div className="mt-10 grid gap-6 rounded-2xl bg-bone-100 p-6 md:grid-cols-3">
        <div><h2 className="text-xl">Delivery and payment</h2><p className="mt-3 text-sm leading-relaxed text-stone-600">Retail delivery is Rs {COMMERCIAL.deliveryFee}, free from Rs {COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")}. Pay cash on delivery on supported routes, or by bank transfer, JazzCash or Easypaisa. We confirm your order before dispatch.</p></div>
        <div><h2 className="text-xl">Your delivery address</h2><p className="mt-3 text-sm leading-relaxed text-stone-600">{advice.address}</p></div>
        <div><h2 className="text-xl">Before ordering</h2><p className="mt-3 text-sm leading-relaxed text-stone-600">{advice.note}</p></div>
      </div>
      <section className="mt-12" aria-labelledby="destinations"><h2 id="destinations" className="text-3xl">Cities and towns by district</h2><p className="mt-4 max-w-3xl text-stone-600">Find your district below. These names help identify your delivery address; availability is checked with the courier. If your town or village is absent, <a href={CONTACT.whatsappLink} className="text-clay-700 underline underline-offset-4">send your complete address</a> so we can check it.</p>
        <nav aria-label={`${r.name} districts`} className="mt-6"><ul className="flex flex-wrap gap-2">{districts.map((d) => <li key={d}><a href={`#${localityAnchor(d)}`} className="inline-flex min-h-11 items-center rounded-full border border-ink-950/15 px-4 py-2 text-sm text-clay-700 hover:bg-bone-100">{d}</a></li>)}</ul></nav>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{districts.map((d) => <section key={d} id={localityAnchor(d)} className="scroll-mt-32 rounded-2xl border border-ink-950/10 p-5"><h3 className="text-xl">{d}</h3><ul className="mt-3 space-y-2 text-sm leading-relaxed text-stone-600">{r.localities.filter((l) => l.district === d).map((l, n) => <li key={`${l.name}-${n}`}>{l.name}</li>)}</ul></section>)}</div>
        <p className="mt-5 text-sm leading-relaxed text-stone-600">Directory reference: <a href={r.source} className="text-clay-700 underline underline-offset-4">{["gilgit-baltistan", "azad-kashmir"].includes(r.slug) ? "regional government destination information (selected places)" : "Pakistan Bureau of Statistics, Census 2023 urban localities"}</a>. Census names may retain municipal subdivisions and older spellings. They do not certify delivery coverage.</p>
      </section>
    </Container></Section>
    <Section tone="bone"><Container className="grid gap-8 lg:grid-cols-2"><div><h2 className="text-3xl">For shops and trade buyers</h2><p className="mt-4 leading-relaxed text-stone-600">{advice.trade}</p><div className="mt-6 flex flex-wrap gap-3"><ButtonLink href="/dealers">Dealer catalogue & terms</ButtonLink><ButtonLink href={TRADE.whatsappLink} variant="ghost">WhatsApp trade team</ButtonLink></div></div><div><h2 className="text-3xl">Choosing a size</h2><p className="mt-4 leading-relaxed text-stone-600">Personal bottles start at 600 ml. Table jugs come in 1 and 2 litres across five designs, with 3 litre options in SLD, SKM and YKC. Compare the exact size and finish before ordering.</p><ul className="mt-5 flex flex-wrap gap-4">{["1-litre", "2-litre", "3-litre", "tea", "travel"].map((s) => <li key={s}><Link href={`/thermos-flasks/${s}`} className="inline-flex min-h-11 items-center text-clay-700 underline underline-offset-4">{s.replaceAll("-", " ")} flasks</Link></li>)}</ul></div></Container></Section>
    <FaqSection items={faq} title={`Ordering in ${r.name}.`} />
    <Section tone="bone"><Container><h2 className="text-2xl">Other delivery regions</h2><ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">{REGIONS.filter((x) => x.slug !== r.slug).map((x) => <li key={x.slug}><Link href={regionPath(x.slug)} className="inline-flex min-h-11 items-center text-clay-700 underline underline-offset-4">{x.name}</Link></li>)}</ul><Link href="/delivery" className="mt-5 inline-block text-clay-700 underline underline-offset-4">Full delivery and returns policy</Link></Container></Section>
  </>;
}
