import React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  className,
  isRequired = false,
  children,
  ...props
}) => {
  return (
    <label
      className={cn(
        'block text-xs font-semibold text-slate-700 mb-1.5 select-none',
        className
      )}
      {...props}
    >
      {children}
      {isRequired && <span className="ml-1 text-red-500 font-bold">*</span>}
    </label>
  );
};

export default Label;
