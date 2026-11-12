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
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
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
            'w-full bg-slate-900 border text-slate-100 placeholder:text-slate-500 rounded-xl px-4 py-2.5 text-sm transition-all duration-150 resize-y',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            hasError
              ? 'border-red-500/80 focus:ring-red-500/50 bg-red-950/10'
              : 'border-slate-700/80 hover:border-slate-600 focus:ring-emerald-500/50 focus:border-emerald-500',
            disabled && 'opacity-60 cursor-not-allowed bg-slate-950/60',
            className
          )}
          {...props}
        />
        {hasError && (
          <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>
        )}
        {!hasError && helperText && (
          <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
export default Textarea;
