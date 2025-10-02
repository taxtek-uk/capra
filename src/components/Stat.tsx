import { FadeIn } from './Motion';

interface StatProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  delay?: number;
}

export const Stat = ({ value, label, icon, delay = 0 }: StatProps) => {
  return (
    <FadeIn delay={delay} className="text-center">
      {icon && (
        <div className="flex justify-center mb-3 text-brand-accent">
          {icon}
        </div>
      )}
      <div className="text-4xl md:text-5xl font-bold text-brand-secondary mb-2">
        {value}
      </div>
      <div className="text-sm md:text-base text-brand-muted font-medium">
        {label}
      </div>
    </FadeIn>
  );
};
