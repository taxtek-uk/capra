import { Link } from 'react-router-dom';
import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { ColorDots } from '@/components/ColorDots';
import { Badge } from '@/components/Badge';
import { FadeIn } from '@/components/Motion';
import { Coffee, Droplets, Sparkles, ThermometerSun } from 'lucide-react';

export const TumblerThermos = () => {
  const colors = ['#2563eb', '#dc2626', '#64748b'];

  // Image showcase mapping
  const images = [
    { src: '/images/tumbler-thermos/tumbler-thermos-01.jpeg', caption: 'Classic Stainless & Blue Tumbler Bottles' },
    { src: '/images/tumbler-thermos/tumbler-thermos-02.jpeg', caption: 'Elegant Stainless Jugs – Dining Table Ready' },
    { src: '/images/tumbler-thermos/tumbler-thermos-03.jpeg', caption: 'Sports Series Thermos – Black & Brown' },
    { src: '/images/tumbler-thermos/tumbler-thermos-04.jpeg', caption: 'Sports Series Multi-Color Lineup' },
    { src: '/images/tumbler-thermos/tumbler-thermos-05.jpeg', caption: 'Matte Stainless Jugs – Modern Form' },
    { src: '/images/tumbler-thermos/tumbler-thermos-06.jpeg', caption: 'Precision Spout Design – Top View' },
    { src: '/images/tumbler-thermos/tumbler-thermos-07.jpeg', caption: 'Push-Button Lid – Black with Red Accent' },
    { src: '/images/tumbler-thermos/tumbler-thermos-08.jpeg', caption: 'Compact Twist Lid – Leak Proof Build' },
    { src: '/images/tumbler-thermos/tumbler-thermos-09.jpeg', caption: 'Capra Branded Jug – Premium Boxed Edition' },
    { src: '/images/tumbler-thermos/tumbler-thermos-10.jpeg', caption: 'Sports Thermos Gift Pack – 5 Color Variants' },
    { src: '/images/tumbler-thermos/tumbler-thermos-11.jpeg', caption: 'Sports Line Collection – Multi-Pack Edition' },
    { src: '/images/tumbler-thermos/tumbler-thermos-12.jpeg', caption: 'Capra Stainless Jug – Shelf Display' },
    { src: '/images/tumbler-thermos/tumbler-thermos-13.jpeg', caption: 'Capra Jug Packaging – Premium Quality' },
    { src: '/images/tumbler-thermos/tumbler-thermos-14.jpeg', caption: 'Stainless Slim Jug – Minimalist Style' },
    { src: '/images/tumbler-thermos/tumbler-thermos-15.jpeg', caption: 'Sports Thermos – Bold Black, Red & Silver' },
  ];

  return (
    <div className="pt-16 md:pt-26">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="accent">Double-Wall</Badge>
              <Badge variant="success">Stylish</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tumbler Thermos</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Double-wall insulated tumblers perfect for your desk or travel.
              Sleek design meets functionality with easy-clean interiors and
              superior temperature retention.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Features */}
      <Section className="bg-white">
        <h2 className="text-3xl font-bold text-brand-secondary mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Coffee, title: 'Perfect for Desk', desc: 'Fits most cup holders and desk spaces' },
            { icon: ThermometerSun, title: 'Temperature Control', desc: 'Keeps drinks at ideal temperature' },
            { icon: Droplets, title: 'Easy to Clean', desc: 'Smooth interior for hassle-free cleaning' },
            { icon: Sparkles, title: 'Modern Design', desc: 'Sleek aesthetic with multiple colors' },
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
                <img src={item.src} alt={item.caption} className="w-full h-74 object-cover" />
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
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-brand-fg mb-3">Capacity Options</h3>
                <ul className="space-y-2 text-brand-muted">
                  <li>• 350ml – Compact size</li>
                  <li>• 450ml – Standard size</li>
                  <li>• 500ml – Large capacity</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-fg mb-3">Construction</h3>
                <ul className="space-y-2 text-brand-muted">
                  <li>• Double-wall vacuum insulation</li>
                  <li>• Stainless steel body</li>
                  <li>• Powder-coated finish</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-fg mb-3">Lid Options</h3>
                <ul className="space-y-2 text-brand-muted">
                  <li>• Sliding lid with straw opening</li>
                  <li>• Splash-resistant design</li>
                  <li>• Easy one-hand operation</li>
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
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">Order Your Tumbler</h2>
          <p className="text-lg text-brand-muted mb-8">
            Interested in our Tumbler Thermos range? Reach out for more information and ordering options.
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
