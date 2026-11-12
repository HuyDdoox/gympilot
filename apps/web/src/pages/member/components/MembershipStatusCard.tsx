import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ArrowRight } from 'lucide-react';
import { memberMockData } from '../mockData';

export const MembershipStatusCard: React.FC = () => {
  const { membership } = memberMockData.user;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900 text-white p-5 border border-emerald-700/60 shadow-xl flex flex-col justify-between min-h-[170px] w-full lg:w-72 shrink-0">
      {/* Crown Watermark Icon */}
      <Crown className="w-24 h-24 text-emerald-400/15 absolute -right-2 -bottom-2 pointer-events-none" />

      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <span className="text-xs font-medium text-emerald-200">Gói tập hiện tại</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-bold shadow-xs">
          {membership.status}
        </span>
      </div>

      {/* Main Info */}
      <div className="my-2 relative z-10">
        <h4 className="text-xl font-bold tracking-tight text-white mb-1">
          {membership.type}
        </h4>
        <p className="text-xs text-emerald-200/90 font-medium">
          Hết hạn vào: <span className="font-semibold text-white">{membership.expiresAt}</span>
        </p>
      </div>

      {/* Footer Link */}
      <div className="relative z-10 pt-1">
        <Link
          to="/member/my-membership"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-white transition-colors group"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default MembershipStatusCard;
