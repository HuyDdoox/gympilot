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
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
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
              'w-full appearance-none bg-white border text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 pr-10 text-xs sm:text-sm transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
              hasError
                ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20'
                : 'border-slate-300 hover:border-slate-400',
              disabled && 'opacity-60 cursor-not-allowed bg-slate-50',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-slate-400 bg-white">
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-white text-slate-900"
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
          <p className="mt-1.5 text-xs text-red-600 font-medium leading-tight">{error}</p>
        )}
        {!hasError && helperText && (
          <p className="mt-1.5 text-xs text-slate-500 leading-tight">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
