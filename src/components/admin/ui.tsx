import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Surfaces ──────────────────────────────────────────────────────────── */

export function Card({ className, ...p }: ComponentProps<"div">) {
  return <div className={cn("rounded-xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)]", className)} {...p} />;
}

export function CardHead({ title, sub, children, className }: { title: ReactNode; sub?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 px-5 pt-5", className)}>
      <div>
        <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
        {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/* ─── Bits ──────────────────────────────────────────────────────────────── */

const toneClass = {
  neutral: "border-zinc-200 bg-white text-zinc-600",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-rose-200 bg-rose-50 text-rose-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  ink: "border-zinc-800 bg-zinc-900 text-white",
} as const;
export type Tone = keyof typeof toneClass;

export function Pill({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium tnum", toneClass[tone], className)}>{children}</span>;
}

/** Status text → a consistent colour, so "won" reads the same on every screen. */
export function StatusPill({ value }: { value: string }) {
  const tone: Tone = /delivered|replied|^paid$|published|active/i.test(value) ? "green"
    : /cancelled|refunded|closed|failed/i.test(value) ? "red"
    : /new|draft|unpaid/i.test(value) ? "amber"
    : /confirmed|shipped|sent/i.test(value) ? "blue" : "neutral";
  return <Pill tone={tone}><span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />{value}</Pill>;
}

export function Delta({ value }: { value: number | null }) {
  if (value === null || !Number.isFinite(value)) return null;
  const up = value >= 0;
  return (
    <Pill tone={up ? "green" : "red"}>
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {up ? "+" : ""}{value.toFixed(1)}%
    </Pill>
  );
}

export function StatCard({ icon, label, value, delta, note }: { icon: ReactNode; label: string; value: string; delta?: number | null; note?: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-zinc-500">
        <span className="grid h-7 w-7 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-2xl font-semibold tracking-tight text-zinc-900 tnum">{value}</span>
        <Delta value={delta ?? null} />
      </div>
      {note && <p className="mt-2 text-xs text-zinc-500">{note}</p>}
    </Card>
  );
}

/* ─── Table ─────────────────────────────────────────────────────────────── */

export function Table({ head, children, empty, cols }: { head: string[]; children: ReactNode; empty?: string; cols?: number }) {
  const rows = Array.isArray(children) ? children.length : children ? 1 : 0;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-y border-zinc-200/80 bg-zinc-50/60 text-left text-xs font-medium text-zinc-500">
            {head.map((h) => <th key={h} className="whitespace-nowrap px-5 py-2.5 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {rows ? children : <tr><td colSpan={cols ?? head.length} className="px-5 py-10 text-center text-sm text-zinc-500">{empty ?? "Nothing here yet."}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
export function Td({ className, ...p }: ComponentProps<"td">) {
  return <td className={cn("px-5 py-3 align-top text-zinc-700", className)} {...p} />;
}
export function Tr({ className, ...p }: ComponentProps<"tr">) {
  return <tr className={cn("hover:bg-zinc-50/70", className)} {...p} />;
}

/** Label + share bar, for top-pages / sources / locations lists. */
export function BarRow({ label, href, value, max, suffix }: { label: ReactNode; href?: string; value: number; max: number; suffix?: string }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  const body = (
    <>
      <span className="relative z-10 truncate pr-3 text-zinc-700">{label}</span>
      <span className="relative z-10 shrink-0 text-zinc-500 tnum">{value.toLocaleString("en-PK")}{suffix}</span>
      <span className="absolute inset-y-0 left-0 rounded-md bg-zinc-100" style={{ width: `${pct}%` }} aria-hidden />
    </>
  );
  const cls = "relative flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-zinc-50";
  return href ? <Link href={href} className={cls}>{body}</Link> : <div className={cls}>{body}</div>;
}

/* ─── Chart ─────────────────────────────────────────────────────────────── */

export type Point = { label: string; a: number; b: number };

/**
 * Two-series area chart as plain SVG. A chart library would be 40kB for one shape;
 * this is the shape. Series A is filled dark, series B sits behind it in grey.
 */
export function AreaChart({ points, height = 240, legend }: { points: Point[]; height?: number; legend?: [string, string] }) {
  const w = 1000;
  const h = height;
  const pad = 16;
  const max = Math.max(1, ...points.flatMap((p) => [p.a, p.b]));
  const x = (i: number) => (points.length < 2 ? w / 2 : (i / (points.length - 1)) * (w - pad * 2) + pad);
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);
  const line = (k: "a" | "b") => points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p[k]).toFixed(1)}`).join(" ");
  const area = (k: "a" | "b") => `${line(k)} L${x(points.length - 1).toFixed(1)},${h - pad} L${x(0).toFixed(1)},${h - pad} Z`;
  const ticks = points.filter((_, i) => i % Math.ceil(points.length / 8) === 0);

  return (
    <div>
      {legend && (
        <div className="mb-2 flex items-center justify-end gap-4 px-5 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-[3px] bg-zinc-900" />{legend[0]}</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-[3px] bg-zinc-300" />{legend[1]}</span>
        </div>
      )}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} role="img" aria-label={`${legend?.[0] ?? "Series"} over time, peak ${max}`}>
        <defs>
          <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#18181b" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#e4e4e7" strokeWidth="1" />
        {points.length > 1 && (
          <>
            <path d={area("b")} fill="#f4f4f5" />
            <path d={line("b")} fill="none" stroke="#d4d4d8" strokeWidth="1.5" />
            <path d={area("a")} fill="url(#fillA)" />
            <path d={line("a")} fill="none" stroke="#18181b" strokeWidth="1.75" strokeLinejoin="round" />
          </>
        )}
      </svg>
      <div className="flex justify-between px-5 pb-4 text-[11px] text-zinc-400 tnum">
        {ticks.map((t) => <span key={t.label}>{t.label}</span>)}
      </div>
    </div>
  );
}

/* ─── Forms ─────────────────────────────────────────────────────────────── */

const control = "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5";

export function Input({ className, ...p }: ComponentProps<"input">) { return <input className={cn(control, className)} {...p} />; }
export function Textarea({ className, ...p }: ComponentProps<"textarea">) { return <textarea className={cn(control, "leading-relaxed", className)} {...p} />; }
export function Select({ className, ...p }: ComponentProps<"select">) { return <select className={cn(control, "appearance-none pr-8", className)} {...p} />; }

export function Field({ label, hint, children, className }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-zinc-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-zinc-500">{hint}</span>}
    </label>
  );
}

const btn = {
  base: "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  ghost: "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
  danger: "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50",
} as const;
export function Btn({ variant = "primary", className, ...p }: ComponentProps<"button"> & { variant?: "primary" | "ghost" | "danger" }) {
  return <button className={cn(btn.base, btn[variant], className)} {...p} />;
}
export function BtnLink({ variant = "ghost", className, ...p }: ComponentProps<typeof Link> & { variant?: "primary" | "ghost" | "danger" }) {
  return <Link className={cn(btn.base, btn[variant], className)} {...p} />;
}

/* ─── Page header ───────────────────────────────────────────────────────── */

export function PageHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">{title}</h1>
        {sub && <p className="mt-1 text-sm text-zinc-500">{sub}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/** Consistent relative time across the dashboard. */
export function ago(d: Date | string) {
  const ms = Date.now() - new Date(d).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const hrs = Math.round(m / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days < 30 ? `${days}d ago` : new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

export const mins = (ms: number) => {
  const s = Math.round(ms / 1000);
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
};
