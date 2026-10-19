import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { cn } from "@/lib/utils";

/** Full-bleed dark hero with slow parallax, gradient scrim and grain. */
export function Hero({ image, eyebrow, title, lede, actions, aside, compact, breadcrumbs }: {
  image: { src: string; alt: string }; eyebrow?: string; title: ReactNode; lede?: ReactNode; actions?: ReactNode; aside?: ReactNode; compact?: boolean;
  /** Renders the trail and its BreadcrumbList JSON-LD. Omit on the homepage only. */
  breadcrumbs?: { name: string; path: string }[];
}) {
  return (
    <section className={cn("hero-scene grain relative isolate overflow-hidden bg-ink-950 text-bone-50", compact ? "min-h-[56svh]" : "min-h-[72svh]")}>
      <div className="hero-parallax absolute inset-0 -z-10">
        <Image src={image.src} alt={image.alt} fill preload fetchPriority="high" sizes="100vw" className="object-cover object-right" />
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(11_10_9)_0%,rgb(11_10_9/0.7)_40%,rgb(11_10_9/0.25)_100%)]" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(11_10_9/0.85)_0%,transparent_70%)]" aria-hidden />
      <Container className={cn("relative flex flex-col justify-end pb-16 pt-36 sm:pb-24", compact ? "min-h-[56svh]" : "min-h-[72svh]")}>
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rise max-w-3xl">
            {breadcrumbs && <div className="mb-6"><Breadcrumbs light items={breadcrumbs} /></div>}
            {eyebrow && <p className="mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-brass-400"><span className="h-px w-6 bg-current" aria-hidden />{eyebrow}</p>}
            <h1 className="font-display text-display-md leading-[1.04] sm:text-5xl lg:text-display-xl">{title}</h1>
            {lede && <p className="mt-6 max-w-xl text-base leading-relaxed text-bone-100/85 sm:text-lg">{lede}</p>}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          </div>
          {aside && <div className="relative hidden lg:block">{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
