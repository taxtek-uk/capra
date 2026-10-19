import Link from "next/link";
import { Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { customerHref } from "@/lib/customers-admin";
import { basketLink, listSavedBaskets } from "@/lib/saved-baskets";
import { Btn, Card, CardHead, Input, PageHead, Pill, Table, Td, Tr, ago } from "@/components/admin/ui";
import { pkr } from "@/lib/utils";
import { SetupNotice } from "../_parts";

export const dynamic = "force-dynamic";

/** "Email me my basket" requests: shoppers who were interested but did not order yet. */
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { q = "" } = await searchParams;
  if (!db()) return <SetupNotice reason="CAPRA_DATABASE_URL is not set." />;
  const rows = await listSavedBaskets(q).catch(() => null);
  if (!rows) return <SetupNotice reason="The saved_baskets table is missing. Apply docs/schema.sql to the database." />;

  return (
    <>
      <PageHead title="Saved baskets" sub={`${rows.length} shown · ${rows.filter((r) => r.remind).length} asked for a reminder`} />
      <Card>
        <CardHead title="Filter" sub="Search by email address" />
        <form className="flex flex-wrap items-end gap-2 p-5 pt-4">
          <div className="relative min-w-[16rem] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" /><Input name="q" defaultValue={q} placeholder="Search email" className="pl-9" /></div>
          <Btn type="submit">Apply</Btn>
        </form>
        <Table head={["Saved", "Email", "Items", "Total", "Reminder", "Basket"]} empty="No saved baskets yet.">
          {rows.map((r) => (
            <Tr key={r.id}>
              <Td className="whitespace-nowrap">{ago(r.createdAt)}<span className="block text-xs text-zinc-400">{new Date(r.createdAt).toLocaleDateString("en-PK")}</span></Td>
              <Td><Link href={customerHref(r.email)} className="hover:underline">{r.email}</Link></Td>
              <Td className="text-zinc-500">{r.items.map((i) => `${i.qty} × ${i.id.slice(2)} (${i.variant ?? ""})`).join(", ")}</Td>
              <Td className="font-medium tnum">{pkr(r.total)}</Td>
              <Td>{!r.remind ? <span className="text-zinc-400">Not asked</span> : r.remindedAt ? <Pill tone="green">Sent {new Date(r.remindedAt).toLocaleDateString("en-PK")}</Pill> : <Pill tone="amber">Due</Pill>}</Td>
              <Td><a href={basketLink(r)} target="_blank" rel="noopener" className="text-sm text-zinc-900 underline-offset-4 hover:underline">Open</a></Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
