import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      id,
      label,
      isRequired = false,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId} isRequired={isRequired}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError && inputId ? `${inputId}-error` : undefined}
            className={cn(
              'w-full bg-white border text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              hasError
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20'
                : 'border-slate-300 hover:border-slate-400',
              disabled && 'opacity-60 cursor-not-allowed bg-slate-50',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {hasError && (
          <p id={inputId ? `${inputId}-error` : undefined} className="mt-1.5 text-xs text-red-600 font-medium leading-tight">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className="mt-1.5 text-xs text-slate-500 leading-tight">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
