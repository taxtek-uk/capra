import { pageMeta, JsonLd, faqLd } from "@/lib/seo";
import { Hero } from "@/components/site/Hero";
import { FaqSection, FeatureGrid } from "@/components/site/sections";
import { Container, Section, Eyebrow, Heading, ButtonLink, Arrow } from "@/components/ui/primitives";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BRAND, COMMERCIAL, TRADE } from "@/lib/brand";

export const metadata = pageMeta({
  title: "Wholesale Thermos & Vacuum Flasks – Distributors",
  description: "Buy CAPRA vacuum jugs and insulated bottles wholesale from the Gujranwala factory: carton packing, mixed colours and delivery to shops across Pakistan.",
  path: "/wholesale",
});

const FAQ = [
  { q: "How are bottles packed?", a: `MS sports bottles and BM bullet flasks are packed ${COMMERCIAL.cartonPieces} pieces to a carton, four colours mixed in each carton.` },
  { q: "Do you supply shops outside Punjab?", a: "Yes. We dispatch cartons to shops and distributors across Pakistan by cargo and courier." },
  { q: "Can you supply corporate and wedding gifts?", a: "Yes. Boxed vacuum pots and jugs make practical gifts; tell us the quantity and the date and we will confirm stock and delivery." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <Hero compact image={{ src: "/images/banners/range-wide.webp", alt: "The CAPRA range of vacuum jugs with their gift boxes" }} eyebrow="Distributors, shops and gifting"
        breadcrumbs={[{ name: "Wholesale", path: "/wholesale" }]}
        title={<>Wholesale, <em className="text-gradient-brass italic">direct from the factory.</em></>}
        lede={`${BRAND.legalName} has made ${BRAND.name} in ${BRAND.address.city} since ${BRAND.founded}. Stock your shop, supply your office or order gifts by the carton.`}
        actions={<><ButtonLink href="#enquiry" variant="brass">Send a wholesale enquiry <Arrow /></ButtonLink><ButtonLink href={TRADE.whatsappLink} variant="ghostLight">WhatsApp {TRADE.whatsapp}</ButtonLink><ButtonLink href="/dealers" variant="ghostLight">Dealer catalogue & terms</ButtonLink></>} />
      <FeatureGrid eyebrow="Why stock CAPRA" title="A range that sells itself on the shelf." items={[
        { title: "Seven designs, 17 models", body: "Vacuum jugs from 1 to 3 litres and bottles from 600 ml to 1 litre cover every price point a customer asks for." },
        { title: "Printed gift boxes", body: "Boxed jugs and pots display well and sell as gifts through Eid, weddings and winter." },
        { title: "Mixed-colour cartons", body: `Bottles come ${COMMERCIAL.cartonPieces} to a carton in four colours, so one carton fills a shelf.` },
        { title: "Made in Pakistan", body: "Made in our own factory, so restocking does not wait on imports." },
        { title: "One price list", body: "The retail prices on this site are our factory list. Ask us for carton terms." },
        { title: "Warranty backed", body: `Every piece carries our ${COMMERCIAL.warrantyMonths}-month warranty against manufacturing faults.` },
      ]} />
      <Section id="enquiry" tone="bone" className="scroll-mt-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div><Eyebrow>Wholesale enquiry</Eyebrow><Heading>Tell us what you need.</Heading><p className="mt-5 text-stone-600">Models, sizes and quantities, and your city. We reply within one working day, usually on WhatsApp.</p></div>
          <EnquiryForm kind="wholesale" subjects={["Shop or distributor stock", "Corporate gifts", "Wedding or event gifts", "Something else"]} />
        </Container>
      </Section>
      <FaqSection items={FAQ} title="Wholesale questions." />
    </>
  );
}
