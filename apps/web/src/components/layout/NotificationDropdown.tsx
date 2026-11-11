import React, { useEffect, useRef } from 'react';
import { Dumbbell, Calendar, Gift, Bell, ArrowRight } from 'lucide-react';
import { type MemberNotification } from '@/pages/member/mockData';

export interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: MemberNotification[];
  onViewAll?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onViewAll,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderIcon = (item: MemberNotification) => {
    if (item.avatar) {
      return (
        <img
          src={item.avatar}
          alt=""
          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
        />
      );
    }

    switch (item.type) {
      case 'class':
        return (
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Dumbbell className="w-4 h-4" />
          </div>
        );
      case 'booking':
        return (
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case 'discount':
        return (
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4" />
          </div>
        );
      case 'system':
        return (
          <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
        <h4 className="font-bold text-slate-800 text-sm">Thông báo</h4>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {notifications.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer"
          >
            {renderIcon(item)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {item.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {item.subtitle}
              </p>
            </div>
            {item.isUnread && (
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-2.5 text-center border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
