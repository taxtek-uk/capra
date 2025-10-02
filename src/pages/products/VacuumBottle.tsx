import { Link } from 'react-router-dom';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { ColorDots } from '@/components/ColorDots';
import { Badge } from '@/components/Badge';
import { FadeIn } from '@/components/Motion';
import { Shield, Thermometer, Lock, Sparkles } from 'lucide-react';

export const VacuumBottle = () => {
  const colors = ['#2563eb', '#64748b', '#1e293b'];

  // Product images + captions (paths match your folder shown in the screenshot)
  const images = [
    {
      src: '/images/vacuum-bottle/vacuum-bottle-01.jpeg',
      caption: 'Stainless Vacuum Jug — classic profile with easy-pour spout',
    },
    {
      src: '/images/vacuum-bottle/vacuum-bottle-02.jpeg',
      caption: 'Wide-mouth opening — clean spout for drip-free pouring',
    },
    {
      src: '/images/vacuum-bottle/vacuum-bottle-03.jpeg',
      caption: 'Push-button actuator — one-hand pour control',
    },
    {
      src: '/images/vacuum-bottle/vacuum-bottle-04.jpeg',
      caption: 'Ergonomic handle — secure grip for daily use',
    },
    {
      src: '/images/vacuum-bottle/vacuum-bottle-05.jpeg',
      caption: 'Studio shot with CAPRA branding — premium steel finish',
    },
    {
      src: '/images/vacuum-bottle/vacuum-bottle-06.jpeg',
      caption: 'Compact CAPRA jug — countertop presentation',
    },
  ];

  return (
    <div className="pt-16 md:pt-26">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">Portable</Badge>
              <Badge variant="success">Leak-Proof</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Vacuum Bottle</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Premium portable vacuum bottles designed for daily use. Featuring
              high-grade stainless steel construction, leak-resistant seals, and
              superior thermal insulation for hot and cold beverages on the go.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Features */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-brand-secondary mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Durable Build', desc: 'Premium stainless steel for lasting performance' },
            { icon: Thermometer, title: 'Hot & Cool', desc: 'Maintains temperature for extended periods' },
            { icon: Lock, title: 'Leak-Resistant', desc: 'Secure lid design prevents spills' },
            { icon: Sparkles, title: 'Stylish Finish', desc: 'Multiple color options to match your style' },
          ].map((feature, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-brand-fg mb-2">{feature.title}</h3>
                <p className="text-sm text-brand-muted">{feature.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Product Showcase */}
      <Section className="bg-gray-50">
        <h2 className="text-3xl font-bold text-brand-secondary mb-8 text-center">Product Showcase</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {images.map((item, i) => (
            <FadeIn key={i} delay={i * 0.05}>
              <figure className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition">
                <img src={item.src} alt={item.caption} className="w-full h-84 object-cover" />
                <figcaption className="p-4 text-center text-sm font-medium text-brand-fg">
                  {item.caption}
                </figcaption>
              </figure>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Specs */}
      <Section className="bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary mb-8 text-center">Specifications</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm ring-1 ring-black/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-brand-fg mb-3">Capacity Options</h3>
                <ul className="space-y-2 text-brand-muted">
                  <li>• 500ml — Perfect for short trips</li>
                  <li>• 750ml — Ideal for daily commute</li>
                  <li>• 1.0L — Great for all-day hydration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-fg mb-3">Material &amp; Build</h3>
                <ul className="space-y-2 text-brand-muted">
                  <li>• 304 Stainless Steel</li>
                <li>• Double-wall vacuum insulation</li>
                  <li>• BPA-free materials</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-fg mb-3">Lid Type</h3>
                <ul className="space-y-2 text-brand-muted">
                  <li>• Screw-top with silicone seal</li>
                  <li>• Easy-grip design</li>
                  <li>• Leak-resistant construction</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-fg mb-3">Available Colors</h3>
                <ColorDots colors={colors} size="lg" className="mt-2" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">Get Your Vacuum Bottle</h2>
          <p className="text-lg text-brand-muted mb-8">
            Contact us for product details, pricing information, and bulk order inquiries.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-secondary transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </Section>
    </div>
  );
};
