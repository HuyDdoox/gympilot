import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import { upcomingClassesData } from '@/features/member/data';

export const UpcomingClassesCard: React.FC = () => {
  const classes = upcomingClassesData;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Calendar className="w-4 h-4 text-emerald-600" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Lịch tập sắp tới
            </h3>
          </div>
        </div>
        <Link
          to="/member/schedule"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <span>Xem tất cả ({classes.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Next Upcoming Reminder Pill */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-[11px] text-emerald-900">
        <span className="flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Ca tập tiếp theo: <strong>Hôm nay 18:00</strong></span>
        </span>
        <span className="font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md text-[10px]">
          Còn 2h 15p
        </span>
      </div>

      {/* Upcoming Classes List (Real Pixel Photography Thumbnails) */}
      <div className="space-y-2.5">
        {classes.slice(0, 2).map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 ${
              index > 0 ? 'pt-2.5 border-t border-slate-100/90' : ''
            }`}
          >
            {/* Date Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-1.5 text-center min-w-[58px] shrink-0">
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {item.dayOfWeek}
              </span>
              <span className="block text-sm font-extrabold text-slate-900 leading-none my-0.5">
                {item.date}
              </span>
              <span className="block text-[9px] text-slate-400 font-medium">
                {item.year}
              </span>
            </div>

            {/* High-Resolution Pixel Photo Thumbnail */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-slate-200/80 shrink-0 bg-slate-100 shadow-2xs">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Class Details */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">
                {item.title}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="truncate">{item.time}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <User className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{item.trainer}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0 text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingClassesCard;
