import { pageMeta } from "@/lib/seo";
import { Container, Section, Eyebrow, Heading } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Checkout } from "@/components/shop/Checkout";
import { accountsEnabled, currentCustomer, savedDetails } from "@/lib/customer";

export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Checkout", description: "Complete your CAPRA order: delivery address, then cash on delivery, bank transfer, JazzCash or Easypaisa.", path: "/checkout", noIndex: true });

export default async function Page() {
  const me = await currentCustomer();
  const saved = me ? await savedDetails(me) : null;
  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: "Basket", path: "/cart" }, { name: "Checkout", path: "/checkout" }]} />
        <div className="mt-6 max-w-2xl"><Eyebrow>Checkout</Eyebrow><Heading as="h1">Where should we send it?</Heading></div>
        <div className="mt-10"><Checkout accounts={accountsEnabled()} saved={saved} /></div>
      </Container>
    </Section>
  );
}
