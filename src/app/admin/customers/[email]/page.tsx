import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Mail, MessageSquare, ShoppingBag, Wallet } from "lucide-react";
import { isOwner, requireAdmin } from "@/lib/admin";
import { normaliseEmail, type Address } from "@/lib/customer";
import { customerProfile } from "@/lib/customers-admin";
import { Btn, BtnLink, Card, CardHead, Field, Input, PageHead, Pill, StatCard, StatusPill, Table, Td, Tr, ago } from "@/components/admin/ui";
import { pkr } from "@/lib/utils";
import { deleteAccount, signOutCustomer, unsubscribeCustomer } from "../actions";
import { SetupNotice } from "../../_parts";

export const dynamic = "force-dynamic";

const NOTES: Record<string, [text: string, ok: boolean]> = {
  signedout: ["Signed out on every device.", true],
  unsubscribed: ["Unsubscribed from marketing. They drop out of the mailing tool at its next import.", true],
  deleted: ["Account deleted and unsubscribed. Their orders and enquiries are kept.", true],
  confirm: ["The account was not deleted: type the email address exactly to confirm.", false],
};

const when = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString("en-PK", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const oneLine = (a: Address | null | undefined) => (a ? [a.line1, a.line2, a.city, a.postcode].filter(Boolean).join(", ") : "");

function Rows({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="divide-y divide-zinc-100 text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-4 px-5 py-2.5">
          <dt className="shrink-0 text-zinc-500">{r.label}</dt>
          <dd className="text-right text-zinc-800">{r.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

type Activity = { at: string; type: "Order" | "Enquiry"; ref: string; href: string | null; detail: string; amount: number | null; status: string };

export default async function Page({ params, searchParams }: { params: Promise<{ email: string }>; searchParams: Promise<{ e?: string }> }) {
  const me = await requireAdmin();
  const [{ email: raw }, { e: noteKey }] = await Promise.all([params, searchParams]);
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* already decoded */
  }
  const parsed = z.string().max(200).email().safeParse(normaliseEmail(decoded));
  if (!parsed.success) notFound();

  const p = await customerProfile(parsed.data).catch((err) => {
    console.error("[admin customer]", err);
    return undefined;
  });
  if (p === undefined) return <SetupNotice reason="The customers or marketing_consents table is missing. Apply docs/schema.sql to the database." />;
  if (!p) notFound();

  const { email, account, consent } = p;
  const orders = p.orders;
  const spent = p.orders.filter((o) => o.status !== "cancelled").reduce((a, o) => a + Number(o.total), 0);

  // The newest record wins for contact details a customer may have changed.
  const records = [...p.orders, ...p.enquiries].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  const name = account?.name || records.find((r) => r.name)?.name || "";
  const phone = account?.phone || records.find((r) => r.phone)?.phone || "";
  const address = account?.address ?? p.orders.find((o) => o.address)?.address ?? null;
  const firstSeen = Math.min(...[account?.created_at, ...records.map((r) => r.created_at)].filter(Boolean).map((d) => +new Date(String(d))));

  const activity: Activity[] = [
    ...p.orders.map((o): Activity => ({ at: o.created_at, type: "Order", ref: o.ref, href: `/admin/orders/${o.ref}`, detail: `${o.payment_method} · ${o.payment_status}`, amount: Number(o.total), status: o.status })),
    ...p.enquiries.map((x): Activity => ({ at: x.created_at, type: "Enquiry", ref: x.ref ?? "—", href: null, detail: [x.kind, x.product, x.subject].filter(Boolean).join(" · "), amount: null, status: x.status })),
  ].sort((a, b) => +new Date(b.at) - +new Date(a.at));

  const note = noteKey ? NOTES[noteKey] : undefined;

  return (
    <>
      <PageHead title={name || email} sub={`${email} · first seen ${new Date(firstSeen).toLocaleDateString("en-PK")}`}>
        {account ? <Pill tone="green">account</Pill> : <Pill>guest</Pill>}
        <BtnLink href={`mailto:${email}`}><Mail className="h-3.5 w-3.5" /> Email</BtnLink>
        <BtnLink href="/admin/customers">All customers</BtnLink>
      </PageHead>

      {note && (
        <p className={`mb-5 rounded-lg border px-4 py-2.5 text-sm ${note[1] ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`} role="status">
          {note[0]}
        </p>
      )}

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Wallet className="h-4 w-4" />} label="Ordered" value={pkr(spent)} note="Orders not cancelled" />
        <StatCard icon={<ShoppingBag className="h-4 w-4" />} label="Orders" value={String(orders.length)} />
        <StatCard icon={<MessageSquare className="h-4 w-4" />} label="Enquiries" value={String(p.enquiries.length)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <Card>
          <CardHead title="Activity" sub="Orders and enquiries from this email address, newest first." />
          <Table head={["Date", "Type", "Ref", "Detail", "Amount", "Status"]} empty="No orders or enquiries yet.">
            {activity.map((r, i) => (
              <Tr key={`${r.type}-${r.ref}-${i}`}>
                <Td className="whitespace-nowrap">{ago(r.at)}<span className="block text-xs text-zinc-400">{new Date(r.at).toLocaleDateString("en-PK")}</span></Td>
                <Td><Pill tone={r.type === "Order" ? "blue" : "neutral"}>{r.type}</Pill></Td>
                <Td className="font-medium text-zinc-900 tnum">{r.href ? <Link href={r.href} className="hover:underline">{r.ref}</Link> : r.ref}</Td>
                <Td className="text-zinc-500">{r.detail || "—"}</Td>
                <Td className="tnum">{r.amount == null ? "—" : pkr(r.amount)}</Td>
                <Td><StatusPill value={r.status} /></Td>
              </Tr>
            ))}
          </Table>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHead title="Contact" sub="The latest details this customer gave us." />
            <Rows
              rows={[
                { label: "Name", value: name },
                { label: "Phone", value: phone },
                { label: "Delivery address", value: oneLine(address) },
              ]}
            />
          </Card>

          <Card className="p-5 text-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Marketing</h2>
            {consent ? (
              <>
                <div className="mt-2 flex items-center gap-2">
                  <Pill tone={consent.status === "subscribed" ? "green" : "neutral"}>{consent.status}</Pill>
                  <span className="text-xs text-zinc-500">via {consent.source}</span>
                </div>
                <p className="mt-2 text-xs text-zinc-500">{consent.status === "subscribed" ? `Opted in ${when(consent.subscribed_at)}` : `Unsubscribed ${when(consent.unsubscribed_at)}`}</p>
                {consent.status === "subscribed" && consent.consent_text && <p className="mt-2 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600">&ldquo;{consent.consent_text}&rdquo;</p>}
              </>
            ) : (
              <p className="mt-2 text-zinc-500">Never opted in. Do not send them marketing email.</p>
            )}
            {consent?.status === "subscribed" && (
              <form action={unsubscribeCustomer} className="mt-4">
                <input type="hidden" name="email" value={email} />
                <Btn variant="ghost" type="submit" className="w-full">Unsubscribe</Btn>
              </form>
            )}
            <p className="mt-3 text-xs text-zinc-400">Staff can unsubscribe someone but never subscribe them: consent has to come from the customer.</p>
          </Card>

          <Card className="p-5 text-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Account</h2>
            {account ? (
              <>
                <p className="mt-2 text-zinc-600">Created {when(account.created_at)}</p>
                <p className="mt-1 text-xs text-zinc-500">Last signed in {when(account.last_login_at)}</p>
                <form action={signOutCustomer} className="mt-4">
                  <input type="hidden" name="email" value={email} />
                  <Btn variant="ghost" type="submit" className="w-full">Sign out on every device</Btn>
                </form>
                {isOwner(me) && (
                  <form action={deleteAccount} className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
                    <input type="hidden" name="email" value={email} />
                    <Field label="Delete account" hint="Removes their saved details and sign-in, and unsubscribes them. Orders and enquiries are kept. They can sign in again later with this email.">
                      <Input name="confirm" placeholder={`Type ${email} to confirm`} autoComplete="off" />
                    </Field>
                    <Btn variant="danger" type="submit" className="w-full">Delete account</Btn>
                  </form>
                )}
              </>
            ) : (
              <p className="mt-2 text-zinc-500">No account. They can make one at any time by signing in with this email.</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
