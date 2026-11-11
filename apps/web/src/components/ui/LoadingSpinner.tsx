import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label = 'Đang tải...',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className="inline-flex items-center gap-2" role="status" aria-label={label}>
      <span
        className={cn(
          'inline-block rounded-full border-solid border-current border-r-transparent animate-spin text-emerald-400',
          sizeClasses[size],
          className
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
};

export default LoadingSpinner;
