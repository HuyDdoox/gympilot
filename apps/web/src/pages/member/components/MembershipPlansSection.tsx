import React from 'react';

import { memberMockData } from '../mockData';
import { MembershipPlanCard } from './MembershipPlanCard';

export const MembershipPlansSection: React.FC = () => {
  const { membershipPlans } = memberMockData;

  return (
    <section className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">👑</span>
        <h3 className="text-base font-bold text-slate-900">
          Gói đăng ký phù hợp với bạn
        </h3>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {membershipPlans.map((plan) => (
          <MembershipPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
};

export default MembershipPlansSection;
