import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight, Megaphone, Gift, Flame } from 'lucide-react';
import { useFeaturedClasses } from '@/features/member/hooks/useMemberData';
import { sideNotificationsData, type SideNotificationItem } from '@/features/member/data';
import { FeaturedClassCard } from './FeaturedClassCard';

export const FeaturedClassesSection: React.FC = () => {
  const { data: featuredClasses = [] } = useFeaturedClasses();

  const renderIcon = (type: SideNotificationItem['type']) => {
    switch (type) {
      case 'class':
        return <Bell className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'membership':
        return <Megaphone className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'welcome':
        return <Gift className="w-4 h-4 text-blue-600 shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const getIconBg = (type: SideNotificationItem['type']) => {
    switch (type) {
      case 'class':
        return 'bg-amber-50 border border-amber-200/80';
      case 'membership':
        return 'bg-emerald-50 border border-emerald-200/80';
      case 'welcome':
        return 'bg-blue-50 border border-blue-200/80';
      default:
        return 'bg-slate-100 border border-slate-200';
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 w-full items-stretch">
      {/* Left 2 Cols: Featured Classes */}
      <div className="lg:col-span-2 space-y-3.5 flex flex-col justify-between">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
              <Flame className="w-4 h-4 text-emerald-600 fill-emerald-500" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Lớp học nổi bật
            </h3>
          </div>
          <Link
            to="/member/class-booking"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Classes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
          {featuredClasses.map((item) => (
            <FeaturedClassCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Right 1 Col: Side Notifications Widget ("Thông báo của bạn") */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-50 text-blue-600">
                <Bell className="w-4 h-4 text-blue-600" />
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Thông báo của bạn
              </h4>
            </div>
            <Link
              to="/member/profile"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* List of Notifications from Static Data */}
          <div className="space-y-3.5">
            {sideNotificationsData.map((n) => (
              <div key={n.id} className="flex items-start gap-3 group cursor-pointer">
                <div
                  className={`w-8 h-8 rounded-xl ${getIconBg(
                    n.type
                  )} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}
                >
                  {renderIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors">
                    {n.title}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block font-normal">
                    {n.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Tip Box */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Tự động cập nhật lịch trước 2 giờ</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedClassesSection;
