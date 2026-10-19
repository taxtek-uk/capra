import Image from "next/image";
import Link from "next/link";

const HUBS = [
  { match: "price", href: "/prices", label: "See the full CAPRA price list, every model compared" },
  { match: "choose", href: "/vacuum-jugs", label: "Shop vacuum jugs from 1 to 3 litres" },
  { match: "tea-hot", href: "/vacuum-jugs", label: "Shop stainless steel vacuum jugs for chai" },
  { match: "clean", href: "/care-guide", label: "The CAPRA care guide: use, clean and store" },
];
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/CtaBand";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container, Section, Heading, Badge, Arrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";
import { getJournal, publishedJournal, readingMins, formatDate } from "@/lib/posts";
import { pageMeta, JsonLd, articleLd, faqLd } from "@/lib/seo";

export const revalidate = 300;
/** A post published in /admin after the last deploy renders on first request rather than 404ing. */
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await publishedJournal()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getJournal((await params).slug);
  if (!p || !p.published) return {};
  return pageMeta({
    title: p.seoTitle ?? p.title,
    description: p.excerpt,
    path: `/blog/${p.slug}`,
    image: p.image || undefined,
    type: "article",
    publishedTime: p.date,
    modifiedTime: p.updated,
    keywords: p.keywords,
    absoluteTitle: true,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getJournal((await params).slug);
  if (!post || !post.published) notFound();
  const more = (await publishedJournal()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <JsonLd data={[
        articleLd({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, date: post.date, modified: post.updated, image: post.image || undefined, keywords: post.keywords, author: post.author }),
        ...(post.faqs.length ? [faqLd(post.faqs)] : []),
      ]} />

      <article>
        <section className="pt-32 sm:pt-40">
          <Container>
            <div className="max-w-3xl">
              <Breadcrumbs items={[{ name: "Journal", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />
              <div className="mt-8 flex items-center gap-3"><Badge>{post.category}</Badge><span className="text-xs text-stone-600">{formatDate(post.date)}{post.updated > post.date && <> · Updated {formatDate(post.updated)}</>} · {readingMins(post)} min read</span></div>
              <Heading as="h1" className="mt-6">{post.title}</Heading>
              <p className="mt-5 text-lg leading-relaxed text-stone-600">{post.excerpt}</p>
            </div>
          </Container>
        </section>

        {post.image && (
          <Container className="mt-12">
            <Reveal className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl">
              <Image src={post.image} alt={post.imageAlt} fill priority sizes="(min-width:1024px) 64rem, 100vw" className="object-cover" />
            </Reveal>
          </Container>
        )}

        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            {post.sections.map((s, i) => (
              <section key={i} className={i > 0 ? "mt-12" : undefined}>
                {s.heading && <h2 className="font-display text-2xl leading-snug sm:text-3xl">{s.heading}</h2>}
                {s.paragraphs.map((p, n) => <p key={n} className="mt-5 leading-[1.75] text-stone-700">{p}</p>)}
                {s.image && (
                  <figure className={`mt-8 overflow-hidden rounded-2xl ${s.image.h > s.image.w ? "max-w-md" : ""}`}>
                    <Image src={s.image.src} alt={s.image.alt} width={s.image.w} height={s.image.h} sizes="(min-width:768px) 48rem, 100vw" className="h-auto w-full" />
                  </figure>
                )}
              </section>
            ))}

            {post.faqs.length > 0 && (
              <section className="mt-14">
                <h2 className="font-display text-2xl leading-snug sm:text-3xl">Common questions</h2>
                <dl className="mt-6 divide-y divide-ink-950/10 border-y border-ink-950/10">
                  {post.faqs.map((f) => (
                    <div key={f.q} className="py-5">
                      <dt className="font-medium">{f.q}</dt>
                      <dd className="mt-2 leading-relaxed text-stone-600">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {/* A guide passes its authority to the page that sells what it explains. */}
            {HUBS.filter((h) => post.slug.includes(h.match)).map((h) => (
              <p key={h.href} className="mt-10 font-medium text-clay-700"><Link href={h.href} className="underline underline-offset-4">{h.label}</Link></p>
            ))}

            {post.areas.length > 0 && (
              <p className="mt-10 text-sm text-stone-600">Written for customers in {post.areas.join(", ")} and across Pakistan.</p>
            )}
          </div>
        </Container>
      </article>

      <Section tone="bone">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-3xl">More from the journal</h2>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-clay-700">All articles <Arrow /></Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col rounded-2xl border border-ink-950/10 bg-bone-50 p-7 transition duration-500 ease-out-expo hover:border-ink-950/25">
                <div className="flex items-center gap-3"><Badge>{p.category}</Badge><span className="text-xs text-stone-600">{readingMins(p)} min</span></div>
                <h3 className="mt-5 font-display text-xl leading-snug">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">{p.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-clay-700">Read <Arrow /></span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
}
