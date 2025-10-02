import { useState, FormEvent } from 'react';
import { Container } from '@/components/Container';
import { FadeIn, ScaleIn } from '@/components/Motion';
import { Sparkles, Mail } from 'lucide-react';

export const ComingSoon = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('success');
    setEmail('');
  };

  return (
    <div className="pt-16 md:pt-26 min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-secondary via-brand-primary to-brand-accent">
      <Container>
        <div className="text-center text-white">
          <ScaleIn>
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </ScaleIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Coming Soon</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
              Exciting new products and colors are on the way. Be the first to know when we launch!
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-brand-fg outline-none focus:ring-2 focus:ring-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-4 bg-white text-brand-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Notify Me
                </button>
              </div>
              {status === 'success' && (
                <p className="mt-4 text-sm text-white/90">Thank you! We'll notify you when we launch.</p>
              )}
            </form>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
};
