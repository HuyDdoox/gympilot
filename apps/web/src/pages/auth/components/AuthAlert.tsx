import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuthAlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  className?: string;
}

export const AuthAlert: React.FC<AuthAlertProps> = ({
  type = 'error',
  message,
  className,
}) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    error: <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
  };

  return (
    <div
      role="alert"
      className={cn(
        'p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all',
        styles[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 leading-relaxed font-medium">{message}</div>
    </div>
  );
};

export default AuthAlert;
