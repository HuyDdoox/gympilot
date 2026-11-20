import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'interactive' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200/90 shadow-xs text-slate-800',
    subtle: 'bg-slate-50/80 border-slate-200/70 text-slate-800',
    interactive: 'bg-white border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all duration-200 cursor-pointer text-slate-800',
    dark: 'bg-slate-900 border-slate-800 shadow-md text-slate-100',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border overflow-hidden',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('p-5 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100', className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3 className={cn('text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug', className)} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={cn('text-xs text-slate-500 mt-1 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('p-5 sm:p-6', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('p-5 sm:p-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between gap-3', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
