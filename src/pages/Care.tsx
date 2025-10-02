// src/pages/Care.tsx
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FadeIn, SlideIn } from "@/components/Motion";
import { Sparkles, Droplets, Shield, Recycle } from "lucide-react";

export const Care = () => {
  return (
    <div className="pt-16 md:pt-26">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Care Instructions</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Keep your bottle performing like day one with these simple care tips.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* DOs & DON’Ts */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-2 gap-8">
          <SlideIn direction="up">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Sparkles className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="font-bold text-brand-secondary mb-2">Do</h3>
              <ul className="list-disc pl-5 space-y-2 text-brand-muted">
                <li>Hand wash with mild soap and warm water.</li>
                <li>Regularly remove and clean gaskets and lids.</li>
                <li>Air dry fully with the lid open.</li>
              </ul>
            </div>
          </SlideIn>
          <SlideIn direction="up" delay={0.1}>
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <Shield className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="font-bold text-brand-secondary mb-2">Don’t</h3>
              <ul className="list-disc pl-5 space-y-2 text-brand-muted">
                <li>Use bleach, chlorine, or abrasive cleaners.</li>
                <li>Freeze the bottle when filled (expansion can damage seals).</li>
                <li>Microwave any component.</li>
              </ul>
            </div>
          </SlideIn>
        </div>
      </Section>

      {/* DEEP CLEAN */}
      <Section className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-secondary mb-4">Deep Clean (Occasional)</h2>
          <ol className="list-decimal pl-5 space-y-2 text-brand-muted">
            <li>Fill with warm water and a little baking soda. Let sit 15–20 minutes.</li>
            <li>Use a soft bottle brush to scrub interior and the neck.</li>
            <li>Rinse thoroughly and air dry with lid open.</li>
          </ol>
          <div className="mt-6 flex items-center gap-3 text-sm text-brand-muted">
            <Droplets className="w-5 h-5 text-brand-primary" />
            Rinse lids and gaskets separately; ensure they’re completely dry before re-assembly.
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm text-brand-muted">
            <Recycle className="w-5 h-5 text-brand-primary" />
            Replace worn gaskets to maintain leak protection.
          </div>
        </div>
      </Section>
    </div>
  );
};
