import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import { Container, Section, Eyebrow, Heading, Lede, Badge, ButtonLink, Arrow } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BuyAgain, PrintReceipt } from "@/components/shop/OrderActions";
import { currentAdmin } from "@/lib/admin";
import { accountsEnabled, currentCustomer, normaliseEmail } from "@/lib/customer";
import { getOrder, oneLineAddress, PAYMENT_LABEL, verifyOrderToken, type OrderRow } from "@/lib/orders";
import { paymentInstructions } from "@/lib/emails/order";
import { pkr } from "@/lib/utils";
import { BRAND, CONTACT, COMMERCIAL, whatsappWith } from "@/lib/brand";

/** One customer's order: never cached, never indexed, opened by the signed link. */
export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Your Order", description: "The status of your CAPRA order: items, delivery address, payment and courier tracking.", path: "/order", noIndex: true });

const STATUS_COPY: Record<string, string> = {
  new: "We have your order and will call or WhatsApp you shortly to confirm it.",
  confirmed: "Confirmed, and being packed at our Gujranwala factory.",
  shipped: "On its way to you with the courier.",
  delivered: "Delivered. Thank you for choosing CAPRA.",
  cancelled: "This order was cancelled.",
};

const longDate = (d: string) => new Date(d).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });

/** Shown without access: nothing about the order, not even whether it exists. */
function Locked({ orderRef, signedInAs, accounts }: { orderRef: string; signedInAs: string | null; accounts: boolean }) {
  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: "Order", path: `/order/${orderRef}` }]} />
        <div className="mt-6 max-w-2xl">
          <Eyebrow>Your order</Eyebrow>
          <Heading as="h1">Open the link from your order message.</Heading>
          <Lede>For your privacy, an order and its address are shown only through the link we sent you{accounts ? ", or once you sign in with the email you ordered with" : ""}.</Lede>
          {signedInAs && <p className="mt-6 text-sm text-stone-600">You are signed in as {signedInAs}, which is not the email this order was placed with.</p>}
          <p className="mt-6 text-sm text-stone-600">Lost it? WhatsApp <a href={whatsappWith(`Please resend the link for order ${orderRef}.`)} className="underline underline-offset-4">{CONTACT.whatsapp}</a> with your order number.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {accounts && !signedInAs && <ButtonLink href={`/account/sign-in?next=${encodeURIComponent(`/order/${orderRef}`)}`}>Sign in to see it <Arrow /></ButtonLink>}
            <ButtonLink href="/shop" variant="ghost">Back to the shop <Arrow /></ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** The printed copy: supplier, customer, lines and the stored totals, never recalculated. */
function Receipt({ order }: { order: OrderRow }) {
  const t = order.totals;
  return (
    <div className="text-xs leading-relaxed text-black">
      <div className="flex justify-between gap-8 border-b border-black/20 pb-5">
        <div><p className="text-base font-semibold">{BRAND.name} · {BRAND.legalName}</p><p>{BRAND.address.full}</p><p>{CONTACT.phone} · {CONTACT.email}</p></div>
        <div className="text-right"><p className="text-base font-semibold">Order receipt</p><p>Order {order.ref}</p><p>Ordered {longDate(order.created_at)}</p><p>{PAYMENT_LABEL[order.payment_method]} · {order.payment_status}</p></div>
      </div>
      <div className="mt-5"><p className="font-semibold">Deliver to</p><p>{order.contact.name} · {order.contact.phone}</p><p>{oneLineAddress(order.address)}</p></div>
      <table className="mt-6 w-full border-collapse">
        <thead><tr className="border-b border-black/40 text-left"><th className="py-2 pr-3">Item</th><th className="py-2 pr-3 text-right">Qty</th><th className="py-2 pr-3 text-right">Unit</th><th className="py-2 text-right">Amount</th></tr></thead>
        <tbody>{order.lines.map((l, i) => <tr key={i} className="border-b border-black/10"><td className="py-2 pr-3">{l.name}<span className="block">{l.variantLabel} · {l.sku}</span></td><td className="py-2 pr-3 text-right">{l.qty}</td><td className="py-2 pr-3 text-right">{pkr(l.unit)}</td><td className="py-2 text-right">{pkr(l.amount)}</td></tr>)}</tbody>
      </table>
      <dl className="ml-auto mt-4 w-64">
        <div className="flex justify-between py-1"><dt>Subtotal</dt><dd>{pkr(t.subtotal)}</dd></div>
        <div className="flex justify-between py-1"><dt>Delivery</dt><dd>{t.delivery ? pkr(t.delivery) : "Free"}</dd></div>
        <div className="mt-1 flex justify-between border-t border-black/40 pt-2 text-sm font-semibold"><dt>Total</dt><dd>{pkr(t.total)}</dd></div>
      </dl>
      <p className="mt-8 border-t border-black/20 pt-4">Every {BRAND.name} product carries a {COMMERCIAL.warrantyMonths}-month warranty against manufacturing faults.</p>
    </div>
  );
}

