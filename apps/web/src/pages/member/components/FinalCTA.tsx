import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowRight, Sparkles } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 sm:p-10 border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left: Brand & Copy */}
      <div className="flex items-start sm:items-center gap-4 max-w-xl z-10">
        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          <Dumbbell className="w-7 h-7" />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đồng hành cùng hơn 2.500+ hội viên</span>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white leading-tight">
            Bắt đầu hành trình khỏe mạnh cùng GymPilot!
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 leading-relaxed">
            Đăng ký gói tập ngay hôm nay để trải nghiệm môi trường tập luyện chuẩn boutique đẳng cấp.
          </p>
        </div>
      </div>

      {/* Center-Right 3D Studio Equipment Render */}
      <div className="hidden lg:block absolute right-48 top-0 bottom-0 w-72 pointer-events-none overflow-hidden">
        <img
          src="/images/gympilot-equipment-3d.jpg"
          alt="GymPilot Premium Equipment"
          className="w-full h-full object-cover object-center drop-shadow-2xl [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] opacity-90"
          loading="lazy"
        />
      </div>

      {/* Right: CTA Button */}
      <div className="z-10 w-full sm:w-auto text-right shrink-0">
        <Link
          to="/member/my-membership"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-400/25 transition-all transform hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
        >
          <span>Đăng ký gói tập ngay</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
