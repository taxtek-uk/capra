import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { Container, Section, Eyebrow, Heading, Faq } from "@/components/ui/primitives";
import { ProductBuy } from "./ProductBuy";
import { ProductCard } from "./ProductCard";
import { FAMILIES, SERIES, type Family } from "@/content/products";
import { AFTERCARE_FAQ } from "@/content/faqs";
import { JsonLd, faqLd, pageMeta, productGroupLd } from "@/lib/seo";
import { listed, shopItem, stockStatus, variantFacts } from "@/lib/shop";
import { overrides } from "@/lib/catalogue";
import { BRAND, whatsappWith } from "@/lib/brand";
import { pkr } from "@/lib/utils";

export const productParams = (family: Family) => () => SERIES.filter((s) => s.family === family).map((s) => ({ product: s.slug }));

export async function productMeta(family: Family, slug: string) {
  const s = SERIES.find((x) => x.slug === slug && x.family === family);
  if (!s) return {};
  const ov = (await overrides()).get(slug);
  return pageMeta({
    title: ov?.seoTitle || s.seo.title,
    description: ov?.seoDescription || s.seo.description,
    path: `${FAMILIES[family].path}/${s.slug}`,
    keywords: ov?.keywords.length ? ov.keywords : s.seo.keywords,
  });
}

export async function ProductPage({ family, slug }: { family: Family; slug: string }) {
  const item = await shopItem(slug);
  if (!item || item.series.family !== family) notFound();
  const s = item.series;
  const fam = FAMILIES[family];
  const ov = (await overrides()).get(slug);
  const status = stockStatus(item);
  const related = (await listed()).filter((i) => i.slug !== slug).sort((a, b) => Number(b.series.family === family) - Number(a.series.family === family)).slice(0, 4);
  const variants = s.sizes.flatMap((z) => s.colours.map((c) => {
    const v = variantFacts(s, `${z.value}/${c.value}`);
    return { sku: v.sku, name: `${BRAND.name} ${s.name} ${z.label} ${c.label}`, size: z.label, colour: c.label, price: v.unit, image: v.image, litres: z.litres };
  }));

  return (
    <>
      <JsonLd data={[
        productGroupLd({ name: item.name, description: s.description.join(" "), path: item.href, images: s.images.map((i) => i.src), groupId: s.series, availability: status.schema, variants }),
        faqLd([...s.faqs, ...AFTERCARE_FAQ.slice(0, 2)]),
      ]} />

      <Section className="pt-32 sm:pt-36">
        <Container>
          <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: fam.name, path: fam.path }, { name: s.name, path: item.href }]} />
          <div className="mt-6 max-w-3xl">
            <Eyebrow>{s.series} series · {s.sizes.map((z) => z.model).join(", ")}</Eyebrow>
            <h1 className="font-display text-4xl leading-[1.04] sm:text-5xl">{item.name}</h1>
            <p className="lede mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">{ov?.blurb || item.summary}</p>
          </div>
          <div className="mt-10">
            <ProductBuy item={{ id: item.id, name: item.name, sizes: s.sizes, colours: s.colours, images: s.images, stock: item.stock, colourByRequest: s.colourByRequest }} />
          </div>
          <p className="mt-6 text-sm text-stone-600">
            Prefer to order on WhatsApp? <a href={whatsappWith(`Assalam-o-Alaikum, I would like to order the CAPRA ${s.name}.`)} target="_blank" rel="noopener" className="font-medium text-clay-700 underline underline-offset-4">Message us</a> and we will take it there.
          </p>
        </Container>
      </Section>

      <Section tone="bone">
        <Container className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Heading>About the {s.name}</Heading>
            <div className="mt-6 space-y-4 leading-relaxed text-stone-700">{s.description.map((p, i) => <p key={i}>{p}</p>)}</div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {s.features.map((f) => <li key={f} className="flex gap-3 rounded-xl border border-ink-950/10 bg-bone-50 p-4 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500" aria-hidden />{f}</li>)}
            </ul>
          </div>
          <div className="grid content-start gap-6">
            <div className="rounded-2xl border border-ink-950/10 bg-bone-50 p-6">
              <h2 className="font-display text-xl">Specifications</h2>
              <dl className="mt-4 divide-y divide-ink-950/10 text-sm">
                {[["Brand", BRAND.name], ["Best for", s.bestFor], ...s.specs, ["Made in", `${BRAND.address.city}, Pakistan`]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-stone-600">{k}</dt><dd className="text-right">{v}</dd></div>
                ))}
              </dl>
            </div>
            <div className="overflow-hidden rounded-2xl border border-ink-950/10 bg-bone-50">
              <table className="w-full text-sm">
                <caption className="px-6 pt-5 text-left font-display text-xl">Models and prices</caption>
                <thead><tr className="text-left text-xs uppercase tracking-[0.14em] text-stone-600"><th className="px-6 py-3 font-medium">Model</th><th className="px-6 py-3 font-medium">Size</th><th className="px-6 py-3 font-medium">Finish</th><th className="px-6 py-3 text-right font-medium">Price</th></tr></thead>
                <tbody className="divide-y divide-ink-950/10">
                  {variants.map((v) => <tr key={v.sku}><td className="px-6 py-2.5 font-medium tnum">{v.sku}</td><td className="px-6 py-2.5">{v.size}</td><td className="px-6 py-2.5 text-stone-600">{v.colour}</td><td className="px-6 py-2.5 text-right tnum">{pkr(v.price)}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div><Eyebrow>Questions</Eyebrow><Heading>Before you order.</Heading><p className="mt-5 text-sm text-stone-600">More in the <Link href="/help" className="text-clay-700 underline underline-offset-4">help centre</Link> and the <Link href="/care-guide" className="text-clay-700 underline underline-offset-4">care guide</Link>.</p></div>
          <Faq items={[...s.faqs, ...AFTERCARE_FAQ.slice(0, 2)]} />
        </Container>
      </Section>

      <Section tone="bone">
        <Container>
          <h2 className="font-display text-3xl">You may also like</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((i) => <li key={i.id}><ProductCard item={i} /></li>)}</ul>
        </Container>
      </Section>
      <CtaBand />
      <MobileActionBar primary={{ label: "Go to checkout", href: "/checkout" }} />
    </>
  );
}
