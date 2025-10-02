// src/pages/Returns.tsx
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FadeIn, SlideIn } from "@/components/Motion";
import { siteConfig } from "@/data/site";
import { Undo2, Package, Shield, CreditCard, Truck, Info } from "lucide-react";

export const Returns = () => {
  return (
    <div className="pt-16 md:pt-26">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Returns</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              If you’re not fully satisfied, you may return eligible items within the stated return window.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* POLICY HIGHLIGHTS */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Shield, title: "Eligibility", desc: "Unused items in original packaging with all accessories." },
            { icon: Package, title: "Condition", desc: "No signs of wear, damage, or odor; include inserts & manuals." },
            { icon: CreditCard, title: "Refunds", desc: "Processed to original payment method after inspection." },
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

      {/* HOW TO RETURN */}
      <Section className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">How to Make a Return</h2>
          <ol className="list-decimal pl-5 space-y-3 text-brand-muted">
            <li>Contact support with your order ID to request a Return Authorization (RA).</li>
            <li>Package your item securely. Include all original components.</li>
            <li>Ship using the instructions provided with your RA.</li>
          </ol>
          <div className="mt-6 p-4 rounded-xl bg-white border border-gray-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-primary mt-1" />
            <p className="text-sm text-brand-muted">
              Return shipping responsibility may vary by region and reason. Our team will clarify when issuing your RA.
            </p>
          </div>
        </div>
      </Section>

      {/* STATUS */}
      <Section className="bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-secondary mb-4">Return Status & Exchanges</h2>
          <p className="text-brand-muted">
            Once received, inspections typically complete within a few business days. If you prefer an exchange,
            let us know when you request your RA.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-brand-muted">
            <Truck className="w-5 h-5 text-brand-primary" />
            Track shipments with your carrier’s tracking number.
          </div>
        </div>
      </Section>
    </div>
  );
};
