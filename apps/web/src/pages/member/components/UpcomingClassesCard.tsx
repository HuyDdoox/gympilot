import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowRight, MoreVertical } from 'lucide-react';
import { memberMockData } from '../mockData';

export const UpcomingClassesCard: React.FC = () => {
  const { upcomingClass } = memberMockData;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900">Lịch tập sắp tới</h3>
        </div>
        <Link
          to="/member/class-booking"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Content Row */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
        {/* Date Box */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2 sm:p-2.5 text-center min-w-[68px] sm:min-w-[76px] shrink-0">
          <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            {upcomingClass.dayOfWeek}
          </span>
          <span className="block text-base sm:text-lg font-extrabold text-slate-900 leading-tight my-0.5">
            {upcomingClass.date}
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">
            {upcomingClass.year}
          </span>
        </div>

        {/* Class Image Thumbnail */}
        <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-100">
          <img
            src={upcomingClass.image}
            alt={upcomingClass.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Class Details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate mb-1">
            {upcomingClass.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-0.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{upcomingClass.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{upcomingClass.trainer}</span>
          </div>
        </div>

        {/* Status Badge & More Button */}
        <div className="flex sm:flex-col items-center justify-between sm:items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            {upcomingClass.status}
          </span>
          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Thao tác khác"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingClassesCard;
