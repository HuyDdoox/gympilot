import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  isInline?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Đã có lỗi xảy ra',
  message = 'Không thể tải dữ liệu vào lúc này. Vui lòng kiểm tra lại kết nối hoặc thử lại sau.',
  onRetry,
  className,
  isInline = false,
}) => {
  if (isInline) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-200 text-sm',
          className
        )}
        role="alert"
      >
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Thử lại
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-red-500/20 bg-red-950/10',
        className
      )}
      role="alert"
    >
      <div className="w-14 h-14 mb-4 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h4 className="text-base font-semibold text-white mb-1.5">{title}</h4>
      <p className="text-sm text-slate-300 max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Thử lại
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
