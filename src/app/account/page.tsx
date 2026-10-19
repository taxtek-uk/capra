import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { Container, Section, Eyebrow, Heading, Lede, Badge, Button, ButtonLink, Arrow } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { customerOrders, requireCustomer, type CustomerOrder } from "@/lib/customer";
import { orderPath } from "@/lib/orders";
import { pkr } from "@/lib/utils";
import { signOut } from "./actions";

/** Personal and never the same twice: rendered on demand and kept out of the index. */
export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Your Account", description: "Your orders with CAPRA in one place: status, totals and delivery tracking, plus the details saved for checkout.", path: "/account", noIndex: true });

/** The customer's words for an order's state, most decisive fact first. */
function statusOf(o: CustomerOrder): { label: string; tone: "clay" | "brass" | "ink" } {
  if (o.status === "cancelled") return { label: "Cancelled", tone: "clay" };
  if (o.payment_status === "refunded") return { label: "Refunded", tone: "clay" };
  if (o.payment_status === "unpaid") return { label: "Awaiting payment", tone: "clay" };
  if (o.status === "shipped") return { label: "On its way", tone: "ink" };
  if (o.status === "complete") return { label: "Delivered", tone: "brass" };
  return { label: "Being prepared", tone: "brass" };
}

export default async function Page() {
  const me = await requireCustomer("/account");
  const orders = await customerOrders(me.email);

  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Account", path: "/account" }]} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>Your account</Eyebrow>
            <Heading as="h1">{me.name ? `Hello, ${me.name.split(" ")[0]}.` : "Your orders."}</Heading>
            <Lede>Signed in as {me.email}.</Lede>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="/account/details" variant="ghost">Your details</ButtonLink>
            <form action={signOut}><Button type="submit" variant="ghost">Sign out</Button></form>
          </div>
        </div>

        <h2 className="mt-14 font-display text-2xl">Orders</h2>
        {orders.length ? (
          <ul className="mt-4 divide-y divide-ink-950/10 border-y border-ink-950/10">
            {orders.map((o) => {
              const s = statusOf(o);
              return (
                <li key={o.ref}>
                  <Link href={orderPath(o.ref)} className="flex flex-wrap items-center justify-between gap-3 py-4 transition hover:bg-bone-100/60">
                    <span className="min-w-0">
                      <span className="block font-medium tnum">{o.ref}</span>
                      <span className="block text-xs text-stone-600">
                        {new Date(o.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })} · {o.items} item{o.items === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="flex items-center gap-4">
                      <Badge tone={s.tone}>{s.label}</Badge>
                      <span className="tnum">{pkr(o.total)}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-4 rounded-2xl border border-ink-950/10 p-10 text-center">
            <p className="font-display text-2xl">No orders yet.</p>
            <p className="mt-2 text-sm text-stone-600">Anything you order with {me.email} will appear here.</p>
            <ButtonLink href="/shop" className="mt-6">Browse the shop <Arrow /></ButtonLink>
          </div>
        )}
      </Container>
    </Section>
  );
}
