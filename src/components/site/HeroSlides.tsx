"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const HOLD_MS = 6000;

/** The hero's photos as a slow cross-fade. The first slide is the LCP image; the rest load behind it. */
export function HeroSlides({ slides }: { slides: { src: string; alt: string }[] }) {
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => setAt((n + slides.length) % slides.length);

  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setAt((a) => (a + 1) % slides.length), HOLD_MS);
    return () => clearTimeout(t);
  }, [at, paused, slides.length]);

  const ctl = "grid h-11 w-11 place-items-center rounded-full border border-bone-50/25 bg-ink-950/40 text-bone-50 backdrop-blur-sm transition hover:border-bone-50/60 hover:bg-ink-950/70";
  return (
    <>
      <div className="hero-parallax absolute inset-0 -z-10">
        {slides.map((s, i) => (
          <Image
            key={s.src} src={s.src} alt={s.alt} fill sizes="100vw" aria-hidden={i !== at}
            {...(i === 0 ? { preload: true, fetchPriority: "high" as const } : { loading: "lazy" as const })}
            className={cn("object-cover object-right [transition:opacity_1.2s_ease,scale_7s_linear]", i === at ? "scale-105 opacity-100" : "scale-100 opacity-0")}
          />
        ))}
      </div>
      <div role="group" aria-label="Hero photos" className="absolute inset-x-0 bottom-5 z-10 mx-auto flex w-full max-w-7xl items-center justify-end gap-2 px-5 sm:px-8 print:hidden">
        <div className="mr-1 flex items-center">
          {slides.map((s, i) => (
            <button key={s.src} type="button" onClick={() => go(i)} aria-label={`Show photo ${i + 1} of ${slides.length}`} aria-current={i === at} className="grid h-11 w-7 place-items-center">
              <span className={cn("h-1 rounded-full transition-all duration-500", i === at ? "w-6 bg-brass-400" : "w-3 bg-bone-50/50")} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className={ctl}>{paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}</button>
        <button type="button" onClick={() => go(at - 1)} aria-label="Previous photo" className={ctl}><ChevronLeft className="h-5 w-5" aria-hidden /></button>
        <button type="button" onClick={() => go(at + 1)} aria-label="Next photo" className={ctl}><ChevronRight className="h-5 w-5" aria-hidden /></button>
      </div>
    </>
  );
}
