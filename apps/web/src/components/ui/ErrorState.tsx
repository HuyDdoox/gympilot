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
          'flex items-center justify-between gap-3 p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-800 text-xs',
          className
        )}
        role="alert"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-medium leading-relaxed">{message}</span>
        </div>
        {onRetry && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            className="text-xs shrink-0"
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
        'flex flex-col items-center justify-center p-8 sm:p-10 text-center rounded-2xl border border-red-200 bg-red-50/50',
        className
      )}
      role="alert"
    >
      <div className="w-12 h-12 mb-3 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-sm sm:text-base font-bold text-red-900 mb-1 leading-snug">{title}</h4>
      <p className="text-xs text-red-700 max-w-sm mb-4 leading-relaxed font-medium">{message}</p>
      {onRetry && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="text-xs"
        >
          Thử lại
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
