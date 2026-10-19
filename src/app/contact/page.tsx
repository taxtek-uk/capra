import { pageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container, Section, Eyebrow, Heading, Lede } from "@/components/ui/primitives";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BRAND, CONTACT } from "@/lib/brand";

export const metadata = pageMeta({
  title: "Contact CAPRA – WhatsApp, Phone & Email",
  description: "Contact CAPRA in Gujranwala by WhatsApp, phone or email about an order, a product, a warranty claim or wholesale. We reply within one working day.",
  path: "/contact",
});

export default function Page() {
  const rows: [string, React.ReactNode][] = [
    ["WhatsApp", <a key="w" href={CONTACT.whatsappLink} target="_blank" rel="noopener" className="hover:underline">{CONTACT.whatsapp}</a>],
    ["Phone", <a key="p" href={CONTACT.phoneTel} className="hover:underline">{CONTACT.phone}</a>],
    ["Email", <a key="e" href={`mailto:${CONTACT.email}`} className="hover:underline">{CONTACT.email}</a>],
    ["Hours", BRAND.hours.display],
    ["Factory", <address key="a" className="not-italic">{BRAND.address.full}</address>],
  ];
  return (
    <Section className="pt-32 sm:pt-40">
      <Container>
        <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
        <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <Heading as="h1">We are on WhatsApp.</Heading>
            <Lede>The quickest way to reach us about an order, a size or a colour. Or call, email or use the form.</Lede>
            <dl className="mt-10 divide-y divide-ink-950/10 border-y border-ink-950/10 text-sm">
              {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-4"><dt className="text-stone-600">{k}</dt><dd className="text-right">{v}</dd></div>)}
            </dl>
          </div>
          <div className="rounded-3xl border border-ink-950/10 bg-bone-100 p-6 sm:p-8">
            <h2 className="mb-6 font-display text-2xl">Send a message</h2>
            <EnquiryForm subjects={["An order", "A product question", "A warranty claim", "Wholesale", "Something else"]} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
