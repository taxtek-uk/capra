import type { ReactNode } from "react";
import { Container, Eyebrow, Heading, Lede, Faq, Section } from "@/components/ui/primitives";
import { Reveal, Stagger, Item } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/** Numbered process. */
export function Steps({ steps, tone = "bone", eyebrow = "How it works", title }: { steps: readonly { n: string; title: string; body: string }[]; tone?: "light" | "dark" | "bone"; eyebrow?: string; title: ReactNode }) {
  const dark = tone === "dark";
  return (
    <Section tone={tone}>
      <Container>
        <Reveal className="max-w-2xl"><Eyebrow className={dark ? "text-brass-400" : undefined}>{eyebrow}</Eyebrow><Heading className={dark ? "text-bone-50" : undefined}>{title}</Heading></Reveal>
        <Stagger className={cn("mt-14 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4", dark ? "border-bone-50/10 bg-bone-50/10" : "border-ink-950/10 bg-ink-950/10")}>
          {steps.map((s) => (
            <Item key={s.n} className={cn("p-7", dark ? "bg-ink-900" : "bg-bone-50")}>
              <div className={cn("font-display text-4xl tnum", dark ? "text-brass-400" : "text-clay-700")}>{s.n}</div>
              <h3 className="mt-6 text-lg font-medium">{s.title}</h3>
              <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-bone-100/65" : "text-stone-600")}>{s.body}</p>
            </Item>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

/** Feature grid, 3 columns. */
export function FeatureGrid({ items, eyebrow, title, lede, tone = "light" }: { items: readonly { title: string; body: string }[]; eyebrow?: string; title: ReactNode; lede?: string; tone?: "light" | "dark" | "bone" }) {
  const dark = tone === "dark";
  return (
    <Section tone={tone}>
      <Container>
        <Reveal className="max-w-2xl">{eyebrow && <Eyebrow className={dark ? "text-brass-400" : undefined}>{eyebrow}</Eyebrow>}<Heading className={dark ? "text-bone-50" : undefined}>{title}</Heading>{lede && <Lede className={dark ? "text-bone-100/70" : undefined}>{lede}</Lede>}</Reveal>
        <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f) => (
            <Item key={f.title} className={cn("rounded-2xl border p-7", dark ? "border-bone-50/10 bg-ink-900" : "border-ink-950/10 bg-bone-50")}>
              <span className={cn("block h-px w-8", dark ? "bg-brass-400" : "bg-clay-500")} aria-hidden />
              <h3 className="mt-6 text-lg font-medium">{f.title}</h3>
              <p className={cn("mt-2 text-sm leading-relaxed", dark ? "text-bone-100/65" : "text-stone-600")}>{f.body}</p>
            </Item>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}

export function FaqSection({ items, title = "Questions, answered.", eyebrow = "FAQ", tone = "light" }: { items: readonly { q: string; a: string }[]; title?: ReactNode; eyebrow?: string; tone?: "light" | "dark" | "bone" }) {
  return (
    <Section tone={tone}>
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <Reveal><Eyebrow>{eyebrow}</Eyebrow><Heading>{title}</Heading></Reveal>
        <Reveal delay={0.1}><Faq items={[...items]} light={tone === "dark"} /></Reveal>
      </Container>
    </Section>
  );
}

/** Plain long-form page body (policies, help): headings and paragraphs at reading width. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl space-y-5 leading-[1.75] text-stone-700 [&_a]:text-clay-700 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:leading-snug [&_h2]:text-ink-950 sm:[&_h2]:text-3xl [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">{children}</div>;
}
