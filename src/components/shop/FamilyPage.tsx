import Link from "next/link";
import { Hero } from "@/components/site/Hero";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqSection } from "@/components/site/sections";
import { Container, Section, ButtonLink, Arrow } from "@/components/ui/primitives";
import { ProductCard } from "./ProductCard";
import { FAMILIES, type Family } from "@/content/products";
import { SHOP_FAQ } from "@/content/faqs";
import { JsonLd, faqLd, itemListLd, pageMeta } from "@/lib/seo";
import { listed } from "@/lib/shop";
import { pkr } from "@/lib/utils";

export const familyMeta = (f: Family) => pageMeta({ title: FAMILIES[f].seo.title, description: FAMILIES[f].seo.description, path: FAMILIES[f].path });

/** A range page: dark hero, every series in it, a size guide and the ordering FAQ. */
export async function FamilyPage({ family, intro }: { family: Family; intro: React.ReactNode }) {
  const fam = FAMILIES[family];
  const items = (await listed()).filter((i) => i.series.family === family);
  const sizes = items.flatMap((i) => i.series.sizes.map((z) => ({ item: i, z })));

  return (
    <>
      <JsonLd data={[itemListLd(fam.name, items.map((i) => ({ name: i.name, path: i.href }))), faqLd(SHOP_FAQ)]} />
      <Hero compact image={{ src: fam.hero, alt: fam.heroAlt }} eyebrow={fam.eyebrow} breadcrumbs={[{ name: "Shop", path: "/shop" }, { name: fam.name, path: fam.path }]}
        title={<>{fam.name}, <em className="text-gradient-brass italic">made in Pakistan.</em></>} lede={fam.lede}
        actions={<><ButtonLink href="#range" variant="brass">See the range <Arrow /></ButtonLink><ButtonLink href="/prices" variant="ghostLight">Compare every model</ButtonLink></>} />

      <Section id="range" className="scroll-mt-24">
        <Container>
          <h2 className="font-display text-3xl sm:text-4xl">{items.length} {family === "vacuum-jugs" ? "jug and flask designs" : "bottle designs"}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((i, n) => <li key={i.id}><ProductCard item={i} eager={n < 2} /></li>)}</ul>
        </Container>
      </Section>

      <Section tone="bone">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="max-w-xl space-y-4 text-stone-600">{intro}</div>
          <div className="overflow-x-auto rounded-2xl border border-ink-950/10 bg-bone-50">
            <table className="w-full text-sm">
              <caption className="px-5 pt-5 text-left font-display text-xl text-ink-950">Every size and price</caption>
              <thead><tr className="border-b border-ink-950/10 text-left text-xs uppercase tracking-[0.14em] text-stone-600"><th className="px-5 py-3 font-medium">Model</th><th className="px-5 py-3 font-medium">Design</th><th className="px-5 py-3 font-medium">Size</th><th className="px-5 py-3 text-right font-medium">Price</th></tr></thead>
              <tbody className="divide-y divide-ink-950/10">
                {sizes.map(({ item, z }) => (
                  <tr key={z.model}>
                    <td className="px-5 py-3 font-medium tnum">{z.model}</td>
                    <td className="px-5 py-3"><Link href={item.href} className="hover:underline">{item.series.name}</Link></td>
                    <td className="px-5 py-3 text-stone-600">{z.label}</td>
                    <td className="px-5 py-3 text-right tnum">{pkr(z.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <FaqSection items={SHOP_FAQ} title="Ordering, delivery and warranty." />
      <CtaBand />
    </>
  );
}
