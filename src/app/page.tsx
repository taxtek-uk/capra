import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/site/Hero";
import { CtaBand } from "@/components/site/CtaBand";
import { FaqSection, FeatureGrid, Steps } from "@/components/site/sections";
import { Container, Section, Eyebrow, Heading, Lede, ButtonLink, Arrow, Badge } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/shop/ProductCard";
import { FAMILIES } from "@/content/products";
import { ORDER_FAQ, AFTERCARE_FAQ } from "@/content/faqs";
import { listed } from "@/lib/shop";
import { publishedJournal, readingMins } from "@/lib/posts";
import { BRAND, COMMERCIAL } from "@/lib/brand";
import { JsonLd, faqLd, itemListLd, pageMeta } from "@/lib/seo";
import { pkr } from "@/lib/utils";

export const revalidate = 3600;
export const metadata = pageMeta({
  title: "CAPRA Vacuum Flasks & Thermos Jugs | Pakistan",
  absoluteTitle: true,
  description: "Stainless steel vacuum jugs, thermos flasks and insulated bottles made in Gujranwala. Shop at factory prices, with cash on delivery across Pakistan.",
  path: "/",
});

const FAQ = [...ORDER_FAQ.slice(0, 3), ...AFTERCARE_FAQ];

export default async function Page() {
  const [items, posts] = await Promise.all([listed(), publishedJournal()]);
  const from = Math.min(...items.map((i) => i.fromPrice));

  return (
    <>
      <JsonLd data={[itemListLd("CAPRA range", items.map((i) => ({ name: i.name, path: i.href }))), faqLd(FAQ)]} />
      <Hero
        image={{ src: "/images/banners/range-dark.webp", alt: "CAPRA stainless steel vacuum jugs in red, steel, blue and rose" }}
        eyebrow={`Made in ${BRAND.address.city} since ${BRAND.founded}`}
        title={<>Vacuum flasks and thermos jugs, <em className="text-gradient-brass italic">made in Pakistan.</em></>}
        lede={`Stainless steel jugs for chai and cold water, sports bottles and bullet flasks at the factory price list, from ${pkr(from)}. Cash on delivery to every city.`}
        actions={<><ButtonLink href="/vacuum-jugs" variant="brass">Shop vacuum jugs <Arrow /></ButtonLink><ButtonLink href="/insulated-bottles" variant="ghostLight">Insulated bottles</ButtonLink></>}
      />

      <section aria-label="Why order from CAPRA" className="border-b border-ink-950/10 bg-bone-100">
        <Container className="grid grid-cols-2 gap-6 py-8 text-sm sm:grid-cols-4">
          {[
            ["Cash on delivery", "Pay the courier when it arrives"],
            ["Delivery anywhere", "Courier or builty at actual cost"],
            [`${COMMERCIAL.warrantyMonths / 12}-year warranty`, `Plus ${COMMERCIAL.returnDays}-day returns`],
            ["Factory prices", "Direct from our factory"],
          ].map(([t, d]) => <div key={t}><p className="font-medium">{t}</p><p className="mt-0.5 text-stone-600">{d}</p></div>)}
        </Container>
      </section>

      <Section>
        <Container>
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl"><Eyebrow>The range</Eyebrow><Heading>Seven designs, one standard.</Heading><Lede>Every CAPRA is double-wall vacuum stainless steel, inside and out. Choose the shape, the size and the finish.</Lede></div>
            <ButtonLink href="/prices" variant="ghost">Compare every model <Arrow /></ButtonLink>
          </Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((i) => <li key={i.id}><ProductCard item={i} /></li>)}</ul>
        </Container>
      </Section>

      <Section tone="bone" className="pt-0 sm:pt-0">
        <Container className="grid gap-4 pt-14 sm:pt-20 lg:grid-cols-2">
          {(["vacuum-jugs", "insulated-bottles"] as const).map((f) => (
            <Link key={f} href={FAMILIES[f].path} className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink-950 p-8 text-bone-50">
              <Image src={FAMILIES[f].hero} alt={FAMILIES[f].heroAlt} fill sizes="(min-width:1024px) 50vw, 100vw" className="-z-10 object-cover opacity-80 transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.04]" />
              <span className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(11_10_9/0.9),transparent_65%)]" aria-hidden />
              <Badge tone="light" className="self-start">{FAMILIES[f].eyebrow}</Badge>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl">{FAMILIES[f].name}</h2>
              <p className="mt-2 max-w-md text-sm text-bone-100/80">{FAMILIES[f].lede}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brass-300">Shop {FAMILIES[f].short.toLowerCase()} <Arrow /></span>
            </Link>
          ))}
        </Container>
      </Section>

      <FeatureGrid
        eyebrow="Why CAPRA"
        title="Built for chai, built for years."
        lede="A flask is used every day, so we make it to last: steel where cheaper flasks use glass or thin metal, and lids that are easy to take apart and clean."
        items={[
          { title: "Stainless steel inside and out", body: "304 stainless steel with no glass refill to shatter and no plastic touching your tea." },
          { title: "Double-wall vacuum", body: "Air is pumped out between two walls of steel, so heat has almost nowhere to go: hot stays hot, cold stays cold." },
          { title: "Unbreakable for daily life", body: "Knocked off a table or rolled around a car, a steel flask keeps working where glass ones crack." },
          { title: "Factory price list", body: "We sell direct from our own factory, so there is no middleman between the maker and your door." },
          { title: "We call before we send", body: "Every order is confirmed by phone or WhatsApp, so the size, colour and address are right first time." },
          { title: `${COMMERCIAL.warrantyMonths}-month warranty`, body: `Covers manufacturing faults including loss of vacuum, with ${COMMERCIAL.returnDays}-day returns on unused items.` },
        ]}
      />

      <Steps tone="dark" eyebrow="Ordering" title="From our factory to your door in four steps." steps={[
        { n: "01", title: "Choose", body: "Pick a design, a size and a finish. Every price is shown up front." },
        { n: "02", title: "Order", body: "Name, mobile number and address. Email is optional; no account needed." },
        { n: "03", title: "Confirm", body: "We call or WhatsApp to check your order, then pack it in Gujranwala." },
        { n: "04", title: "Receive", body: `Tracked courier to any city, usually ${COMMERCIAL.deliveryTime}. Pay cash on delivery.` },
      ]} />

      {posts.length > 0 && (
        <Section>
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4"><div><Eyebrow>Journal</Eyebrow><Heading>Flask guides and prices.</Heading></div><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-clay-700">All guides <Arrow /></Link></div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-ink-950/10 bg-bone-100 transition hover:border-ink-950/25">
                  <div className="relative aspect-[16/10]"><Image src={p.image} alt={p.imageAlt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.04]" /></div>
                  <div className="flex flex-1 flex-col p-6"><div className="flex items-center gap-3"><Badge>{p.category}</Badge><span className="text-xs text-stone-600">{readingMins(p)} min read</span></div><h3 className="mt-4 font-display text-xl leading-snug">{p.title}</h3><p className="mt-2 flex-1 text-sm text-stone-600">{p.excerpt}</p></div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <FaqSection items={FAQ} tone="bone" />
      <Section tone="bone"><Container className="grid gap-8 md:grid-cols-2"><div><h2 className="text-3xl">Choose by size and use.</h2><p className="mt-4 text-stone-600">Compare 1, 2 and 3 litre thermos jugs, personal bottles, office flasks and boxed gifts.</p><Link href="/thermos-flasks" className="mt-4 inline-flex min-h-11 items-center text-clay-700 underline underline-offset-4">Find your thermos →</Link></div><div><h2 className="text-3xl">Find your delivery destination.</h2><p className="mt-4 text-stone-600">Browse cities and towns across Pakistan, check address guidance and enquire about local trade supply.</p><Link href="/delivery" className="mt-4 inline-flex min-h-11 items-center text-clay-700 underline underline-offset-4">Delivery regions and cities →</Link></div></Container></Section>
      <CtaBand />
    </>
  );
}
