import { LucideIcon } from 'lucide-react';
import { ScaleIn } from './Motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

export const FeatureCard = ({ icon: Icon, title, description, delay = 0, className }: FeatureCardProps) => {
  return (
    <ScaleIn delay={delay} className="group">
      <div className={className || "p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 h-full"}>
        <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-brand-primary" />
        </div>
        <h3 className="text-lg font-semibold text-brand-fg mb-2">
          {title}
        </h3>
        <p className="text-sm text-brand-muted leading-relaxed">
          {description}
        </p>
      </div>
    </ScaleIn>
  );
};
