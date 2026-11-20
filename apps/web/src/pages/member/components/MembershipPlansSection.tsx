import React from 'react';
import { Crown, Sparkles } from 'lucide-react';
import { useMembershipPlans } from '@/features/member/hooks/useMemberData';
import { MembershipPlanCard } from './MembershipPlanCard';
import { Skeleton } from '@/components/ui';

export const MembershipPlansSection: React.FC = () => {
  const { data: membershipPlans = [], isLoading } = useMembershipPlans();

  return (
    <section className="space-y-4 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
            <Crown className="w-4 h-4 text-emerald-600 fill-emerald-500" />
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Gói đăng ký phù hợp với bạn
          </h3>
        </div>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Linh hoạt theo tháng, quý và buổi tập</span>
        </span>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-10 rounded-xl mt-6" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {membershipPlans.map((plan) => (
            <MembershipPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </section>
  );
};

export default MembershipPlansSection;
