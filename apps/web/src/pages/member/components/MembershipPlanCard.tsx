import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Dumbbell, Heart, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MembershipPlanItem } from '../mockData';

export interface MembershipPlanCardProps {
  plan: MembershipPlanItem;
}

export const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({ plan }) => {
  const renderIcon = () => {
    switch (plan.iconType) {
      case 'calendar':
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case 'award':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
            <Award className="w-5 h-5" />
          </div>
        );
      case 'dumbbell':
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <Dumbbell className="w-5 h-5" />
          </div>
        );
      case 'heart':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
            <Heart className="w-5 h-5" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 relative',
        plan.isPopular
          ? 'border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
          : 'border-slate-100 shadow-xs hover:border-slate-300'
      )}
    >
      {/* Top Badge (if any) */}
      {plan.badge && (
        <span
          className={cn(
            'absolute top-3.5 right-3.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full',
            plan.isPopular
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700'
          )}
        >
          {plan.badge}
        </span>
      )}

      {/* Plan Header */}
      <div>
        <div className="mb-3">{renderIcon()}</div>
        <h4 className="text-sm font-bold text-slate-900 mb-0.5">{plan.name}</h4>
        <p className="text-xs text-slate-500 mb-4">{plan.subtitle}</p>

        {/* Benefits Checklist */}
        <ul className="space-y-2 mb-6">
          {plan.benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-xs text-slate-700">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 stroke-[2.5]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <Link
        to="/member/my-membership"
        className={cn(
          'w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-150',
          plan.isPopular
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
            : 'border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 bg-slate-50/50 hover:bg-emerald-50/50'
        )}
      >
        <span>Đăng ký ngay</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default MembershipPlanCard;
