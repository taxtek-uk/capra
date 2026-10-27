import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS, collectionPath } from "@/content/collections";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FaqSection } from "@/components/site/sections";
import { ProductCard } from "@/components/shop/ProductCard";
import { Container, Section, Eyebrow, Heading, Lede, ButtonLink } from "@/components/ui/primitives";
import { listed, variantFacts } from "@/lib/shop";
import { COMMERCIAL } from "@/lib/brand";
import { JsonLd, faqLd, itemListLd, pageMeta } from "@/lib/seo";
import { pkr } from "@/lib/utils";

export const revalidate = 3600;
export const dynamicParams = false;
export const generateStaticParams = () => COLLECTIONS.map(({ slug }) => ({ slug }));
const find = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = find((await params).slug);
  if (!c) notFound();
  return pageMeta({ title: c.title, description: c.description, path: collectionPath(c.slug), keywords: c.keywords });
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const c = find((await params).slug);
  if (!c) notFound();
  const items = (await listed()).filter((i) => (!c.series || c.series.includes(i.series.series)) && (!c.litres || i.series.sizes.some((z) => z.litres === c.litres))).map((i) => {
    const sizes = i.series.sizes.filter((z) => !c.litres || z.litres === c.litres);
    return { ...i, series: { ...i.series, sizes }, fromPrice: Math.min(...sizes.map((z) => z.price)) };
  });
  const rows = items.flatMap((item) => item.series.sizes.flatMap((size) => item.series.colours.map((colour) => {
    const v = variantFacts(item.series, `${size.value}/${colour.value}`);
    return { item, v: { ...v, variant: v.key, price: v.unit, size, colour } };
  })));
  return <>
    <JsonLd data={[itemListLd(c.title, items.map((i) => ({ name: i.name, path: i.href }))), faqLd(c.faq)]} />
    <Section className="pt-32 sm:pt-40"><Container>
      <Breadcrumbs items={[{ name: "Thermos flasks", path: "/thermos-flasks" }, { name: c.label, path: collectionPath(c.slug) }]} />
      <div className="mt-6 max-w-3xl"><Eyebrow>CAPRA Pakistan</Eyebrow><Heading as="h1">{c.title}</Heading><Lede>{c.intro}</Lede></div>
      <p className="mt-6 text-sm text-stone-600">Cash on delivery · Jugs sold by the carton, {COMMERCIAL.jugCartonPieces} pieces minimum · Delivery at actual cost</p>
      {items.length ? <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((i, n) => <li key={`${c.slug}-${i.id}`}><ProductCard item={i} eager={n < 2} headingLevel="h2" /></li>)}</ul> : <p className="mt-8">This selection is currently unavailable. <Link href="/shop" className="underline">Browse the current range</Link>.</p>}
      {!!rows.length && <div className="mt-12 overflow-x-auto rounded-2xl border border-ink-950/15"><table className="w-full text-left text-sm"><caption className="p-5 text-left font-display text-2xl">Compare exact models and prices</caption><thead className="bg-bone-100"><tr>{["Model", "Design", "Capacity", "Finish", "Price (PKR)"].map((t) => <th key={t} scope="col" className="whitespace-nowrap px-5 py-3 font-medium">{t}</th>)}</tr></thead><tbody className="divide-y divide-ink-950/10">{rows.map(({ item, v }) => <tr key={v.variant + item.id}><th scope="row" className="px-5 py-3 font-medium">{v.sku}</th><td className="px-5 py-3"><Link href={item.href} className="text-clay-700 underline underline-offset-4">{item.name}</Link></td><td className="whitespace-nowrap px-5 py-3">{v.size.label}</td><td className="px-5 py-3">{v.colour.label}</td><td className="whitespace-nowrap px-5 py-3 tnum">{pkr(v.price)}</td></tr>)}</tbody></table></div>}
    </Container></Section>
    <Section tone="bone"><Container className="grid gap-8 lg:grid-cols-3">{c.sections.map((s) => <article key={s.title}><h2 className="text-2xl">{s.title}</h2><p className="mt-4 leading-relaxed text-stone-600">{s.body}</p></article>)}</Container></Section>
    <FaqSection items={c.faq} title="Choosing your flask." />
    <Section tone="bone"><Container><h2 className="text-2xl">Explore other sizes and uses</h2><ul className="mt-5 flex flex-wrap gap-3">{COLLECTIONS.filter((x) => x.slug !== c.slug).map((x) => <li key={x.slug}><Link href={collectionPath(x.slug)} className="inline-flex min-h-11 items-center rounded-full border border-ink-950/15 px-4 py-2 text-sm text-clay-700 hover:bg-bone-200">{x.label}</Link></li>)}</ul><div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/delivery">Find your delivery region</ButtonLink><ButtonLink href="/care-guide" variant="ghost">Care instructions</ButtonLink><ButtonLink href="/wholesale" variant="ghost">Bulk orders</ButtonLink></div></Container></Section>
  </>;
}
