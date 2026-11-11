import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, ArrowRight, Megaphone, Gift } from 'lucide-react';
import { memberMockData } from '../mockData';
import { FeaturedClassCard } from './FeaturedClassCard';

export const FeaturedClassesSection: React.FC = () => {
  const { featuredClasses } = memberMockData;

  const sideNotifications = [
    {
      id: 'side-1',
      icon: <Bell className="w-4 h-4 text-amber-500" />,
      iconBg: 'bg-amber-100',
      title: 'Lớp Yoga Flow vào thứ 5 sắp bắt đầu! Đừng quên tham gia nhé!',
      time: '2 giờ trước',
    },
    {
      id: 'side-2',
      icon: <Megaphone className="w-4 h-4 text-emerald-500" />,
      iconBg: 'bg-emerald-100',
      title: 'Gói tập của bạn sẽ hết hạn trong 7 ngày. Gia hạn ngay để tiếp tục rèn luyện!',
      time: '1 ngày trước',
    },
    {
      id: 'side-3',
      icon: <Gift className="w-4 h-4 text-blue-500" />,
      iconBg: 'bg-blue-100',
      title: 'GymPilot chúc bạn một ngày tập luyện hiệu quả! Khỏe mạnh hơn, hạnh phúc hơn!',
      time: '2 ngày trước',
    },
  ];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">
      {/* Left 2 Cols: Featured Classes */}
      <div className="lg:col-span-2 space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <h3 className="text-base font-bold text-slate-900">Lớp học nổi bật</h3>
          </div>
        </div>

        {/* 3 Classes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredClasses.map((item) => (
            <FeaturedClassCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Right 1 Col: Side Notifications Widget ("Thông báo của bạn") */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-lg">📢</span>
              <h4 className="text-sm font-bold text-slate-900">Thông báo của bạn</h4>
            </div>
            <Link
              to="/member/my-membership"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* List of 3 Notifications */}
          <div className="space-y-3.5">
            {sideNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 group cursor-pointer">
                <div className={`w-8 h-8 rounded-full ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                  {n.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors">
                    {n.title}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {n.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedClassesSection;
