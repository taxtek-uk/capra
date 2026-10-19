import { pageMeta, JsonLd, faqLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container, Section, Eyebrow, Heading, Lede, Faq, ButtonLink } from "@/components/ui/primitives";
import { ORDER_FAQ, AFTERCARE_FAQ } from "@/content/faqs";
import { CONTACT } from "@/lib/brand";

export const metadata = pageMeta({
  title: "Help & FAQs – Orders, Delivery, Returns",
  description: "Answers about ordering CAPRA flasks online: cash on delivery, delivery charges and times, returns, warranty and caring for a stainless steel vacuum flask.",
  path: "/help",
});

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd([...ORDER_FAQ, ...AFTERCARE_FAQ])} />
      <Section className="pt-32 sm:pt-40">
        <Container>
          <Breadcrumbs items={[{ name: "Help", path: "/help" }]} />
          <div className="mt-6 max-w-3xl"><Eyebrow>Help centre</Eyebrow><Heading as="h1">How can we help?</Heading><Lede>Quick answers about ordering, delivery and looking after your flask. Still stuck? We are on WhatsApp.</Lede></div>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.6fr]">
            <h2 className="font-display text-3xl">Ordering and delivery</h2><Faq items={[...ORDER_FAQ]} />
            <h2 className="font-display text-3xl">Returns and warranty</h2><Faq items={[...AFTERCARE_FAQ]} />
          </div>
          <div className="mt-14 flex flex-wrap gap-3"><ButtonLink href={CONTACT.whatsappLink}>WhatsApp {CONTACT.whatsapp}</ButtonLink><ButtonLink href="/contact" variant="ghost">Contact us</ButtonLink></div>
        </Container>
      </Section>
    </>
  );
}
