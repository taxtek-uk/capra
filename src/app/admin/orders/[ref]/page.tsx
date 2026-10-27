import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { getOrder, oneLineAddress, orderPath, ORDER_STATUSES, PAYMENT_LABEL, PAYMENT_STATUSES } from "@/lib/orders";
import { customerHref } from "@/lib/customers-admin";
import { Btn, BtnLink, Card, CardHead, Field, Input, PageHead, Select, StatusPill, Table, Td, Textarea, Tr } from "@/components/admin/ui";
import { pkr } from "@/lib/utils";
import { BRAND, COMMERCIAL } from "@/lib/brand";
import { updateOrder } from "../actions";

export const dynamic = "force-dynamic";

function Rows({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="divide-y divide-zinc-100 text-sm">
      {rows.map((r) => <div key={r.label} className="flex justify-between gap-4 px-5 py-2.5"><dt className="shrink-0 text-zinc-500">{r.label}</dt><dd className="text-right text-zinc-800">{r.value || "—"}</dd></div>)}
    </dl>
  );
}

export default async function Page({ params }: { params: Promise<{ ref: string }> }) {
  await requireAdmin();
  const { ref } = await params;
  const o = await getOrder(ref);
  if (!o) notFound();
  const t = o.totals;
  const wa = `https://wa.me/92${o.contact.phone.replace(/^0/, "")}?text=${encodeURIComponent(`Assalam-o-Alaikum ${o.contact.name.split(" ")[0]}, this is ${BRAND.name}. Confirming your order ${o.ref} for ${pkr(Number(t.total))} to ${o.address.city}. Your order page: ${BRAND.domain}${orderPath(o.ref)}`)}`;

  return (
    <>
      <PageHead title={o.ref} sub={`${o.lines.length} line(s) · ${new Date(o.created_at).toLocaleString("en-PK")}`}>
        <StatusPill value={o.payment_status} />
        <StatusPill value={o.status} />
        <BtnLink href={wa} target="_blank">WhatsApp customer <ExternalLink className="h-3.5 w-3.5" /></BtnLink>
        <BtnLink href={orderPath(o.ref)} target="_blank">Customer view <ExternalLink className="h-3.5 w-3.5" /></BtnLink>
        {o.contact.email && <BtnLink href={customerHref(o.contact.email)}>Customer</BtnLink>}
        <BtnLink href="/admin/orders">All orders</BtnLink>
      </PageHead>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Card>
            <CardHead title="Items" sub="Priced from the price list when the order was placed. This record is never recalculated." />
            <Table head={["Product", "Model", "Qty", "Unit", "Amount"]}>
              {o.lines.map((l, i) => (
                <Tr key={i}>
                  <Td className="font-medium text-zinc-900">{l.name}<span className="block text-xs font-normal text-zinc-500">{l.variantLabel}</span></Td>
                  <Td className="text-zinc-500">{l.sku}</Td>
                  <Td className="tnum">{l.qty}</Td>
                  <Td className="tnum">{pkr(Number(l.unit))}</Td>
                  <Td className="font-medium tnum">{pkr(Number(l.amount))}</Td>
                </Tr>
              ))}
            </Table>
            <Rows rows={[{ label: "Subtotal", value: pkr(Number(t.subtotal)) }, { label: "Delivery", value: Number(t.delivery) ? pkr(Number(t.delivery)) : COMMERCIAL.deliveryShort }, { label: "Total", value: pkr(Number(t.total)) }]} />
          </Card>
          <Card>
            <CardHead title="Customer" />
            <Rows rows={[{ label: "Name", value: o.contact.name }, { label: "Phone", value: o.contact.phone }, { label: "Email", value: o.contact.email }, { label: "Delivery address", value: oneLineAddress(o.address) }, { label: "Customer notes", value: o.contact.notes }]} />
          </Card>
          <Card>
            <CardHead title="Attribution" />
            <Rows rows={[{ label: "Ordered from", value: o.page ?? "" }, { label: "Landing page", value: o.meta?.landingPath ?? "" }, { label: "Referral code", value: o.meta?.ref ?? "" }, { label: "UTM", value: [o.meta?.utmSource, o.meta?.utmCampaign].filter(Boolean).join(" · ") }, { label: "IP", value: o.ip ?? "" }]} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Fulfilment</h2>
            <form action={updateOrder} className="mt-4 space-y-3">
              <input type="hidden" name="ref" value={o.ref} />
              <Field label="Order status" hint="Confirm after the call. Cancelling puts the stock back."><Select name="status" defaultValue={o.status}>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></Field>
              <Field label="Payment status" hint={o.payment_method === "cod" ? "Mark paid when the courier settles the cash." : "Mark paid when the transfer lands."}><Select name="paymentStatus" defaultValue={o.payment_status}>{PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></Field>
              <Field label="Payment reference" hint="Transfer ID or courier settlement reference."><Input name="paymentRef" defaultValue={o.payment_ref ?? ""} /></Field>
              <Field label="Courier and tracking number" hint="Shown to the customer on their order page."><Input name="tracking" defaultValue={o.tracking ?? ""} placeholder="e.g. TCS 1234567890" /></Field>
              <Field label="Internal note" hint="Never shown to the customer."><Textarea name="adminNote" rows={4} defaultValue={o.admin_note ?? ""} /></Field>
              <label className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3 text-sm"><input type="checkbox" name="notify" className="h-4 w-4 rounded border-zinc-300" /><span>Email the customer a dispatch note{o.contact.email ? "" : " (no email on this order)"}</span></label>
              <Btn type="submit" className="w-full">Save</Btn>
            </form>
          </Card>
          <Card className="p-5 text-sm">
            <h2 className="text-sm font-semibold text-zinc-900">Payment</h2>
            <p className="mt-2 text-zinc-600">{PAYMENT_LABEL[o.payment_method]}</p>
            <p className="mt-1 text-xs text-zinc-500">{o.paid_at ? `Paid ${new Date(o.paid_at).toLocaleString("en-PK")}` : "Not paid yet"}{o.payment_ref ? ` · ${o.payment_ref}` : ""}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
