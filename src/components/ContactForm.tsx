import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    product: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', product: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-fg mb-2">Name *</label>
          <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-fg mb-2">Email *</label>
          <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-fg mb-2">Phone</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-fg mb-2">Company</label>
          <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-fg mb-2">Product Interest</label>
        <select value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all">
          <option value="">Select a product</option>
          <option value="vacuum-thermos">Vacuum Thermos</option>
          <option value="vacuum-bottle">Vacuum Bottle</option>
          <option value="tumbler-thermos">Tumbler Thermos</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-fg mb-2">Message *</label>
        <textarea required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all resize-none" />
      </div>

      <button type="submit" disabled={status === 'loading'} className="w-full md:w-auto px-8 py-3 bg-brand-primary text-white rounded-full font-medium hover:bg-brand-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {status === 'loading' ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
      </button>

      {status === 'success' && <p className="text-green-600 text-sm">Message sent successfully!</p>}
      {status === 'error' && <p className="text-red-600 text-sm">Failed to send message. Please try again.</p>}
    </form>
  );
};
