// src/pages/Career.tsx
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { FadeIn, SlideIn } from "@/components/Motion";
import { siteConfig } from "@/data/site";
import { Phone, Mail, MapPin, Briefcase, Users, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Career = () => {
  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Warranty", href: "/warranty" },
    { name: "Returns", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Care Instructions", href: "/care" },
  ];

  return (
    <div className="pt-16 md:pt-26">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20 relative overflow-hidden">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Careers at {siteConfig.name}</h1>
            <p className="text-xl text-white/90 max-w-3xl">
              Join a passionate team building premium lifestyle products. We are driven by design,
              quality, and innovation — and we’re always looking for people who share our vision.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* WHY JOIN */}
      <Section className="bg-white">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full font-semibold text-sm mb-4">
              Why Work With Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-6">
              Build More Than a Career
            </h2>
            <p className="text-lg text-brand-muted max-w-3xl mx-auto">
              We believe in creating a culture of trust, growth, and opportunities where every team
              member can thrive.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <SlideIn direction="left">
            <div className="p-6 rounded-2xl bg-gray-50 shadow hover:shadow-lg transition">
              <Briefcase className="w-10 h-10 text-brand-primary mb-4" />
              <h3 className="font-bold text-brand-secondary mb-2">Career Growth</h3>
              <p className="text-brand-muted">
                We invest in your development with mentoring, training, and clear growth paths.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="left" delay={0.1}>
            <div className="p-6 rounded-2xl bg-gray-50 shadow hover:shadow-lg transition">
              <Users className="w-10 h-10 text-brand-primary mb-4" />
              <h3 className="font-bold text-brand-secondary mb-2">Collaborative Culture</h3>
              <p className="text-brand-muted">
                Work alongside creative and motivated people in a supportive environment.
              </p>
            </div>
          </SlideIn>

          <SlideIn direction="left" delay={0.2}>
            <div className="p-6 rounded-2xl bg-gray-50 shadow hover:shadow-lg transition">
              <Target className="w-10 h-10 text-brand-primary mb-4" />
              <h3 className="font-bold text-brand-secondary mb-2">Purpose-Driven</h3>
              <p className="text-brand-muted">
                Be part of a mission to deliver sustainable, high-quality products to the world.
              </p>
            </div>
          </SlideIn>
        </div>
      </Section>

      {/* OPEN ROLES */}
      {/* <Section className="bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-6">Current Openings</h2>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Explore our available roles. Don’t see the right fit? Reach out anyway — we’d love to
            hear from you.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="p-6 bg-white rounded-xl shadow border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-brand-secondary">Marketing Specialist</h3>
              <p className="text-sm text-brand-muted">Full-time · Remote / UK Office</p>
            </div>
            <Link to="/apply" className="flex items-center text-brand-primary font-semibold hover:underline">
              Apply <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-brand-secondary">Frontend Engineer</h3>
              <p className="text-sm text-brand-muted">Full-time · Glasgow HQ</p>
            </div>
            <Link to="/apply" className="flex items-center text-brand-primary font-semibold hover:underline">
              Apply <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </Section> */}

      {/* CONTACT & SUPPORT */}
      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info reused from siteConfig */}
          <div>
            <h2 className="text-2xl font-bold text-brand-secondary mb-6">Contact Our HR Team</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-brand-primary mt-1" />
                <a href={`tel:${siteConfig.contact.phone}`} className="text-brand-muted hover:text-brand-primary transition">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-brand-accent mt-1" />
                <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-muted hover:text-brand-primary transition">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-brand-primary mt-1" />
                <p className="text-brand-muted">{siteConfig.contact.address}</p>
              </div>
            </div>
          </div>

          {/* Helpful Links */}
          <div>
            <h2 className="text-2xl font-bold text-brand-secondary mb-6">Helpful Links</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {supportLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.href} className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition font-semibold text-brand-secondary">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
};
