import { notFound } from "next/navigation";
import { MapPin, Monitor, MousePointerClick, Timer } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { sessionDetail } from "@/lib/analytics";
import { BtnLink, Card, CardHead, PageHead, StatCard, mins } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { session, views, events } = await sessionDetail((await params).id).catch(() => ({ session: null, views: [], events: [] }));
  if (!session) notFound();

  // One timeline: pages and actions interleaved in the order they happened.
  const timeline = [
    ...views.map((v) => ({ at: new Date(String(v.created_at)), kind: "page" as const, main: String(v.path), sub: `${mins(Number(v.duration_ms))} · scrolled ${Number(v.max_scroll)}%` })),
    ...events.map((e) => ({ at: new Date(String(e.created_at)), kind: "event" as const, main: String(e.name).replace(/_/g, " "), sub: String(e.label ?? e.path ?? "") })),
  ].sort((a, b) => a.at.getTime() - b.at.getTime());

  const s = (k: string) => (session[k] == null ? "" : String(session[k]));

  return (
    <>
      <PageHead title="Visit" sub={`${new Date(s("started_at")).toLocaleString("en-PK")} · visitor ${s("visitor_id").slice(0, 8)}`}>
        <BtnLink href="/admin/visitors">Back to visitors</BtnLink>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Timer className="h-3.5 w-3.5" />} label="Engaged time" value={mins(Number(session.duration_ms))} note={`${views.length} pages viewed`} />
        <StatCard icon={<MousePointerClick className="h-3.5 w-3.5" />} label="Actions" value={String(events.length)} note="Calls, emails, form submits" />
        <StatCard icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={s("city") || "Unknown"} note={[s("region"), s("country")].filter(Boolean).join(" · ") || "No edge geo header"} />
        <StatCard icon={<Monitor className="h-3.5 w-3.5" />} label="Device" value={s("device") || "—"} note={`${s("browser")} on ${s("os")} · ${s("screen")}`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHead title="Route through the site" sub="In order, with time spent on each page" />
          <ol className="m-5 mt-4 space-y-0 border-l border-zinc-200">
            {timeline.map((t, i) => (
              <li key={i} className="relative pb-4 pl-5 last:pb-0">
                <span className={`absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full ${t.kind === "page" ? "bg-zinc-900" : "bg-sky-500"}`} />
                <p className="text-sm text-zinc-900">{t.main}</p>
                <p className="text-xs text-zinc-500">{t.sub} · {t.at.toLocaleTimeString("en-PK")}</p>
              </li>
            ))}
            {!timeline.length && <li className="py-6 text-center text-sm text-zinc-500">Nothing recorded on this visit.</li>}
          </ol>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Attribution</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            {([["Landed on", s("landing_path")], ["Referrer", s("referrer") || "Direct"], ["utm_source", s("utm_source")], ["utm_medium", s("utm_medium")], ["utm_campaign", s("utm_campaign")], ["Consultant ref", s("ref_code")], ["Language", s("language")], ["First seen", new Date(s("started_at")).toLocaleString("en-PK")], ["Last seen", new Date(s("last_seen_at")).toLocaleString("en-PK")]] as const)
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-zinc-100 pb-2 last:border-0">
                  <dt className="shrink-0 text-zinc-500">{k}</dt>
                  <dd className="truncate text-right text-zinc-800">{v}</dd>
                </div>
              ))}
          </dl>
        </Card>
      </div>
    </>
  );
}
