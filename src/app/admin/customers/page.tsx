import Link from "next/link";
import { Download, Search } from "lucide-react";
import { isOwner, requireAdmin } from "@/lib/admin";
import { dbUrl } from "@/lib/db";
import { CUSTOMER_FILTERS, LIST_LIMIT, customerHref, listCustomers } from "@/lib/customers-admin";
import { Btn, Card, CardHead, Input, PageHead, Pill, Select, Table, Td, Tr, ago } from "@/components/admin/ui";
import { pkr } from "@/lib/utils";
import { SetupNotice } from "../_parts";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string; show?: string }> }) {
  const me = await requireAdmin();
  const { q = "", show = "" } = await searchParams;
  if (!dbUrl()) return <SetupNotice reason="CAPRA_DATABASE_URL is not set." />;

  const filter = { q: q.trim().slice(0, 120), show: CUSTOMER_FILTERS.some(([v]) => v === show) ? show : "" };
  // The customer tables ship in docs/schema.sql and are applied by hand, so say so rather than throw.
  const rows = await listCustomers(filter).catch((err) => {
    console.error("[admin customers]", err);
    return null;
  });
  if (!rows) return <SetupNotice reason="The customers or marketing_consents table is missing. Apply docs/schema.sql to the database." />;
  const spent = rows.reduce((a, r) => a + Number(r.spent), 0);

  return (
    <>
      <PageHead title="Customers" sub={`${rows.length}${rows.length === LIST_LIMIT ? "+" : ""} matching · ${pkr(spent)} ordered`}>
        {isOwner(me) && (
          // A plain GET form, not a Link: the response is a file download, not a page.
          <form action="/admin/customers/export" method="get">
            <Btn variant="ghost" type="submit"><Download className="h-3.5 w-3.5" /> Export marketing consents</Btn>
          </form>
        )}
      </PageHead>
      <Card>
        <CardHead title="Filter" sub="Everyone who ordered with an email, sent an enquiry or signed in, one row per email address. Phone-only orders are under Orders." />
        <form className="flex flex-wrap items-end gap-2 p-5 pt-4">
          <div className="relative min-w-[16rem] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <Input name="q" defaultValue={filter.q} placeholder="Search name or email" className="pl-9" />
          </div>
          <div className="w-56">
            <Select name="show" defaultValue={filter.show}>{CUSTOMER_FILTERS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</Select>
          </div>
          <Btn type="submit">Apply</Btn>
        </form>
        <Table head={["Customer", "Orders", "Ordered", "Enquiries", "Account", "Marketing", "Last seen"]} empty="Nobody matches those filters.">
          {rows.map((r) => (
            <Tr key={r.email}>
              <Td>
                <Link href={customerHref(r.email)} className="font-medium text-zinc-900 hover:underline">{r.name || r.email}</Link>
                {r.name && <span className="block text-xs text-zinc-400">{r.email}</span>}
              </Td>
              <Td className="tnum">{r.orders}</Td>
              <Td className="font-medium tnum">{Number(r.spent) ? pkr(Number(r.spent)) : "—"}</Td>
              <Td className="tnum text-zinc-500">{r.enquiries}</Td>
              <Td>{r.has_account ? <Pill tone="green">account</Pill> : <Pill>guest</Pill>}</Td>
              <Td>{r.consent ? <Pill tone={r.consent === "subscribed" ? "green" : "neutral"}>{r.consent}</Pill> : <span className="text-zinc-400">—</span>}</Td>
              <Td className="whitespace-nowrap">{ago(String(r.last_at))}</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
