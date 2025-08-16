
import { ReactNode } from 'react';

interface GeometricBannerProps {
  children: ReactNode;
  className?: string;
  variant?: 'hexagon' | 'diamond' | 'arrow';
}

export default function GeometricBanner({ 
  children, 
  className = '', 
  variant = 'hexagon' 
}: GeometricBannerProps) {
  const getClipPath = () => {
    switch (variant) {
      case 'hexagon':
        return 'polygon(0% 25%, 0% 75%, 25% 100%, 75% 100%, 100% 75%, 100% 25%, 75% 0%, 25% 0%)';
      case 'diamond':
        return 'polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%)';
      case 'arrow':
        return 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)';
      default:
        return 'none';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Geometric Shape Background */}
      <div 
        className="absolute inset-4 bg-brand-green opacity-90"
        style={{ clipPath: getClipPath() }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
}
