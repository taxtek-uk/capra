import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/site/Hero";
import { CtaBand } from "@/components/site/CtaBand";
import { FeatureGrid } from "@/components/site/sections";
import { Container, Section, Eyebrow, Heading, Stat } from "@/components/ui/primitives";
import { SERIES } from "@/content/products";
import { BRAND, COMMERCIAL } from "@/lib/brand";

export const metadata = pageMeta({
  title: "About CAPRA® – Vacuum Flask Maker, Gujranwala",
  description: "CAPRA® has made flasks in its own Gujranwala, Pakistan factory since 2019: stainless steel vacuum jugs, flasks and bottles sold at factory prices.",
  path: "/about",
});

export default function Page() {
  const models = SERIES.reduce((a, s) => a + s.sizes.length, 0);
  return (
    <>
      <Hero compact image={{ src: "/images/banners/jugs-dark.webp", alt: "CAPRA® stainless steel vacuum jugs" }} eyebrow={`Since ${BRAND.founded}`} breadcrumbs={[{ name: "About", path: "/about" }]}
        title={<>Don&rsquo;t just drink. <em className="text-gradient-brass italic">Capra it.</em></>}
        lede={`${BRAND.name} is a flask maker in ${BRAND.address.city}, Punjab.`} />
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Our story</Eyebrow>
            <Heading>About us</Heading>
            <div className="mt-6 space-y-4 leading-relaxed text-stone-700">
              <p>Founded in {BRAND.founded}, <strong>Capra</strong> is a leading Pakistani manufacturer specializing in premium stainless steel double-body vacuum flasks and water bottles. Unlike many brands that outsource, we are a <strong>true self-contained factory</strong>. From raw material processing to final assembly, every step of our production happens under our own roof.</p>
              <p>We combine durable engineering with modern design to create thermal solutions that last. When you choose Capra, you aren&rsquo;t just buying a bottle; you are investing in our commitment to local manufacturing excellence and international quality standards.</p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6"><Stat value={BRAND.founded} label="Established" /><Stat value={String(models)} label="Models" /><Stat value={`${COMMERCIAL.warrantyMonths / 12} yrs`} label="Warranty" /></div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-950">
            <Image src="/images/brand/capra-logo-square.png" alt="The CAPRA® markhor logo" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-contain p-10" />
          </div>
        </Container>
      </Section>
      <FeatureGrid tone="bone" eyebrow="What we stand for" title="Quality first." items={[
        { title: "Honest materials", body: "304 stainless steel inside and out, BPA-free lids and seals, and no glass to break." },
        { title: "Honest prices", body: "One price list for everyone, shown in full before you order." },
        { title: "Honest service", body: "We call to confirm every order and answer on WhatsApp after it arrives." },
      ]} />
      <CtaBand />
    </>
  );
}
