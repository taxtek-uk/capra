import { Link } from 'react-router-dom';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { ColorDots } from '@/components/ColorDots';
import { Badge } from '@/components/Badge';
import { FadeIn } from '@/components/Motion';
import { Shield, Thermometer, Droplets, Sparkles, Clock, Zap } from 'lucide-react';

export const VacuumThermos = () => {
  const models = [
    { model: 'SLD-010', type: 'Vacuum Jug', capacity: '1.0 L', mode: 'Simple', notes: 'Stainless/Unbreakable' },
    { model: 'SLD-020', type: 'Vacuum Flask', capacity: '2.0 L', mode: 'Simple', notes: 'Stainless/Unbreakable' },
    { model: 'SLD-030', type: 'Vacuum Flask', capacity: '3.0 L', mode: 'Push', notes: 'Stainless/Unbreakable' },
    { model: 'RIT-010', type: 'Vacuum Flask', capacity: '1.0 L', mode: 'Push', notes: 'Stainless/Unbreakable' },
    { model: 'RIT-020', type: 'Vacuum Jug', capacity: '3.0 L', mode: 'Push', notes: 'Stainless/Unbreakable' },
  ];

  const colors = ['#2563eb', '#dc2626', '#f59e0b', '#64748b', '#1e293b'];

  // Image Showcase with captions
  const images = [
    { src: "/images/vacuum_thermos/vacuum-thermos-01.jpeg", caption: "Sports Stainless Steel Insulation Cup" },
    { src: "/images/vacuum_thermos/vacuum-thermos-02.jpeg", caption: "Capra Color Range – Black, Blue, Red" },
    { src: "/images/vacuum_thermos/vacuum-thermos-03.jpeg", caption: "Classic Matte Finish – Beige, Green, Brown" },
    { src: "/images/vacuum_thermos/vacuum-thermos-04.jpeg", caption: "Premium Stainless Steel Water Bottle with Box" },
    { src: "/images/vacuum_thermos/vacuum-thermos-05.jpeg", caption: "Top View – Precision Handle & Spout Design" },
    { src: "/images/vacuum_thermos/vacuum-thermos-06.jpeg", caption: "Capra Stainless Vacuum Jug – Large Capacity" },
    { src: "/images/vacuum_thermos/vacuum-thermos-07.jpeg", caption: "Compact Capra Steel Jug – Quality Guarantee" },
    { src: "/images/vacuum_thermos/vacuum-thermos-08.jpeg", caption: "Ergonomic Steel Jug – Push Button Pour" },
    { src: "/images/vacuum_thermos/vacuum-thermos-09.jpeg", caption: "Dual Color Series – Blue & White Vacuum Jugs" },
  ];

  return (
    <div className="pt-16 md:pt-26">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">Hot & Cool</Badge>
              <Badge variant="success">Unbreakable</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Vacuum Thermos</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Engineered for everyday performance. CAPRA Vacuum Thermos units combine double-wall stainless steel with precision insulation to keep beverages hot or cold for long hours—built tough, hygienic, and easy to clean.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Features */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-brand-secondary mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: 'High-Grade Stainless Steel', desc: '100% food-grade 304 stainless steel construction' },
            { icon: Thermometer, title: 'Superior Insulation', desc: 'Keeps beverages hot or cold for up to 18 hours' },
            { icon: Droplets, title: 'No Glass Interior', desc: 'Stainless steel inside and out for durability' },
            { icon: Sparkles, title: 'Unbreakable Design', desc: 'Robust construction for long-lasting use' },
            { icon: Clock, title: 'Easy to Clean', desc: 'Wide mouth design for effortless maintenance' },
            { icon: Zap, title: 'Multiple Modes', desc: 'Simple pour and push button options available' },
          ].map((feature, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-fg mb-1">{feature.title}</h3>
                  <p className="text-sm text-brand-muted">{feature.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Product Gallery */}
      <Section className="bg-gray-50">
        <h2 className="text-3xl font-bold text-brand-secondary mb-8 text-center">Product Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition">
                <img src={item.src} alt={item.caption} className="w-full h-64 object-cover" />
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-brand-fg">{item.caption}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Models Table */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-brand-secondary mb-8 text-center">Models & Specifications</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl overflow-hidden shadow-sm">
            <thead className="bg-brand-secondary text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Model</th>
                <th className="px-6 py-4 text-left font-semibold">Type</th>
                <th className="px-6 py-4 text-left font-semibold">Capacity</th>
                <th className="px-6 py-4 text-left font-semibold">Mode</th>
                <th className="px-6 py-4 text-left font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model, i) => (
                <tr key={i} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-brand-primary">{model.model}</td>
                  <td className="px-6 py-4 text-brand-fg">{model.type}</td>
                  <td className="px-6 py-4 text-brand-fg">{model.capacity}</td>
                  <td className="px-6 py-4"><Badge variant="primary">{model.mode}</Badge></td>
                  <td className="px-6 py-4 text-sm text-brand-muted">{model.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-brand-fg mb-4">Available Colors</h3>
          <ColorDots colors={colors} size="lg" className="justify-center" />
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">For Further Inquiry</h2>
          <p className="text-lg text-brand-muted mb-8">
            Interested in our Vacuum Thermos range? Contact us for detailed specifications, pricing, and bulk orders.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-secondary transition-colors"
          >
            Contact Us Now
          </Link>
        </div>
      </Section>
    </div>
  );
};
