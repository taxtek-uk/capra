import { Link } from 'react-router-dom';
import { 
  Facebook, 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowUp,
  Award,
  Shield,
  Truck,
  Clock,
  Star,
  ChevronRight,
  Zap,
  Globe,
  Heart
} from 'lucide-react';
import { Container } from './Container';
import { siteConfig } from '@/data/site';
import { useState, useEffect } from 'react';

export const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    alert(`Subscribed with ${email}`);
    setEmail('');
  };

  const features = [
    { icon: Award, text: "Premium Quality" },
    { icon: Shield, text: "2 Year Warranty" },
    { icon: Truck, text: "Free Shipping" },
    { icon: Clock, text: "18+ Hours Retention" }
  ];

  const socialLinks = [
    { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook", color: "hover:bg-blue-600" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    // { icon: Twitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    // { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
    // { icon: Youtube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
    { icon: MessageSquare, href: siteConfig.social.whatsapp, label: "WhatsApp", color: "hover:bg-green-600" }
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Quality", href: "/quality" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" }
  ];

  const productCategories = [
    { name: "Vacuum Thermos", href: "/products/vacuum-thermos" },
    { name: "Vacuum Bottles", href: "/products/vacuum-bottles" },
    { name: "Tumbler Thermos", href: "/products/tumbler-thermos" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Warranty", href: "/warranty" },
    { name: "Returns", href: "/returns" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Care Instructions", href: "/care" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container className="relative z-10">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated with CAPRA
            </h3>
            <p className="text-blue-200 mb-8 text-lg">
              Get the latest updates on new products, exclusive offers, and industry insights
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                Subscribe
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-black font-heading">CAPRA</div>
                <p className="text-blue-200 text-sm">{siteConfig.tagline}</p>
              </div>
            </div>
            
            <p className="text-blue-100 mb-6 text-lg leading-relaxed">
              {siteConfig.description}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <feature.icon className="w-5 h-5 text-blue-300" />
                  </div>
                  <span className="text-sm text-blue-200 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-sm text-blue-200">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>50,000+ Happy Customers</span>
              </div>
              <div className="w-px h-4 bg-white/20"></div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>25+ Countries</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-blue-200 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Products</h3>
            <ul className="space-y-3">
              {productCategories.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-blue-200 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-3 mb-8">
              {supportLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    className="text-blue-200 hover:text-white transition-all duration-300 flex items-center gap-2 group"
                  >
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white mb-3">Get in Touch</h4>
              <div className="space-y-3">
                <a 
                  href={`tel:${siteConfig.contact.phone}`} 
                  className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm">{siteConfig.contact.phone}</span>
                </a>
                <a 
                  href={`mailto:${siteConfig.contact.email}`} 
                  className="flex items-center gap-3 text-blue-200 hover:text-white transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm">{siteConfig.contact.email}</span>
                </a>
                <div className="flex items-start gap-3 text-blue-200">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm leading-relaxed">{siteConfig.contact.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex flex-col items-center lg:items-start">
              <h4 className="font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 ${social.color} transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group`}
                  >
                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright & Legal */}
            <div className="text-center lg:text-right">
              <p className="text-blue-200 text-sm mb-2">
                &copy; {new Date().getFullYear()} CAPRA - Salman Industries. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-end gap-4 text-xs text-blue-300">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span className="w-px h-3 bg-white/20"></span>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <span className="w-px h-3 bg-white/20"></span>
                <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
              <div className="flex items-center justify-center lg:justify-end gap-1 mt-2 text-xs text-blue-300">
                <span>Made with</span>
                <Heart className="w-3 h-3 fill-red-400 text-red-400" />
                <span>by NA Technologies Ltd</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center group ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </footer>
  );
};