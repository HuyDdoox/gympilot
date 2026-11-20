import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Dumbbell, Heart, Check, ArrowRight } from 'lucide-react';
import { cn, formatVND } from '@/lib/utils';
import { type MembershipPlanItem } from '@/features/member/data';

export interface MembershipPlanCardProps {
  plan: MembershipPlanItem;
}

export const MembershipPlanCard: React.FC<MembershipPlanCardProps> = ({ plan }) => {
  const renderIcon = () => {
    switch (plan.iconType) {
      case 'calendar':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80">
            <Calendar className="w-5 h-5" />
          </div>
        );
      case 'award':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
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
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200/80">
            <Heart className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
            <Calendar className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all duration-200 relative group',
        plan.isPopular
          ? 'border-2 border-emerald-500 shadow-md ring-2 ring-emerald-500/10'
          : 'border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md'
      )}
    >
      {/* Top Badge (if any) */}
      {plan.badge && (
        <span
          className={cn(
            'absolute top-3.5 right-3.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full select-none',
            plan.isPopular
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 border border-slate-200'
          )}
        >
          {plan.badge}
        </span>
      )}

      {/* Plan Header */}
      <div>
        <div className="mb-3.5">{renderIcon()}</div>
        <h4 className="text-base font-bold text-slate-900 mb-1 leading-snug">{plan.name}</h4>
        <p className="text-xs text-slate-500 mb-3 leading-relaxed">{plan.subtitle}</p>

        {plan.price !== undefined && plan.price > 0 && (
          <div className="mb-4 pb-3 border-b border-slate-100">
            <span className="text-lg sm:text-xl font-extrabold text-slate-900">
              {formatVND(plan.price)}
            </span>
            <span className="text-[11px] text-slate-500 font-medium ml-1">/chu kỳ</span>
          </div>
        )}

        {/* Benefits Checklist */}
        <ul className="space-y-2 mb-6">
          {plan.benefits.map((benefitText) => (
            <li key={benefitText} className="flex items-start gap-2 text-xs text-slate-600 leading-snug">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{benefitText}</span>
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
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-[0.98]'
            : 'border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 bg-slate-50/50 hover:bg-emerald-50/50'
        )}
      >
        <span>Đăng ký ngay</span>
        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
      </Link>
    </div>
  );
};

export default MembershipPlanCard;
