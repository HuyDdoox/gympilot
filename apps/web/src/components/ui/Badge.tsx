import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  hasDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  hasDot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/90 font-semibold',
    error: 'bg-red-50 text-red-800 border-red-200/90 font-semibold',
    info: 'bg-blue-50 text-blue-800 border-blue-200/90 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200 font-semibold',
  };

  const dotColors = {
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    neutral: 'bg-slate-500',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-full gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border select-none whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {hasDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
