import Link from "next/link";
import { pageMeta, JsonLd, faqLd, itemListLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqSection } from "@/components/site/sections";
import { Container } from "@/components/ui/primitives";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { ProductCard } from "@/components/shop/ProductCard";
import { listed } from "@/lib/shop";
import { SHOP_FAQ } from "@/content/faqs";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "Shop Thermos Flasks, Vacuum Jugs & Bottles Online",
  description: "Shop the full CAPRA range: stainless steel vacuum jugs from 1 to 3 litres, sports bottles and bullet flasks. Factory prices, cash on delivery across Pakistan.",
  path: "/shop",
});

export default async function Page() {
  const items = await listed();
  return (
    <>
      <JsonLd data={[itemListLd("CAPRA shop", items.map((i) => ({ name: i.name, path: i.href }))), faqLd(SHOP_FAQ)]} />
      <section className="bg-bone-100 pb-4 pt-32 sm:pt-36">
        <Container>
          <Breadcrumbs items={[{ name: "Shop", path: "/shop" }]} />
          <h1 className="rise mt-4 max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl">Shop vacuum flasks, thermos jugs and insulated bottles</h1>
          <p className="lede mt-3 max-w-2xl text-base leading-relaxed">
            {items.length} designs at factory prices, made in Gujranwala and delivered to your door with cash on delivery. Comparing sizes? See the <Link href="/prices" className="text-clay-700 underline underline-offset-4">full price list</Link>.
          </p>
          <p className="mt-3 text-sm"><Link href="/thermos-flasks" className="inline-flex min-h-11 items-center text-clay-700 underline underline-offset-4">Choose by capacity, tea, travel or gifting →</Link></p>
        </Container>
      </section>
      <section id="catalogue" className="bg-bone-100 pb-20 pt-2 sm:pb-28">
        <Container>
          <ShopBrowser items={items.map((i, n) => ({ id: i.id, group: i.group, price: i.fromPrice, card: <ProductCard item={i} eager={n < 3} /> }))} />
        </Container>
      </section>
      <FaqSection items={SHOP_FAQ} title="Ordering, delivery and warranty." />
      <CtaBand />
    </>
  );
}
