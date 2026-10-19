import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { recentSessions } from "@/lib/analytics";
import { BtnLink, Card, CardHead, PageHead, Pill, Table, Td, Tr, ago, mins } from "@/components/admin/ui";
import { SetupNotice } from "../_parts";

export const dynamic = "force-dynamic";
const PER = 50;

export default async function Page({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  await requireAdmin();
  const page = Math.max(0, Number((await searchParams).p) || 0);
  if (!db()) return <SetupNotice reason="DATABASE_URL is not set." />;
  const rows = await recentSessions(PER, page * PER).catch(() => null);
  if (!rows) return <SetupNotice reason="The analytics tables are missing. Apply docs/schema.sql to the database." />;

  return (
    <>
      <PageHead title="Visitors" sub="Every visit, in order, with the pages it touched and how long it lasted." />
      <Card>
        <CardHead title={`${rows.length} recent visits`} sub="Click a visit to replay the route it took through the site" />
        <div className="mt-4">
          <Table head={["When", "Location", "Landed on", "Last seen on", "Pages", "Time", "Source", "Device"]} empty="No visits recorded yet.">
            {rows.map((r) => (
              <Tr key={String(r.id)}>
                <Td className="whitespace-nowrap">
                  <Link href={`/admin/visitors/${r.id}`} className="font-medium text-zinc-900 hover:underline">{ago(String(r.started_at))}</Link>
                  <span className="block text-xs text-zinc-400">{new Date(String(r.started_at)).toLocaleString("en-PK")}</span>
                </Td>
                <Td>{r.city ? `${r.city}${r.region ? `, ${r.region}` : ""}` : "Unknown"}<span className="block text-xs text-zinc-400">{String(r.country ?? "")}</span></Td>
                <Td className="max-w-[14rem] truncate text-zinc-600">{String(r.landing_path ?? "—")}</Td>
                <Td className="max-w-[14rem] truncate text-zinc-600">{String(r.last_path ?? "—")}</Td>
                <Td className="tnum">{Number(r.views)}{Number(r.events) > 0 && <span className="ml-1 text-xs text-zinc-400">+{Number(r.events)} actions</span>}</Td>
                <Td className="whitespace-nowrap tnum">{mins(Number(r.duration_ms))}</Td>
                <Td className="max-w-[12rem] truncate text-xs text-zinc-500">
                  {r.ref_code ? <Pill tone="blue">ref {String(r.ref_code)}</Pill> : r.utm_source ? String(r.utm_source) : r.referrer ? new URL(String(r.referrer)).hostname.replace(/^www\./, "") : "Direct"}
                </Td>
                <Td className="whitespace-nowrap text-xs capitalize text-zinc-500">{String(r.device ?? "")} · {String(r.browser ?? "")}</Td>
              </Tr>
            ))}
          </Table>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
          <span>Page {page + 1}</span>
          <span className="flex gap-2">
            {page > 0 && <BtnLink href={`/admin/visitors?p=${page - 1}`}>Newer</BtnLink>}
            {rows.length === PER && <BtnLink href={`/admin/visitors?p=${page + 1}`}>Older</BtnLink>}
          </span>
        </div>
      </Card>
    </>
  );
}
