import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

const WINDOWS = [7, 30, 90] as const;

/** Clamps the ?d= window to one of the three the dashboard offers. */
export const days = (raw?: string) => {
  const n = Number(raw);
  return (WINDOWS as readonly number[]).includes(n) ? n : 30;
};

export function RangeTabs({ d, base, extra = "" }: { d: number; base: string; extra?: string }) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-0.5 text-xs">
      {WINDOWS.map((w) => (
        <Link
          key={w}
          href={`${base}?d=${w}${extra}`}
          className={cn("rounded-md px-2.5 py-1.5 font-medium", w === d ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50")}
        >
          {w} days
        </Link>
      ))}
    </div>
  );
}

export function SetupNotice({ reason }: { reason: string }) {
  return (
    <Card className="mx-auto mt-10 max-w-lg p-6">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <h1 className="text-sm font-semibold text-zinc-900">Dashboard not ready</h1>
          <p className="mt-1 text-sm text-zinc-600">{reason}</p>
          <p className="mt-3 text-xs text-zinc-500">Apply the schema with <code className="rounded bg-zinc-100 px-1 py-0.5">node scripts/apply-schema.mjs</code>, then reload.</p>
        </div>
      </div>
    </Card>
  );
}
