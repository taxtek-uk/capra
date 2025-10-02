interface ColorDotsProps {
  colors: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ColorDots = ({ colors, size = 'md', className = '' }: ColorDotsProps) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {colors.map((color, index) => (
        <div
          key={index}
          className={`${sizes[size]} rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200`}
          style={{ backgroundColor: color }}
          title={`Color option ${index + 1}`}
        />
      ))}
    </div>
  );
};
