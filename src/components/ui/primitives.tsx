import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...p }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)} {...p} />;
}

export function Section({ className, tone = "light", children, ...p }: ComponentProps<"section"> & { tone?: "light" | "dark" | "bone" }) {
  return (
    <section
      className={cn(
        "relative py-14 sm:py-28",
        tone === "dark" && "bg-ink-950 text-bone-100",
        tone === "bone" && "bg-bone-100",
        className,
      )}
      {...p}
    >
      {/* No Suspense here: React outlines a large boundary after the footer and reveals it on a ~300ms throttle,
          which held back the Largest Contentful Paint of every page that opens with a Section. */}
      {children}
    </section>
  );
}

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn("mb-4 inline-flex items-center gap-2 eyebrow text-xs font-medium uppercase tracking-[0.22em]", className)}>
      <span className="h-px w-6 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}

export function Heading({ as: Tag = "h2", className, children }: { as?: "h1" | "h2" | "h3"; className?: string; children: ReactNode }) {
  const size = Tag === "h1" ? "text-4xl sm:text-5xl lg:text-display-xl leading-[1.04]" : Tag === "h2" ? "text-3xl sm:text-5xl leading-[1.06]" : "text-xl sm:text-2xl leading-snug";
  return <Tag className={cn("font-display", size, className)}>{children}</Tag>;
}

export function Lede({ className, children }: { className?: string; children: ReactNode }) {
  return <p className={cn("lede mt-5 max-w-2xl text-base leading-relaxed sm:text-lg", className)}>{children}</p>;
}

export const btn = {
  base: "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  primary: "bg-ink-950 text-bone-50 hover:bg-ink-800 shadow-lift",
  brass: "bg-brass-500 text-ink-950 hover:bg-brass-400 shadow-lift",
  ghost: "border border-ink-950/15 text-ink-900 hover:border-ink-950/40 hover:bg-bone-100",
  ghostLight: "border border-bone-50/25 text-bone-50 hover:border-bone-50/60 hover:bg-bone-50/10",
  link: "px-0 py-0 text-clay-700 underline-offset-4 hover:underline",
} as const;
export type ButtonVariant = keyof Omit<typeof btn, "base">;

export function Button({ variant = "primary", className, ...p }: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={cn(btn.base, btn[variant], className)} {...p} />;
}
export function ButtonLink({ variant = "primary", className, href, ...p }: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link href={href} className={cn(btn.base, btn[variant], className)} {...p} />;
}
export function Arrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5", className)} strokeWidth={1.75} aria-hidden />;
}

export function Badge({ className, children, tone = "clay" }: { className?: string; children: ReactNode; tone?: "clay" | "brass" | "ink" | "light" | "success" | "warning" | "danger" }) {
  const t = {
    clay: "bg-clay-500/10 text-clay-700 ring-clay-500/20", brass: "bg-brass-500/15 text-clay-700 ring-brass-500/30", ink: "bg-ink-950 text-bone-50 ring-ink-950", light: "bg-bone-50/10 text-bone-100 ring-bone-50/20",
    success: "bg-success/10 text-success ring-success/25", warning: "bg-warning/10 text-warning ring-warning/25", danger: "bg-danger/10 text-danger ring-danger/25",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide ring-1 ring-inset", t, className)}>{children}</span>;
}

export function Hairline({ className, light }: { className?: string; light?: boolean }) {
  return <hr className={cn("border-0 border-t", light ? "hairline-light" : "hairline", className)} />;
}

export function Stat({ value, label, light }: { value: string; label: string; light?: boolean }) {
  return (
    <div>
      <div className={cn("font-display text-3xl sm:text-4xl tnum", light ? "text-bone-50" : "text-ink-950")}>{value}</div>
      <div className={cn("mt-1 text-xs uppercase tracking-[0.18em]", light ? "text-bone-100/60" : "text-stone-600")}>{label}</div>
    </div>
  );
}

export function Faq({ items, light }: { items: { q: string; a: string }[]; light?: boolean }) {
  return (
    <div className={cn("divide-y", light ? "divide-bone-50/10" : "divide-ink-950/10")}>
      {items.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex items-start justify-between gap-6 text-left text-base font-medium sm:text-lg">
            <span>{f.q}</span>
            <span className={cn("mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs transition-transform group-open:rotate-45", light ? "border-bone-50/30" : "border-ink-950/20")} aria-hidden>+</span>
          </summary>
          <p className={cn("mt-3 max-w-3xl text-sm leading-relaxed sm:text-base", light ? "text-bone-100/70" : "text-stone-600")}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
