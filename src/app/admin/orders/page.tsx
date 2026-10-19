import Link from "next/link";
import { Search } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { ORDER_STATUSES, PAYMENT_LABEL, PAYMENT_STATUSES, type PaymentMethod } from "@/lib/orders";
import { Btn, Card, CardHead, Input, PageHead, Pill, Select, StatusPill, Table, Td, Tr, ago } from "@/components/admin/ui";
import { pkr, normalisePhone } from "@/lib/utils";
import { SetupNotice } from "../_parts";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ status?: string; payment?: string; q?: string }> }) {
  await requireAdmin();
  const { status = "", payment = "", q = "" } = await searchParams;
  const sql = db();
  if (!sql) return <SetupNotice reason="CAPRA_DATABASE_URL is not set." />;
  const like = `%${q}%`;
  const phone = q.replace(/\D/g, "").length >= 4 ? `%${normalisePhone(q).replace(/^0/, "")}%` : "";
  const rows = await sql`
    select ref, status, payment_method, payment_status, tracking, total::float as total,
           contact->>'name' as name, contact->>'phone' as phone, contact->>'email' as email, address->>'city' as city,
           jsonb_array_length(lines) as line_count, created_at
    from orders
    where (${status}::text = '' or status = ${status})
      and (${payment}::text = '' or payment_status = ${payment})
      and (${q}::text = '' or contact->>'name' ilike ${like} or contact->>'email' ilike ${like} or ref ilike ${like} or address->>'city' ilike ${like}
           or (${phone}::text <> '' and contact->>'phone' like ${phone}))
    order by created_at desc limit 200`.catch(() => null);
  if (!rows) return <SetupNotice reason="The orders table is missing. Apply docs/schema.sql to the database." />;
  const live = rows.filter((r) => r.status !== "cancelled").reduce((a, r) => a + Number(r.total), 0);

  return (
    <>
      <PageHead title="Orders" sub={`${rows.length} matching · ${pkr(live)} not cancelled`} />
      <Card>
        <CardHead title="Filter" sub="Search by name, phone, email, city or order reference" />
        <form className="flex flex-wrap items-end gap-2 p-5 pt-4">
          <div className="relative min-w-[16rem] flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" /><Input name="q" defaultValue={q} placeholder="Name, 0300…, city, CAP-…" className="pl-9" /></div>
          <div className="w-40"><Select name="status" defaultValue={status}><option value="">All statuses</option>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></div>
          <div className="w-40"><Select name="payment" defaultValue={payment}><option value="">Any payment</option>{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></div>
          <Btn type="submit">Apply</Btn>
        </form>
        <Table head={["Ref", "Placed", "Customer", "City", "Items", "Total", "Payment", "Status", "Tracking"]} empty="No orders match those filters.">
          {rows.map((r) => (
            <Tr key={String(r.ref)}>
              <Td className="font-medium text-zinc-900 tnum"><Link href={`/admin/orders/${r.ref}`} className="hover:underline">{String(r.ref)}</Link></Td>
              <Td className="whitespace-nowrap">{ago(String(r.created_at))}<span className="block text-xs text-zinc-400">{new Date(String(r.created_at)).toLocaleDateString("en-PK")}</span></Td>
              <Td>{String(r.name ?? "—")}<span className="block text-xs text-zinc-400">{String(r.phone ?? "")}</span></Td>
              <Td className="text-zinc-500">{String(r.city ?? "")}</Td>
              <Td className="text-zinc-500 tnum">{Number(r.line_count)}</Td>
              <Td className="font-medium tnum">{pkr(Number(r.total))}</Td>
              <Td><StatusPill value={String(r.payment_status)} /><span className="mt-1 block text-xs text-zinc-400">{PAYMENT_LABEL[r.payment_method as PaymentMethod] ?? String(r.payment_method)}</span></Td>
              <Td><StatusPill value={String(r.status)} /></Td>
              <Td className="text-xs text-zinc-500">{r.tracking ? String(r.tracking) : <Pill>none</Pill>}</Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
