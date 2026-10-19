import Link from "next/link";
import { COLLECTIONS, collectionPath } from "@/content/collections";
import { REGIONS, regionPath } from "@/content/markets";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container, Section, Eyebrow, Heading, Lede, ButtonLink } from "@/components/ui/primitives";
import { JsonLd, itemListLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Thermos Flasks in Pakistan: Shop by Size & Use", description: "Find the right CAPRA thermos flask in Pakistan. Compare sizes for tea, coffee, travel, school and gifts, then check delivery to your city or town.", path: "/thermos-flasks" });

export default function Page() {
  return <>
    <JsonLd data={itemListLd("Shop thermos flasks by size and use", COLLECTIONS.map((c) => ({ name: c.label, path: collectionPath(c.slug) })))} />
    <Section className="pt-32 sm:pt-40"><Container>
      <Breadcrumbs items={[{ name: "Thermos flasks", path: "/thermos-flasks" }]} />
      <div className="mt-6 max-w-3xl"><Eyebrow>Choose your thermos</Eyebrow><Heading as="h1">A flask for your daily routine.</Heading><Lede>Compare stainless steel thermos flasks by capacity and use. Find a jug for family chai, a bottle to carry or a boxed gift, with current CAPRA prices in Pakistani rupees.</Lede></div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{COLLECTIONS.map((c) => <li key={c.slug}><Link href={collectionPath(c.slug)} className="block h-full rounded-2xl border border-ink-950/15 bg-bone-100 p-6 transition hover:border-clay-700"><h2 className="text-2xl">{c.label}</h2><p className="mt-3 text-sm leading-relaxed text-stone-600">{c.intro}</p><span className="mt-5 inline-block text-sm font-medium text-clay-700">Compare models →</span></Link></li>)}</ul>
      <div className="mt-14 grid gap-8 rounded-2xl bg-bone-100 p-6 lg:grid-cols-2">
        <div><h2 className="text-2xl">Compare the full range</h2><p className="my-4 text-stone-600">A vacuum flask slows heat transfer. Choose by capacity, lid and carrying style rather than assuming all products described as a thermos are identical.</p><div className="flex flex-wrap gap-3"><ButtonLink href="/prices">Every model and price</ButtonLink><ButtonLink href="/dealers" variant="ghost">Dealer catalogue</ButtonLink></div></div>
        <div><h2 className="text-2xl">Delivery across Pakistan</h2><p className="mt-4 text-stone-600">Choose your region to find a city or town and check address requirements. Courier access is confirmed for your complete address.</p><ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">{REGIONS.map((r) => <li key={r.slug}><Link href={regionPath(r.slug)} className="inline-flex min-h-8 items-center text-sm text-clay-700 underline underline-offset-4">{r.name}</Link></li>)}</ul></div>
      </div>
    </Container></Section>
  </>;
}
