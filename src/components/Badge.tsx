interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  className?: string;
}

export const Badge = ({ children, variant = 'primary', className = '' }: BadgeProps) => {
  const variants = {
    primary: 'bg-brand-primary/10 text-brand-primary',
    secondary: 'bg-brand-secondary/10 text-brand-secondary',
    accent: 'bg-brand-accent/10 text-brand-accent',
    success: 'bg-green-100 text-green-700',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
