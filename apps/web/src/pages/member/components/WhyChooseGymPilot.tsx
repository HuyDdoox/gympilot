import React from 'react';
import { Dumbbell, Calendar, ShieldCheck, Bell, TrendingUp, CheckCircle2 } from 'lucide-react';
import { memberMockData, type WhyChooseItem } from '../mockData';

export const WhyChooseGymPilot: React.FC = () => {
  const { whyChooseUs } = memberMockData;

  const renderIcon = (type: WhyChooseItem['iconType']) => {
    switch (type) {
      case 'dumbbell':
        return <Dumbbell className="w-5 h-5" />;
      case 'calendar':
        return <Calendar className="w-5 h-5" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5" />;
      case 'bell':
        return <Bell className="w-5 h-5" />;
      case 'chart':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Dumbbell className="w-5 h-5" />;
    }
  };

  return (
    <section className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
        <h3 className="text-base font-bold text-slate-900">
          Tại sao nên chọn GymPilot?
        </h3>
      </div>

      {/* 5 Columns Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {whyChooseUs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col items-center text-center hover:border-emerald-200 hover:shadow-sm transition-all duration-200"
          >
            {/* Green Icon Box */}
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-100/60">
              {renderIcon(item.iconType)}
            </div>

            {/* Title & Desc */}
            <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
              {item.title}
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseGymPilot;
