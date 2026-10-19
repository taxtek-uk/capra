import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { breakdown, overview, places, series, sources, topEvents, topPages, webVitals } from "@/lib/analytics";
import { AreaChart, BarRow, Card, CardHead, PageHead, Pill, StatCard, Table, Td, Tr, mins } from "@/components/admin/ui";
import { Eye, MousePointerClick, Timer, Users } from "lucide-react";
import { RangeTabs, SetupNotice, days as windowDays } from "../_parts";

export const dynamic = "force-dynamic";

/** Metric, name, and Google's "good" and "poor" thresholds (ms, or a score for CLS). */
const VITAL_ROWS = [
  ["LCP", "Largest paint (main content shown)", 2500, 4000],
  ["INP", "Response to taps and clicks", 200, 500],
  ["CLS", "Layout shift", 0.1, 0.25],
  ["FCP", "First paint", 1800, 3000],
  ["TTFB", "Server response", 800, 1800],
] as const;

export default async function Page({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  await requireAdmin();
  const d = windowDays((await searchParams).d);
  if (!db()) return <SetupNotice reason="DATABASE_URL is not set." />;

  const data = await Promise.all([
    overview(d), series(d), topPages(d, 25), sources(d, 10), places(d, 12),
    breakdown(d, "device"), breakdown(d, "browser"), breakdown(d, "os"), topEvents(d, 12), webVitals(d),
  ]).catch(() => null);
  if (!data) return <SetupNotice reason="The analytics tables are missing. Apply docs/schema.sql to the database." />;
  const [ov, chart, pages, srcs, locs, devices, browsers, oss, events, vitals] = data;

  const max = (rows: { [k: string]: unknown }[], k: string) => Math.max(1, ...rows.map((r) => Number(r[k])));

  return (
    <>
      <PageHead title="Analytics" sub="Traffic, engagement and behaviour across the whole site.">
        <RangeTabs d={d} base="/admin/analytics" />
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Users className="h-3.5 w-3.5" />} label="Unique visitors" value={(ov?.visitors ?? 0).toLocaleString("en-PK")} delta={ov?.delta.visitors ?? null} note={`${ov?.live ?? 0} active in the last 5 minutes`} />
        <StatCard icon={<Eye className="h-3.5 w-3.5" />} label="Page views" value={(ov?.views ?? 0).toLocaleString("en-PK")} delta={ov?.delta.views ?? null} note={`${((ov?.views ?? 0) / Math.max(1, ov?.sessions ?? 1)).toFixed(1)} pages per visit`} />
        <StatCard icon={<Timer className="h-3.5 w-3.5" />} label="Engaged time" value={mins(ov?.avgMs ?? 0)} delta={ov?.delta.avgMs ?? null} note="Average per visit, tab in focus" />
        <StatCard icon={<MousePointerClick className="h-3.5 w-3.5" />} label="Single-page visits" value={`${(ov?.bounceRate ?? 0).toFixed(0)}%`} note="Left without a second page" />
      </div>

      <Card className="mt-4">
        <CardHead title="Views and visitors" sub={`Daily, last ${d} days`} />
        <div className="mt-4"><AreaChart points={chart} legend={["Page views", "Visitors"]} /></div>
      </Card>

      <Card className="mt-4">
        <CardHead title="Pages" sub="What people actually read, and for how long" />
        <div className="mt-4">
          <Table head={["Path", "Views", "Visitors", "Avg time", "Avg scroll"]} empty="No page views recorded yet.">
            {pages.map((p) => (
              <Tr key={String(p.path)}>
                <Td className="font-medium text-zinc-900"><a href={String(p.path)} target="_blank" className="hover:underline">{String(p.path)}</a></Td>
                <Td className="tnum">{Number(p.views).toLocaleString("en-PK")}</Td>
                <Td className="tnum">{Number(p.visitors).toLocaleString("en-PK")}</Td>
                <Td className="tnum">{mins(Number(p.avg_ms))}</Td>
                <Td className="tnum">{Math.round(Number(p.avg_scroll))}%</Td>
              </Tr>
            ))}
          </Table>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Sources</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Referrer host, or the utm_source when one was tagged</p>
          <div className="mt-3 space-y-0.5">
            {srcs.map((r) => <BarRow key={String(r.source)} label={String(r.source)} value={Number(r.sessions)} max={max(srcs, "sessions")} />)}
            {!srcs.length && <p className="py-6 text-center text-sm text-zinc-500">Nothing yet.</p>}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Locations</h2>
          <p className="mt-0.5 text-xs text-zinc-500">From the edge, by city — no IP is stored</p>
          <div className="mt-3 space-y-0.5">
            {locs.map((r) => <BarRow key={`${r.city}-${r.region}`} label={`${r.city}${r.region ? `, ${r.region}` : ""}${r.country ? ` · ${r.country}` : ""}`} value={Number(r.sessions)} max={max(locs, "sessions")} />)}
            {!locs.length && <p className="py-6 text-center text-sm text-zinc-500">Nothing yet.</p>}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {([["Devices", devices], ["Browsers", browsers], ["Operating systems", oss]] as const).map(([title, rows]) => (
          <Card key={title} className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
            <div className="mt-3 space-y-0.5">
              {rows.map((r) => <BarRow key={String(r.label)} label={<span className="capitalize">{String(r.label)}</span>} value={Number(r.sessions)} max={max(rows, "sessions")} />)}
              {!rows.length && <p className="py-6 text-center text-sm text-zinc-500">Nothing yet.</p>}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHead title="Page speed" sub="What real visitors experienced: the 75th percentile, Google's own cut-off for a page being good" />
        <div className="mt-4">
          <Table head={["Metric", "All devices", "Mobile", "Desktop", "Readings"]} empty="No page-speed readings yet. They arrive as people browse.">
            {VITAL_ROWS.filter(([m]) => vitals.some((v) => v.metric === m)).map(([m, label, good, poor]) => {
              const at = (device: string) => vitals.find((v) => v.metric === m && v.device === device);
              const cell = (device: string) => {
                const v = at(device);
                if (!v) return <span className="text-zinc-400">—</span>;
                const p75 = Number(v.p75);
                return <Pill tone={p75 <= good ? "green" : p75 > poor ? "red" : "amber"}>{m === "CLS" ? p75.toFixed(2) : p75 >= 1000 ? `${(p75 / 1000).toFixed(1)} s` : `${Math.round(p75)} ms`}</Pill>;
              };
              return (
                <Tr key={m}>
                  <Td className="font-medium text-zinc-900">{label}</Td>
                  <Td>{cell("all")}</Td><Td>{cell("mobile")}</Td><Td>{cell("desktop")}</Td>
                  <Td className="tnum">{Number(at("all")?.n ?? 0).toLocaleString("en-PK")}</Td>
                </Tr>
              );
            })}
          </Table>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHead title="Actions" sub="Calls, emails, form submissions and outbound clicks" />
        <div className="mt-4">
          <Table head={["Event", "Times", "Visits"]} empty="No events recorded yet.">
            {events.map((e) => (
              <Tr key={String(e.name)}>
                <Td className="font-medium text-zinc-900">{String(e.name).replace(/_/g, " ")}</Td>
                <Td className="tnum">{Number(e.n).toLocaleString("en-PK")}</Td>
                <Td className="tnum">{Number(e.sessions).toLocaleString("en-PK")}</Td>
              </Tr>
            ))}
          </Table>
        </div>
      </Card>
    </>
  );
}
