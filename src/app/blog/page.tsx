import Image from "next/image";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import Link from "next/link";
import { CtaBand } from "@/components/site/CtaBand";
import { Container, Section, Eyebrow, Heading, Lede, Badge, Arrow } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/ui/Reveal";
import { publishedJournal, readingMins, formatDate } from "@/lib/posts";
import { BRAND } from "@/lib/brand";
import { pageMeta, JsonLd } from "@/lib/seo";

/** Posts are edited in /admin, so the hub refreshes on its own rather than waiting for a deploy. */
export const revalidate = 300;

export const metadata = pageMeta({
  title: "Journal: Thermos Guides, Prices & Care",
  description: "Guides from CAPRA on choosing, using and cleaning vacuum flasks and thermos jugs, with up-to-date thermos prices in Pakistan.",
  path: "/blog",
});

export default async function Page() {
  const posts = await publishedJournal();
  const [lead, ...rest] = posts;

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BRAND.domain}/blog#blog`,
    name: `${BRAND.name} Journal`,
    url: `${BRAND.domain}/blog`,
    publisher: { "@id": `${BRAND.domain}/#organization` },
    blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${BRAND.domain}/blog/${p.slug}`, datePublished: p.date })),
  };

  return (
    <>
      <JsonLd data={blogLd} />

      <section className="pt-32 sm:pt-40">
        <Container>
          <Reveal className="max-w-2xl">
            <div className="mb-5"><Breadcrumbs items={[{ name: "Journal", path: "/blog" }]} /></div><Eyebrow>Journal</Eyebrow>
            <Heading as="h1">Journal: thermos guides, prices and care.</Heading>
            <Lede>How to choose a vacuum flask, what it should cost, how to keep chai hot for longer and how to clean it. Written by the people who make them.</Lede>
          </Reveal>
        </Container>
      </section>

      <Section className="pt-14 sm:pt-16">
        <Container>
          {lead && (
            <Reveal>
              <Link href={`/blog/${lead.slug}`} className="group grid overflow-hidden rounded-3xl border border-ink-950/10 bg-bone-100 lg:grid-cols-[1.15fr_1fr]">
                <div className="relative order-1 aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]">
                  <Image src={lead.image} alt={lead.imageAlt} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.03]" />
                </div>
                <div className="order-2 flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                  <div className="flex items-center gap-3"><Badge>{lead.category}</Badge><span className="text-xs text-stone-600">{formatDate(lead.date)} · {readingMins(lead)} min read</span></div>
                  <h2 className="mt-6 font-display text-3xl leading-tight sm:text-4xl">{lead.title}</h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-600">{lead.excerpt}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-clay-700">Read the article <Arrow /></span>
                </div>
              </Link>
            </Reveal>
          )}

          <Stagger className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Item key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-950/10 bg-bone-100 transition duration-500 ease-out-expo hover:border-ink-950/25">
                  <div className="relative aspect-[16/10]">
                    <Image src={p.image} alt={p.imageAlt} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center gap-3"><Badge>{p.category}</Badge><span className="text-xs text-stone-600">{readingMins(p)} min read</span></div>
                    <h2 className="mt-5 font-display text-2xl leading-snug">{p.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{p.excerpt}</p>
                    <span className="mt-6 text-xs text-stone-600">{formatDate(p.date)}</span>
                  </div>
                </Link>
              </Item>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaBand title="Found the one? Order it today." />
    </>
  );
}
