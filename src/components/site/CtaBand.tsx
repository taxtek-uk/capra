import { Container, ButtonLink, Arrow, Heading } from "@/components/ui/primitives";
import { CONTACT } from "@/lib/brand";

export function CtaBand({ title = "Order today, pay when it arrives.", body = "Cash on delivery to every city in Pakistan. We call to confirm before we send, and every flask carries a 2-year warranty.", href = "/shop", cta = "Shop the range" }: { title?: string; body?: string; href?: string; cta?: string }) {
  return (
    <section className="grain relative overflow-hidden bg-ink-950 py-24 text-bone-50">
      <div className="bloom-brass absolute -right-40 top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 opacity-70" aria-hidden />
      <Container className="relative z-10 grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <Heading className="text-bone-50">{title}</Heading>
          <p className="mt-5 max-w-xl text-bone-100/70">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <ButtonLink href={href} variant="brass">{cta} <Arrow /></ButtonLink>
          <ButtonLink href={CONTACT.whatsappLink} variant="ghostLight">WhatsApp {CONTACT.whatsapp}</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
