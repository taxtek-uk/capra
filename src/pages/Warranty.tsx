// src/pages/Warranty.tsx
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FadeIn, SlideIn } from "@/components/Motion";
import { siteConfig } from "@/data/site";
import { ShieldCheck, FileCheck2, Wrench, Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Warranty = () => {
  return (
    <div className="pt-16 md:pt-26">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Warranty</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Your purchase is protected against manufacturing defects for the warranty period stated on your product.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* COVERAGE */}
      <Section className="bg-white">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "What’s Covered", desc: "Manufacturing defects in materials and workmanship under normal use." },
            { icon: Wrench, title: "What’s Not Covered", desc: "Wear and tear, misuse, accidents, or modifications to the product." },
            { icon: FileCheck2, title: "Proof of Purchase", desc: "Order ID, retailer receipt, or invoice is required for claims." },
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

      {/* HOW TO CLAIM */}
      <Section className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-brand-secondary mb-4">How to Start a Claim</h2>
          <ol className="list-decimal pl-5 space-y-3 text-brand-muted">
            <li>Gather proof of purchase and photos/videos of the issue.</li>
            <li>Describe the fault and when it occurs (unboxing, first use, etc.).</li>
            <li>Contact our team using the button below.</li>
          </ol>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:opacity-90"
          >
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="mt-8 space-y-2 text-sm text-brand-muted">
            <div className="flex gap-3"><Phone className="w-4 h-4 text-brand-primary mt-0.5" /> {siteConfig.contact.phone}</div>
            <div className="flex gap-3"><Mail className="w-4 h-4 text-brand-accent mt-0.5" /> {siteConfig.contact.email}</div>
          </div>
        </div>
      </Section>
    </div>
  );
};
