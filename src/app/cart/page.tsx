import { pageMeta } from "@/lib/seo";
import { Container, Section, Eyebrow, Heading } from "@/components/ui/primitives";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Basket } from "@/components/shop/Basket";

/** A basket is personal: rendered on demand and kept out of the index. */
export const dynamic = "force-dynamic";
export const metadata = pageMeta({ title: "Your Basket", description: "The CAPRA flasks and bottles you have chosen, priced with delivery before checkout.", path: "/cart", noIndex: true });

export default function Page() {
  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }, { name: "Basket", path: "/cart" }]} />
        <div className="mt-6 max-w-2xl"><Eyebrow>Basket</Eyebrow><Heading as="h1">Your basket.</Heading></div>
        <div className="mt-10"><Basket /></div>
      </Container>
    </Section>
  );
}
