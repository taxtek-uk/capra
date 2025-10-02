import { FadeIn } from './Motion';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline = ({ items }: TimelineProps) => {
  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <FadeIn key={index} delay={index * 0.1}>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center text-white font-bold text-sm">
                {item.year}
              </div>
              {index < items.length - 1 && (
                <div className="w-0.5 h-full bg-brand-accent/30 mt-2" />
              )}
            </div>
            <div className="flex-1 pb-8">
              <h3 className="text-lg font-semibold text-brand-fg mb-2">{item.title}</h3>
              <p className="text-sm text-brand-muted">{item.description}</p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
};
