import React from 'react';
import { Activity, ChevronDown } from 'lucide-react';
import { memberMockData } from '../mockData';

export const WeeklyActivityCard: React.FC = () => {
  const { weeklyActivity } = memberMockData;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between min-h-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900">Hoạt động trong tuần</h3>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/70 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <span>Tuần này</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Main Metric & Progress */}
      <div className="my-1">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {weeklyActivity.completedClasses} / {weeklyActivity.targetClasses}
          </span>
          <span className="text-xs text-slate-500 font-medium">lớp đã tham gia</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden my-3">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${weeklyActivity.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Encouragement Box */}
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 flex items-center gap-2 text-xs text-amber-900 font-medium">
        <span className="text-sm">🎉</span>
        <span className="leading-snug">{weeklyActivity.encouragementMessage}</span>
      </div>
    </div>
  );
};

export default WeeklyActivityCard;
