import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      id,
      label,
      isRequired = false,
      error,
      helperText,
      disabled = false,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={textareaId} isRequired={isRequired}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(
            'w-full bg-white border text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm transition-all duration-150 resize-y leading-relaxed',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
            hasError
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20'
              : 'border-slate-300 hover:border-slate-400',
            disabled && 'opacity-60 cursor-not-allowed bg-slate-50',
            className
          )}
          {...props}
        />
        {hasError && (
          <p className="mt-1.5 text-xs text-red-600 font-medium leading-tight">{error}</p>
        )}
        {!hasError && helperText && (
          <p className="mt-1.5 text-xs text-slate-500 leading-tight">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
