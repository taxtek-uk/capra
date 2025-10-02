import { Mail } from 'lucide-react';
import { ScaleIn } from './Motion';

interface TeamCardProps {
  name: string;
  role: string;
  email: string;
  delay?: number;
}

export const TeamCard = ({ name, role, email, delay = 0 }: TeamCardProps) => {
  return (
    <ScaleIn delay={delay}>
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 className="text-lg font-semibold text-brand-fg mb-1">{name}</h3>
        <p className="text-sm text-brand-accent font-medium mb-3">{role}</p>
        <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-primary transition-colors">
          <Mail className="w-4 h-4" /> {email}
        </a>
      </div>
    </ScaleIn>
  );
};
