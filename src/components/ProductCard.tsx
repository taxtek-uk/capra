import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { ColorDots } from './ColorDots';
import { ScaleIn } from './Motion';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  model?: string;
  capacity?: string;
  image: string;
  badges?: string[];
  colors?: string[];
  href: string;
  delay?: number;
  className?: string;
}

export const ProductCard = ({ title, model, capacity, image, badges, colors, href, delay = 0, className }: ProductCardProps) => {
  return (
    <ScaleIn delay={delay}>
      <Link to={href} className="group block">
        <div className={className || "bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"}>
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-5">
            {badges && badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {badges.map((badge, i) => (
                  <Badge key={i} variant="accent">{badge}</Badge>
                ))}
              </div>
            )}
            <h3 className="text-lg font-semibold text-brand-fg mb-1">{title}</h3>
            {model && <p className="text-sm text-brand-muted mb-2">Model: {model}</p>}
            {capacity && <p className="text-sm font-medium text-brand-primary mb-3">{capacity}</p>}
            {colors && colors.length > 0 && <ColorDots colors={colors} className="mb-4" />}
            <div className="flex items-center text-brand-primary text-sm font-medium group-hover:gap-2 transition-all">
              View Details <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </Link>
    </ScaleIn>
  );
};
