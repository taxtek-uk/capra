"use client";
import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Character counter for the fields `npm run check:seo` measures. The build fails on a title
 * over 60 or a description outside 70–160, so the author needs to see the number while typing.
 */
export function Counted({
  min = 0, max, rows, hint, label, ...p
}: Omit<ComponentProps<"textarea">, "rows"> & { min?: number; max: number; rows?: number; hint?: string; label: string }) {
  const [len, setLen] = useState(String(p.defaultValue ?? "").length);
  const ok = len >= min && len <= max;
  const control = "w-full rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-900/5";
  const border = len === 0 ? "border-zinc-200" : ok ? "border-emerald-300" : "border-amber-300";

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-zinc-700">{label}</span>
        <span className={cn("text-[11px] tnum", len === 0 ? "text-zinc-400" : ok ? "text-emerald-600" : "text-amber-600")}>
          {len}/{max}{min ? ` · min ${min}` : ""}
        </span>
      </span>
      {rows ? (
        <textarea {...p} rows={rows} onChange={(e) => setLen(e.target.value.length)} className={cn(control, border, "leading-relaxed")} />
      ) : (
        <input {...(p as ComponentProps<"input">)} onChange={(e) => setLen(e.target.value.length)} className={cn(control, border)} />
      )}
      {hint && <span className="mt-1 block text-[11px] text-zinc-500">{hint}</span>}
    </label>
  );
}
