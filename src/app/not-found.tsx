import Link from "next/link";
import { Container, Section, Eyebrow, Heading, Lede, ButtonLink, Arrow } from "@/components/ui/primitives";
import { NAV } from "@/content/nav";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Page Not Found", description: "That page has moved or no longer exists. Browse CAPRA vacuum jugs and insulated bottles instead.", path: "/404", noIndex: true });

export default function NotFound() {
  const popular = [...NAV.groups.flatMap((g) => g.items), ...NAV.links, { label: "Contact", href: "/contact" }];
  return (
    <Section className="pt-40">
      <Container className="max-w-2xl">
        <Eyebrow>404</Eyebrow>
        <Heading as="h1">That page is not here.</Heading>
        <Lede>It may have moved when we rebuilt the shop. Try one of these.</Lede>
        <div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/">Home <Arrow /></ButtonLink><ButtonLink href="/shop" variant="ghost">Shop the range</ButtonLink></div>
        <nav aria-label="Popular pages" className="mt-10 border-t border-ink-950/10 pt-6">
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">{popular.map((l) => <li key={l.href}><Link href={l.href} className="flex min-h-10 items-center text-sm text-clay-700 underline-offset-4 hover:underline">{l.label}</Link></li>)}</ul>
        </nav>
      </Container>
    </Section>
  );
}
