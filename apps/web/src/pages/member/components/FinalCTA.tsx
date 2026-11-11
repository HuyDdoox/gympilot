import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-950 text-white p-6 sm:p-8 border border-emerald-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Left: Brand & Copy */}
      <div className="flex items-start sm:items-center gap-3.5 max-w-xl z-10">
        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-white leading-tight">
            Bắt đầu hành trình khỏe mạnh cùng GymPilot!
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200/80 mt-1 leading-relaxed">
            Đăng ký ngay hôm nay để trải nghiệm những tiện ích tuyệt vời nhất.
          </p>
        </div>
      </div>

      {/* Center Background Dumbbells Illustration */}
      <div className="hidden lg:block absolute right-48 top-0 bottom-0 w-64 pointer-events-none opacity-85">
        <img
          src="/images/cta-dumbbells.svg"
          alt="Gym Dumbbells"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Right: Light Green CTA Button */}
      <div className="z-10 w-full sm:w-auto text-right">
        <Link
          to="/member/my-membership"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-400/25 transition-all transform hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
        >
          <span>Đăng ký ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default FinalCTA;