export default async function Page({ params, searchParams }: { params: Promise<{ ref: string }>; searchParams: Promise<{ k?: string; placed?: string }> }) {
  const [{ ref }, { k, placed }] = await Promise.all([params, searchParams]);
  const accounts = accountsEnabled();
  const tokenOk = verifyOrderToken(ref, k);
  const [admin, me] = await Promise.all([tokenOk ? null : currentAdmin(), currentCustomer()]);
  const locked = <Locked orderRef={ref} signedInAs={me?.email ?? null} accounts={accounts} />;
  if (!tokenOk && !admin && !me) return locked;
  const order = await getOrder(ref);
  const mine = Boolean(me && order && order.contact.email && normaliseEmail(order.contact.email) === me.email);
  if (!tokenOk && !admin && !mine) return locked;
  if (!order) notFound();

  const t = order.totals;
  const link = `${BRAND.domain}/order/${order.ref}?k=${k ?? ""}`;
  const confirmText = `Assalam-o-Alaikum, I just placed order ${order.ref} (${pkr(t.total)}, ${PAYMENT_LABEL[order.payment_method]}). ${tokenOk ? link : ""}`.trim();

  return (
    <Section className="pt-32 sm:pt-40 print:py-0">
      <Container className="print:hidden">
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: "Order", path: `/order/${order.ref}` }]} />
        <div className="mt-6 max-w-2xl">
          <Eyebrow>Order {order.ref}</Eyebrow>
          <Heading as="h1">Shukriya, {order.contact.name.split(" ")[0]}.</Heading>
          <Lede>{STATUS_COPY[order.status] ?? "We have your order."}</Lede>
        </div>

        {placed && order.status === "new" && (
          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-whatsapp/30 bg-whatsapp/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-stone-700"><span className="font-medium text-ink-950">Want it confirmed faster?</span> Send us your order on WhatsApp and keep this page&rsquo;s link with you.</p>
            <a href={whatsappWith(confirmText)} target="_blank" rel="noopener" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-whatsapp px-5 text-sm font-medium text-white">Confirm on WhatsApp</a>
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={order.payment_status === "paid" ? "brass" : "clay"}>{order.payment_status === "paid" ? "Paid" : order.payment_method === "cod" ? "Pay on delivery" : "Awaiting payment"}</Badge>
              <Badge>{order.status}</Badge>
              {order.tracking && <Badge tone="ink">Tracking {order.tracking}</Badge>}
            </div>
            <ul className="mt-6 divide-y divide-ink-950/10 border-y border-ink-950/10">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-4">
                  <div className="min-w-0"><p className="font-medium">{l.qty} × {l.name}</p><p className="mt-0.5 text-xs text-stone-600">{l.variantLabel} · {l.sku}</p></div>
                  <p className="shrink-0 tnum">{pkr(l.amount)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 max-w-sm text-sm">
              <div className="flex justify-between gap-4 py-1.5"><dt className="text-stone-600">Subtotal</dt><dd className="tnum">{pkr(t.subtotal)}</dd></div>
              <div className="flex justify-between gap-4 py-1.5"><dt className="text-stone-600">Delivery</dt><dd className="tnum">{t.delivery ? pkr(t.delivery) : "Free"}</dd></div>
              <div className="mt-1 flex justify-between gap-4 border-t border-ink-950/10 pt-3 text-base font-medium"><dt>Total</dt><dd className="tnum">{pkr(t.total)}</dd></div>
            </dl>
            {order.payment_status !== "paid" && order.status !== "cancelled" && (
              <div className="mt-8 rounded-2xl border border-brass-500/40 bg-brass-500/5 p-5 text-sm text-stone-700"><p className="font-medium text-ink-950">{PAYMENT_LABEL[order.payment_method]}</p><p className="mt-1">{paymentInstructions(order.payment_method, order.ref, Number(t.total))}</p></div>
            )}
          </div>

          <aside className="rounded-2xl border border-ink-950/10 bg-bone-100 p-6 text-sm">
            <h2 className="font-display text-xl">Delivery</h2>
            <address className="mt-3 not-italic text-stone-600">{order.contact.name} · {order.contact.phone}<br />{oneLineAddress(order.address)}</address>
            {order.contact.notes && <p className="mt-3 text-xs text-stone-600">Your notes: {order.contact.notes}</p>}
            <p className="mt-5 text-xs text-stone-600">Ordered {longDate(order.created_at)} · {COMMERCIAL.warrantyMonths}-month warranty.</p>
            <p className="mt-4 text-xs text-stone-600">Something not right? WhatsApp <a href={whatsappWith(`About order ${order.ref}: `)} className="underline underline-offset-4">{CONTACT.whatsapp}</a> quoting {order.ref}.</p>
            {accounts && !me && order.contact.email && <p className="mt-4 text-xs text-stone-600"><Link href="/account/sign-in" className="underline underline-offset-4">Sign in</Link> with {order.contact.email} to see all your orders.</p>}
            <div className="mt-6 grid gap-2">
              <BuyAgain orderRef={order.ref} lines={order.lines.map(({ id, qty, variant }) => ({ id, qty, variant }))} />
              <PrintReceipt />
            </div>
          </aside>
        </div>
      </Container>
      <Container className="hidden print:block"><Receipt order={order} /></Container>
    </Section>
  );
}
