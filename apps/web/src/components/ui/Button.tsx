import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      type = 'button',
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 focus:ring-emerald-500 border border-transparent',
      secondary:
        'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-600/20 focus:ring-indigo-500 border border-transparent',
      outline:
        'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-xs focus:ring-slate-400',
      ghost:
        'bg-transparent hover:bg-slate-100/80 active:bg-slate-200/60 text-slate-600 hover:text-slate-900 border border-transparent focus:ring-slate-400',
      destructive:
        'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm shadow-red-600/20 focus:ring-red-500 border border-transparent',
    };

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[32px]',
      md: 'text-xs sm:text-sm px-4 py-2 rounded-xl gap-2 min-h-[40px]',
      lg: 'text-sm sm:text-base px-6 py-2.5 rounded-xl gap-2.5 min-h-[46px]',
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none whitespace-nowrap cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && 'opacity-60 cursor-not-allowed pointer-events-none shadow-none',
          className
        )}
        {...props}
      >
        {isLoading && <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} className="text-current" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
