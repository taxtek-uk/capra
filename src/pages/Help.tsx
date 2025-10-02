// src/pages/Help.tsx
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FadeIn, SlideIn } from "@/components/Motion";
import { siteConfig } from "@/data/site";
import { Search, LifeBuoy, MessageSquare, Phone, Mail, BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Help = () => {
  const quickLinks = [
    { name: "Warranty", href: "/warranty" },
    { name: "Returns", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Care Instructions", href: "/care" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="pt-16 md:pt-26">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Answers to common questions and resources to get you help fast.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* SEARCH + QUICK LINKS */}
      <Section className="bg-white">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-brand-secondary">Browse Topics</h2>
              </div>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-primary/40 hover:shadow transition"
                  >
                    <span className="font-semibold text-brand-secondary">{link.name}</span>
                    <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-primary transition" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <LifeBuoy className="w-6 h-6 text-brand-primary" />
              <h3 className="text-xl font-bold text-brand-secondary">Need more help?</h3>
            </div>
            <ul className="space-y-4 text-brand-muted">
              <li className="flex gap-3"><Phone className="w-5 h-5 text-brand-primary mt-1" /> {siteConfig.contact.phone}</li>
              <li className="flex gap-3"><Mail className="w-5 h-5 text-brand-accent mt-1" /> {siteConfig.contact.email}</li>
              <li className="flex gap-3"><MessageSquare className="w-5 h-5 text-green-600 mt-1" /> Chat on WhatsApp via Contact page</li>
            </ul>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 text-brand-primary font-semibold hover:underline">
              Go to Contact <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-gray-50">
        <div className="text-center mb-10">
          <BookOpen className="w-8 h-8 text-brand-primary mx-auto mb-3" />
          <h2 className="text-3xl font-bold text-brand-secondary">Top FAQs</h2>
          <p className="text-brand-muted">Quick answers to common questions.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            { q: "How do I track my order?", a: "You’ll receive a tracking link in your dispatch email. You can also check status on the Shipping Info page." },
            { q: "What’s your return policy?", a: "Returns are accepted within the stated window if items are unused and in original packaging." },
            { q: "How do I start a warranty claim?", a: "Visit the Warranty page and contact support with your order details and photos if applicable." },
          ].map((item, i) => (
            <SlideIn key={i} direction="up" delay={i * 0.05}>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-brand-secondary mb-2">{item.q}</h3>
                <p className="text-brand-muted">{item.a}</p>
              </div>
            </SlideIn>
          ))}
        </div>
      </Section>
    </div>
  );
};
