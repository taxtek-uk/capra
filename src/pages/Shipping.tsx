// src/pages/Shipping.tsx
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FadeIn, SlideIn } from "@/components/Motion";
import { Globe, Truck, Package, Clock, MapPin } from "lucide-react";

export const Shipping = () => {
  return (
    <div className="pt-16 md:pt-26">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Shipping Information</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Delivery options, timeframes, and tracking details for your region.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* OPTIONS */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Truck, title: "Standard", desc: "Reliable delivery with tracking. Estimated timeframe shown at checkout." },
            { icon: Clock, title: "Express", desc: "Faster delivery where available. Rates calculated at checkout." },
            { icon: Globe, title: "International", desc: "Duties/taxes may apply. Delivery windows vary by destination." },
          ].map((card, i) => (
            <SlideIn key={card.title} direction="up" delay={i * 0.05}>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <card.icon className="w-8 h-8 text-brand-primary mb-3" />
                <h3 className="font-bold text-brand-secondary mb-2">{card.title}</h3>
                <p className="text-brand-muted">{card.desc}</p>
              </div>
            </SlideIn>
          ))}
        </div>
      </Section>

      {/* TRACKING */}
      <Section className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">Tracking & Dispatch</h2>
        <ul className="list-disc pl-5 space-y-2 text-brand-muted">
            <li>Dispatch notifications include your carrier and tracking number.</li>
            <li>Multiple items may ship separately with individual tracking IDs.</li>
            <li>Address changes after dispatch are managed directly with the carrier.</li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-white border border-gray-100 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-brand-primary mt-1" />
            <p className="text-sm text-brand-muted">
              Ensure your shipping address and contact number are accurate to avoid delays.
            </p>
          </div>
        </div>
      </Section>

      {/* PACKAGING */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-secondary mb-4">Packaging</h2>
          <p className="text-brand-muted">
            Products are packed with protective inserts and sealed cartons to reduce transit damage. If your parcel
            appears damaged on arrival, document the condition and contact support.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-brand-muted">
            <Package className="w-5 h-5 text-brand-primary" />
            Keep all packaging until your claim or exchange is resolved.
          </div>
        </div>
      </Section>
    </div>
  );
};
