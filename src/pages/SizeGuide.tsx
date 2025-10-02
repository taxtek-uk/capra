// src/pages/SizeGuide.tsx
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FadeIn, SlideIn } from "@/components/Motion";
import { Ruler, Thermometer, CupSoda } from "lucide-react";

export const SizeGuide = () => {
  const sizes = [
    { name: "350 ml", bestFor: "Short outings, kids, espresso lovers", dims: "Compact / light carry" },
    { name: "500 ml", bestFor: "Daily carry, gym, commute", dims: "Balanced capacity vs. size" },
    { name: "750 ml", bestFor: "Longer sessions, hikes", dims: "Larger body, fits many side pockets" },
    { name: "1000 ml", bestFor: "Day trips, all-day hydration", dims: "Max capacity, backpack friendly" },
  ];

  return (
    <div className="pt-16 md:pt-26">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Size Guide</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Find the right capacity for your routine, from everyday carry to all-day adventures.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* TABLE */}
      <Section className="bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 text-sm font-semibold text-brand-secondary">Capacity</th>
                <th className="px-4 py-3 text-sm font-semibold text-brand-secondary">Best For</th>
                <th className="px-4 py-3 text-sm font-semibold text-brand-secondary">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sizes.map((s) => (
                <tr key={s.name} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-brand-secondary">{s.name}</td>
                  <td className="px-4 py-3 text-brand-muted">{s.bestFor}</td>
                  <td className="px-4 py-3 text-brand-muted">{s.dims}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* TIPS */}
      <Section className="bg-gray-50">
        <div className="grid md:grid-cols-3 gap-8">
          <SlideIn direction="up">
            <div className="p-6 bg-white rounded-2xl border border-gray-100">
              <Ruler className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="font-bold text-brand-secondary mb-2">Fit Matters</h3>
              <p className="text-brand-muted">Check bottle diameter/height if you need it to fit a car cup holder or backpack pocket.</p>
            </div>
          </SlideIn>
          <SlideIn direction="up" delay={0.1}>
            <div className="p-6 bg-white rounded-2xl border border-gray-100">
              <Thermometer className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="font-bold text-brand-secondary mb-2">Thermal Goals</h3>
              <p className="text-brand-muted">Larger volumes retain heat/cold longer when filled properly.</p>
            </div>
          </SlideIn>
          <SlideIn direction="up" delay={0.2}>
            <div className="p-6 bg-white rounded-2xl border border-gray-100">
              <CupSoda className="w-8 h-8 text-brand-primary mb-3" />
              <h3 className="font-bold text-brand-secondary mb-2">Use Case</h3>
              <p className="text-brand-muted">Consider straw lids for workouts and leak-lock lids for travel bags.</p>
            </div>
          </SlideIn>
        </div>
      </Section>
    </div>
  );
};
