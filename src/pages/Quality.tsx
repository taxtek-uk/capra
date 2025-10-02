// src/pages/Quality.tsx
import { Link } from "react-router-dom";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { FeatureCard } from "@/components/FeatureCard";
import { Stat } from "@/components/Stat";
import { FadeIn, SlideIn } from "@/components/Motion";
import {
  ShieldCheck,
  BadgeCheck,
  Ruler,
  Microscope,
  Recycle,
  Factory,
  Workflow,
  Scale,
  CheckCircle,
  ClipboardCheck,
  Globe,
  Award,
  Thermometer,
  Package,
  Sparkles,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const Quality = () => {
  return (
    <div className="pt-16 md:pt-26 overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Subtle ambient blobs & ring (kept consistent with Home) */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-8 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-8 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl animate-spin-slow" />
        </div>

        <Container className="relative z-10 text-white">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-white/10 text-blue-100 rounded-full font-semibold text-sm">
              CAPRA Quality System
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Built for Life. <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">Proven for Quality.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
              Every CAPRA bottle and thermos goes through a rigorous multi-stage quality program—from raw material
              certification to endurance testing—so your beverage stays perfectly hot or cold, safely and reliably.
            </p>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
              >
                Talk to Quality Team
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* KEY STATS */}
      <Section className="bg-gradient-to-b from-white to-gray-50 -mt-20 pt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <Stat value="18+ hrs" label="Thermal Retention" icon={<Thermometer className="w-10 h-10" />} />
            <Stat value="304" label="Food-Grade Steel" icon={<ShieldCheck className="w-10 h-10" />} delay={0.1} />
            <Stat value="7-Step" label="QA Gate Process" icon={<Workflow className="w-10 h-10" />} delay={0.2} />
            <Stat value="2 Years" label="Warranty Coverage" icon={<Award className="w-10 h-10" />} delay={0.3} />
          </div>
        </div>
      </Section>

      {/* QUALITY PILLARS */}
      <Section className="bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold text-sm mb-4">
              Quality Pillars
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Non-Negotiables</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Materials, process, and testing are engineered to exceed real-world demands and international standards.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={ShieldCheck}
            title="Food-Safe Materials"
            description="304 stainless steel, BPA-free components, and compliant coatings for daily, long-term use."
          />
          <FeatureCard
            icon={Factory}
            title="Precision Manufacturing"
            description="CNC forming, clean welding, and automated vacuum sealing to ensure consistency."
            delay={0.1}
          />
          <FeatureCard
            icon={Microscope}
            title="Lab-Grade Testing"
            description="Thermal, drop, leak, and corrosion tests validate performance across seasons."
            delay={0.2}
          />
          <FeatureCard
            icon={Recycle}
            title="Responsible by Design"
            description="Durable builds reduce replacement cycles; recyclable materials minimize footprint."
            delay={0.3}
          />
        </div>
      </Section>

      {/* CERTIFICATIONS & COMPLIANCE */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full font-semibold text-sm mb-4">
              Certifications & Compliance
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Verified You Can Trust</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We align with recognized international benchmarks and provide transparent documentation.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <BadgeCheck className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Material Safety</h3>
            <p className="text-gray-600">Food-contact compliance, heavy-metal limits, and BPA-free declarations.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <FileCheck2 className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thermal Performance</h3>
            <p className="text-gray-600">Retention claims validated under controlled temperature differentials.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <Globe className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Global Standards</h3>
            <p className="text-gray-600">Built to satisfy key regional requirements across export markets.</p>
          </div>
        </div>
      </Section>

      {/* QA PIPELINE TIMELINE */}
      <Section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <SlideIn direction="left">
            <div>
              <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full font-semibold text-sm">
                Our QA Pipeline
              </span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Seven Gates to Ship</h2>
              <p className="mt-6 text-blue-100 text-lg leading-relaxed">
                Nothing leaves the line until it clears each gate with documented pass results.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: Package, title: "1. Incoming Material Check", desc: "Steel grade, gasket compounds, coatings." },
                  { icon: Ruler, title: "2. Dimensional Inspection", desc: "Tolerances for neck, threads, and seals." },
                  { icon: Workflow, title: "3. Process Controls", desc: "Weld integrity, vacuum draw & hold validation." },
                  { icon: Thermometer, title: "4. Thermal Benchmark", desc: "Hot/Cold retention across sample lots." },
                  { icon: Sparkles, title: "5. Surface & Finish", desc: "Scratch, polish, and coating adhesion." },
                  { icon: Scale, title: "6. Stress & Drop", desc: "Impact/pressure tests for real-life mishaps." },
                  { icon: ClipboardCheck, title: "7. Final QC & Packaging", desc: "Leak test, odor check, inserts, labeling." },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <step.icon className="w-6 h-6 text-blue-300 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="text-blue-100/90">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SlideIn>

          <SlideIn direction="right">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-2xl opacity-20" />
              <img
                src="https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272697697_5e948d76.jpg"
                alt="Quality inspection and manufacturing excellence"
                className="relative rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </SlideIn>
        </div>
      </Section>

      {/* LAB TEST DETAILS */}
      <Section className="bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-4">
              Lab Validation
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Performance You Can Measure</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Standardized protocols verify that retention, leak-proofing, and material safety meet our claims.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Thermometer,
              title: "Thermal Retention",
              detail:
                "Hot fill at 95°C measured at intervals; cold retention with ice-water baselines over 24 hours."
            },
            {
              icon: ShieldCheck,
              title: "Leak & Pressure",
              detail:
                "Vacuum integrity & gasket seals checked under torsion and pressure variations."
            },
            {
              icon: Microscope,
              title: "Material & Hygiene",
              detail:
                "Contact-safe components with odor/taste neutrality and anti-corrosion checks."
            },
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2">
                <item.icon className="w-10 h-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* WARRANTY & SUPPORT */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <SlideIn direction="left">
            <div className="space-y-6">
              <span className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-semibold text-sm">
                Warranty & Support
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                2-Year Coverage. Lifetime Care.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Manufacturing defects are covered for two years. Our support team is available to troubleshoot, replace,
                or guide maintenance to keep your bottle performing like day one.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Easy claim workflow</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Genuine parts & gaskets</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Care & cleaning guides</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> Global assistance</li>
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Start a Warranty Claim
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 px-8 py-4 border-2 border-gray-200 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300"
                >
                  Learn About Our Process
                </Link>
              </div>
            </div>
          </SlideIn>

          <SlideIn direction="right">
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl border border-gray-100">
                  <Award className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900">2-Year Warranty</h4>
                  <p className="text-gray-600 text-sm">Coverage against manufacturing defects.</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-100">
                  <Package className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900">Strict Packaging</h4>
                  <p className="text-gray-600 text-sm">Transit-safe cartons, inserts, and seals.</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-100">
                  <Sparkles className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900">Hygiene Control</h4>
                  <p className="text-gray-600 text-sm">No odor, contact-safe interior finishes.</p>
                </div>
                <div className="p-6 bg-white rounded-xl border border-gray-100">
                  <Globe className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900">Worldwide Support</h4>
                  <p className="text-gray-600 text-sm">Assistance across our distributor network.</p>
                </div>
              </div>
            </div>
          </SlideIn>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-sm mb-4">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Quality & Safety — Answers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to common questions about materials, testing, and care.
            </p>
          </FadeIn>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="q1" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                What materials do you use?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                We use 304 food-grade stainless steel and BPA-free polymers for lids and seals, selected for contact safety and durability.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                How do you validate thermal claims?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                We perform controlled hot and cold retention tests across multiple sample lots, recording deltas at standard intervals.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                Is there a warranty?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                Yes. A 2-year warranty covers manufacturing defects. Start a claim from the contact page and our team will guide you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4" className="border border-gray-200 rounded-xl px-6 hover:shadow-lg transition-shadow">
              <AccordionTrigger className="text-left text-lg font-semibold hover:text-blue-600 transition-colors">
                How should I care for my bottle?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-base leading-relaxed pt-2">
                Hand wash with mild soap, keep gaskets clean, and avoid bleach/abrasives. Leave to dry with lid open to prevent odors.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Quality First. Always.
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Partner with CAPRA for world-class, lab-validated vacuum flasks—engineered for everyday performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/products"
                className="group px-12 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl shadow-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
              >
                View Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="group px-12 py-5 bg-transparent border-2 border-white/50 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3"
              >
                Talk to Sales
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>
    </div>
  );
};

// Animations used on Home are expected globally (spin/float). Page follows Home's imports, motion, palettes, and section structure.
