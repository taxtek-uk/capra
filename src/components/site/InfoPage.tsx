import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Prose } from "@/components/site/sections";
import { Container, Section, Eyebrow, Heading, Lede } from "@/components/ui/primitives";

/** Help, policy and guide pages: breadcrumb, H1, lede and a reading-width body. */
export function InfoPage({ crumb, path, eyebrow, title, lede, children, aside }: { crumb: string; path: string; eyebrow: string; title: string; lede: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: crumb, path }]} />
        <div className="mt-6 max-w-3xl"><Eyebrow>{eyebrow}</Eyebrow><Heading as="h1">{title}</Heading><Lede>{lede}</Lede></div>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_20rem]">
          <Prose>{children}</Prose>
          {aside && <aside className="h-fit rounded-2xl border border-ink-950/10 bg-bone-100 p-6 text-sm lg:sticky lg:top-28">{aside}</aside>}
        </div>
      </Container>
    </Section>
  );
}

