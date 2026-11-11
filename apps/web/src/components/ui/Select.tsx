import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  isRequired?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      id,
      label,
      isRequired = false,
      error,
      helperText,
      placeholder,
      options,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={selectId} isRequired={isRequired}>
            {label}
          </Label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            className={cn(
              'w-full appearance-none bg-slate-900 border text-slate-100 placeholder:text-slate-500 rounded-xl px-4 py-2.5 pr-10 text-sm transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              hasError
                ? 'border-red-500/80 focus:ring-red-500/50 bg-red-950/10'
                : 'border-slate-700/80 hover:border-slate-600 focus:ring-emerald-500/50 focus:border-emerald-500',
              disabled && 'opacity-60 cursor-not-allowed bg-slate-950/60',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-500 bg-slate-900">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-slate-900 text-slate-100"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
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

Select.displayName = 'Select';
export default Select;
