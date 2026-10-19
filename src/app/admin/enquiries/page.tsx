import Link from "next/link";
import { revalidatePath } from "next/cache";
import { customerHref } from "@/lib/customers-admin";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { Btn, Card, CardHead, PageHead, Select, StatusPill, ago } from "@/components/admin/ui";
import { SetupNotice } from "../_parts";

export const dynamic = "force-dynamic";
const STATUSES = ["new", "replied", "closed"];
const KINDS = ["contact", "wholesale", "product", "warranty"];

async function setStatus(formData: FormData) {
  "use server";
  const { requireAdmin } = await import("@/lib/admin"); await requireAdmin();
  const sql = (await import("@/lib/db")).db(); if (!sql) return;
  const id = Number(formData.get("id")), status = String(formData.get("status"));
  if (!STATUSES.includes(status) || !Number.isInteger(id)) return;
  await sql`update enquiries set status = ${status} where id = ${id}`;
  revalidatePath("/admin/enquiries");
}

export default async function Page({ searchParams }: { searchParams: Promise<{ kind?: string; status?: string }> }) {
  await requireAdmin();
  const { kind = "", status = "" } = await searchParams;
  const sql = db();
  if (!sql) return <SetupNotice reason="CAPRA_DATABASE_URL is not set." />;
  const rows = await sql`select id, ref, kind, name, email, phone, city, subject, message, product, page, extra, status, created_at from enquiries where (${kind}::text = '' or kind = ${kind}) and (${status}::text = '' or status = ${status}) order by created_at desc limit 200`.catch(() => null);
  if (!rows) return <SetupNotice reason="The enquiries table is missing. Apply docs/schema.sql to the database." />;

  return (
    <>
      <PageHead title="Enquiries" sub={`${rows.length} matching`} />
      <Card className="mb-4">
        <CardHead title="Filter" />
        <form className="flex flex-wrap items-end gap-2 p-5 pt-4">
          <div className="w-48"><Select name="kind" defaultValue={kind}><option value="">All types</option>{KINDS.map((t) => <option key={t}>{t}</option>)}</Select></div>
          <div className="w-40"><Select name="status" defaultValue={status}><option value="">All statuses</option>{STATUSES.map((t) => <option key={t}>{t}</option>)}</Select></div>
          <Btn type="submit">Apply</Btn>
        </form>
      </Card>
      <div className="space-y-3">
        {rows.map((r) => {
          const x = (r.extra ?? {}) as Record<string, string>;
          const wa = r.phone ? `https://wa.me/92${String(r.phone).replace(/^0/, "")}` : "";
          return (
            <Card key={String(r.id)} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-zinc-900">
                    {r.email ? <Link href={customerHref(String(r.email))} className="hover:underline">{String(r.name)}</Link> : String(r.name)} <span className="font-normal text-zinc-400">· {String(r.kind)}{r.subject ? ` · ${r.subject}` : ""}{x.company ? ` · ${x.company}` : ""}{x.quantity ? ` · ${x.quantity}` : ""}</span>
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {wa ? <a href={wa} target="_blank" className="hover:underline">{String(r.phone)} (WhatsApp)</a> : "no phone"}{r.email ? <> · <a href={`mailto:${r.email}`} className="hover:underline">{String(r.email)}</a></> : null}
                    {r.city ? ` · ${r.city}` : ""} · {ago(String(r.created_at))} · {String(r.page ?? "")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={String(r.status)} />
                  <form action={setStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={String(r.id)} />
                    <div className="w-32"><Select name="status" defaultValue={String(r.status)} className="py-1.5 text-xs">{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></div>
                    <Btn type="submit" className="px-2.5 py-1.5 text-xs">Save</Btn>
                  </form>
                </div>
              </div>
              {r.message ? <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{String(r.message)}</p> : null}
            </Card>
          );
        })}
        {!rows.length && <Card className="p-10 text-center text-sm text-zinc-500">Nothing matches those filters.</Card>}
      </div>
    </>
  );
}
