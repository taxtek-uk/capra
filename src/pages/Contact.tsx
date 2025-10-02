import { Section } from '@/components/Section';
import { Container } from '@/components/Container';
import { ContactForm } from '@/components/ContactForm';
import { FadeIn } from '@/components/Motion';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/data/site';

export const Contact = () => {
  return (
    <div className="pt-16 md:pt-26">
      <section className="bg-gradient-to-br from-brand-secondary to-brand-primary text-white py-20">
        <Container>
          <FadeIn>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl text-white/90 max-w-3xl">Have questions about our products? We're here to help. Reach out to us and we'll respond as soon as possible.</p>
          </FadeIn>
        </Container>
      </section>

      <Section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-brand-secondary mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-brand-secondary mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-fg mb-1">Phone</h3>
                  <a href={`tel:${siteConfig.contact.phone}`} className="text-brand-muted hover:text-brand-primary transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-fg mb-1">Email</h3>
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-muted hover:text-brand-primary transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-fg mb-1">WhatsApp</h3>
                  <a href={siteConfig.social.whatsapp} target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-brand-primary transition-colors">
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-fg mb-1">Address</h3>
                  <p className="text-brand-muted">{siteConfig.contact.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-brand-fg mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm text-brand-muted">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
