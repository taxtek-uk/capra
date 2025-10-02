import { Link } from 'react-router-dom';
import { Shield, Thermometer, Droplets, Sparkles, Package, Award, Clock, Phone, Mail, MessageSquare } from 'lucide-react';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-brand-secondary">CAPRA</div>
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-brand-fg hover:text-brand-primary">Home</Link>
            <Link to="/about" className="text-brand-fg hover:text-brand-primary">About</Link>
            <Link to="/products" className="text-brand-fg hover:text-brand-primary">Products</Link>
            <Link to="/contact" className="text-brand-fg hover:text-brand-primary">Contact</Link>
          </nav>
          <a href="https://wa.me/923001234567" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">CAPRA Thermos Vacuum Flask</h1>
          <p className="text-xl mb-8">Hot & Cool Bottles Manufacturer</p>
          <div className="flex gap-4">
            <Link to="/products" className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold">Explore Products</Link>
            <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div><Clock className="w-8 h-8 mx-auto mb-2 text-brand-accent" /><div className="text-4xl font-bold text-brand-secondary">18+</div><div className="text-brand-muted">Hours Hot/Cold</div></div>
          <div><Shield className="w-8 h-8 mx-auto mb-2 text-brand-accent" /><div className="text-4xl font-bold text-brand-secondary">100%</div><div className="text-brand-muted">Stainless Steel</div></div>
          <div><Package className="w-8 h-8 mx-auto mb-2 text-brand-accent" /><div className="text-4xl font-bold text-brand-secondary">3</div><div className="text-brand-muted">Capacity Options</div></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-secondary">Why Choose CAPRA</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Best Quality', desc: 'Guaranteed quality control' },
              { icon: Shield, title: 'Stainless Steel', desc: 'Food-grade 304 steel' },
              { icon: Sparkles, title: 'Unbreakable', desc: 'Robust construction' },
              { icon: Thermometer, title: 'Hot & Cool', desc: 'Superior insulation' },
              { icon: Package, title: 'Multiple Sizes', desc: '1.0L / 2.0L / 3.0L' },
              { icon: Droplets, title: 'No Glass', desc: '100% stainless steel' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border">
                <f.icon className="w-8 h-8 text-brand-primary mb-3" />
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-brand-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-brand-secondary">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Vacuum Thermos', img: 'https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272691247_061d9775.jpg', href: '/products' },
              { title: 'Vacuum Bottle', img: 'https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272695082_c9af6d56.jpg', href: '/products' },
              { title: 'Tumbler Thermos', img: 'https://d64gsuwffb70l.cloudfront.net/68dc5e5981e3945a0583e0bf_1759272696385_2d57bc4c.jpg', href: '/products' },
            ].map((p, i) => (
              <Link key={i} to={p.href} className="group">
                <div className="bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <img src={p.img} alt={p.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-6"><h3 className="text-xl font-bold">{p.title}</h3></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div><div className="text-2xl font-bold mb-2">CAPRA</div><p className="text-sm text-gray-300">Make Life Easy</p></div>
          <div><h3 className="font-semibold mb-4">Contact</h3><div className="space-y-2 text-sm"><div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +92 300 1234567</div><div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@capra.pk</div></div></div>
          <div><h3 className="font-semibold mb-4">Quick Links</h3><div className="space-y-2 text-sm"><Link to="/about">About</Link><br/><Link to="/products">Products</Link><br/><Link to="/contact">Contact</Link></div></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">&copy; 2024 CAPRA - Salman Industries</div>
      </footer>
    </div>
  );
};

export default AppLayout;
