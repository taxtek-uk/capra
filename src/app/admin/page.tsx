import Link from "next/link";
import { Activity, Bot, ExternalLink, Eye, Globe, MessageSquare, MousePointerClick, Search, Share2, ShoppingBag, Timer, Users, Wallet } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { CHANNELS, activity, allTime, channels, overview, places, series, sources, topPages, type Row } from "@/lib/analytics";
import { AreaChart, BarRow, BtnLink, Card, CardHead, PageHead, Pill, StatCard, StatusPill, Table, Td, Tr, ago, mins } from "@/components/admin/ui";
import { PAYMENT_LABEL, type PaymentMethod } from "@/lib/orders";
import { pkr } from "@/lib/utils";
import { RangeTabs, SetupNotice, days as windowDays } from "./_parts";

export const dynamic = "force-dynamic";

const CHANNEL_ICON = { Search, Social: Share2, "AI assistants": Bot, "Other sites": ExternalLink, Direct: MousePointerClick };
const num = (v: number) => v.toLocaleString("en-PK");

/** Shop takings for the window (orders not cancelled), and the orders still waiting on a call or dispatch. */
async function shop(d: number) {
  const sql = db()!;
  const [o] = (await sql`
    select coalesce(sum(total) filter (where status <> 'cancelled' and created_at >= now() - make_interval(days => ${d})), 0)::float as value,
           coalesce(sum(total) filter (where status <> 'cancelled' and created_at >= now() - make_interval(days => ${d * 2}) and created_at < now() - make_interval(days => ${d})), 0)::float as prev_value,
           count(*) filter (where created_at >= now() - make_interval(days => ${d}))::int as n,
           count(*) filter (where status = 'new')::int as to_confirm,
           count(*) filter (where status = 'confirmed')::int as to_ship,
           coalesce(sum(total) filter (where payment_status = 'unpaid' and status = 'shipped'), 0)::float as cod_out
    from orders`) as Row[];
  const [e] = (await sql`select count(*) filter (where created_at >= now() - make_interval(days => ${d}))::int as n, count(*) filter (where status = 'new')::int as open from enquiries`) as Row[];
  const recent = (await sql`select ref, contact->>'name' as name, contact->>'phone' as phone, address->>'city' as city, total::float as total, status, payment_method, created_at from orders order by created_at desc limit 8`) as Row[];
  return { o, e, recent };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  await requireAdmin();
  const d = windowDays((await searchParams).d);
  if (!db()) return <SetupNotice reason="CAPRA_DATABASE_URL is not set." />;

  const data = await Promise.all([overview(d), series(d), topPages(d, 8), sources(d, 6), places(d, 6), activity(10), shop(d), allTime(), channels(d)]).catch(() => null);
  if (!data) return <SetupNotice reason="A table this dashboard reads is missing. Applying docs/schema.sql creates anything that is not there yet." />;
  const [ov, chart, pages, srcs, locs, feed, s, total, chans] = data;
  const n = (r: Row | undefined, k: string) => Number(r?.[k] ?? 0);
  const maxPage = Math.max(1, ...pages.map((p) => Number(p.views)));
  const maxSrc = Math.max(1, ...srcs.map((p) => Number(p.sessions)));
  const maxLoc = Math.max(1, ...locs.map((p) => Number(p.sessions)));

  return (
    <>
      <PageHead title="Overview" sub={`Everything happening on capra.pk over the last ${d} days.`}><RangeTabs d={d} base="/admin" /></PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <StatCard icon={<Wallet className="h-3.5 w-3.5" />} label="Orders value" value={pkr(n(s.o, "value"))} delta={n(s.o, "prev_value") > 0 ? ((n(s.o, "value") - n(s.o, "prev_value")) / n(s.o, "prev_value")) * 100 : null} note={`${n(s.o, "n")} orders, cancelled excluded`} />
        <StatCard icon={<ShoppingBag className="h-3.5 w-3.5" />} label="To confirm" value={num(n(s.o, "to_confirm"))} note={`${n(s.o, "to_ship")} confirmed, waiting to ship · ${pkr(n(s.o, "cod_out"))} COD with couriers`} />
        <StatCard icon={<Users className="h-3.5 w-3.5" />} label="Visitors" value={num(ov?.visitors ?? 0)} delta={ov?.delta.visitors ?? null} note={`${num(ov?.sessions ?? 0)} visits · ${ov?.live ?? 0} on the site now`} />
        <StatCard icon={<Eye className="h-3.5 w-3.5" />} label="Page views" value={num(ov?.views ?? 0)} delta={ov?.delta.views ?? null} note={`${(ov?.bounceRate ?? 0).toFixed(0)}% left after one page`} />
        <StatCard icon={<Timer className="h-3.5 w-3.5" />} label="Time on site" value={mins(ov?.avgMs ?? 0)} delta={ov?.delta.avgMs ?? null} note="Average engaged time per visit" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard icon={<Globe className="h-3.5 w-3.5" />} label="All visits to date" value={num(total?.visits ?? 0)} note={`${num(total?.visitors ?? 0)} visitors · ${num(total?.views ?? 0)} page views`} />
        {CHANNELS.map((c) => { const Icon = CHANNEL_ICON[c]; return <StatCard key={c} icon={<Icon className="h-3.5 w-3.5" />} label={`${c} · visitors`} value={num(chans[c].visitors)} delta={chans[c].delta} note={`${num(chans[c].visits)} visits`} />; })}
      </div>

      <Card className="mt-4">
        <CardHead title="Latest orders" sub={`${n(s.o, "to_confirm")} to confirm by phone or WhatsApp`}><BtnLink href="/admin/orders">All orders</BtnLink></CardHead>
        <div className="mt-4">
          <Table head={["Ref", "Customer", "City", "Total", "Payment", "Status", "When"]} empty="No orders yet.">
            {s.recent.map((r) => (
              <Tr key={String(r.ref)}>
                <Td className="font-medium text-zinc-900 tnum"><Link href={`/admin/orders/${r.ref}`} className="hover:underline">{String(r.ref)}</Link></Td>
                <Td>{String(r.name ?? "—")}<span className="block text-xs text-zinc-400">{String(r.phone ?? "")}</span></Td>
                <Td className="text-zinc-500">{String(r.city ?? "")}</Td>
                <Td className="tnum">{pkr(Number(r.total))}</Td>
                <Td className="text-xs text-zinc-500">{PAYMENT_LABEL[r.payment_method as PaymentMethod] ?? String(r.payment_method)}</Td>
                <Td><StatusPill value={String(r.status)} /></Td>
                <Td className="whitespace-nowrap text-zinc-500">{ago(String(r.created_at))}</Td>
              </Tr>
            ))}
          </Table>
        </div>
      </Card>

      <Card className="mt-4">
        <CardHead title="Traffic" sub={`Page views and unique visitors, last ${d} days`}><BtnLink href="/admin/analytics">View report</BtnLink></CardHead>
        <div className="mt-4"><AreaChart points={chart} legend={["Page views", "Visitors"]} /></div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {([["Most-read pages", pages.map((p) => <BarRow key={String(p.path)} label={String(p.path)} href={String(p.path)} value={Number(p.views)} max={maxPage} />)],
          ["Where visitors come from", srcs.map((p) => <BarRow key={String(p.source)} label={String(p.source)} value={Number(p.sessions)} max={maxSrc} />)],
          ["Cities", locs.map((p) => <BarRow key={`${p.city}|${p.region}|${p.country}`} label={`${p.city}${p.country ? `, ${p.country}` : ""}`} value={Number(p.sessions)} max={maxLoc} />)]] as const).map(([title, rows]) => (
          <Card key={title} className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
            <div className="mt-3 space-y-0.5">{rows}{!rows.length && <p className="py-6 text-center text-sm text-zinc-500">Nothing yet.</p>}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Activity</h2>
        <p className="mt-0.5 text-xs text-zinc-500">Orders, enquiries and tracked actions</p>
        <ul className="mt-4 space-y-3">
          {feed.map((a, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-500">{a.kind === "order" ? <ShoppingBag className="h-3 w-3" /> : a.kind === "enquiry" ? <MessageSquare className="h-3 w-3" /> : <Activity className="h-3 w-3" />}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-zinc-800">{String(a.title)}{a.amount ? <span className="ml-1.5 text-zinc-500 tnum">{pkr(Number(a.amount))}</span> : null}</span><span className="block truncate text-xs text-zinc-500">{String(a.detail ?? "")} · {ago(String(a.created_at))}</span></span>
            </li>
          ))}
          {!feed.length && <li className="py-6 text-center text-sm text-zinc-500">Nothing yet.</li>}
        </ul>
        <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500"><Pill tone="amber">{n(s.e, "open")} open</Pill> enquiries of {n(s.e, "n")} in {d} days</div>
      </Card>
    </>
  );
}
