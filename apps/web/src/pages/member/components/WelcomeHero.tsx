import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { authStorage } from '@/lib/auth';
import { memberUserProfileData } from '@/features/member/data';
import { MembershipStatusCard } from './MembershipStatusCard';

export const WelcomeHero: React.FC = () => {
  const loggedInUser = authStorage.getUser();
  const displayName = loggedInUser?.fullName || memberUserProfileData.fullName;

  return (
    <section className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-5 w-full">
      {/* Main Welcome Hero Banner */}
      <div className="flex-1 relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 flex items-center justify-between border border-emerald-800/60 shadow-xl min-h-[200px]">
        {/* Left Content */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-300 mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Chào mừng bạn trở lại!</span>
            <span role="img" aria-label="vẫy tay">👋</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            {displayName}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 mb-6 leading-relaxed max-w-md">
            Cùng GymPilot kiến tạo phiên bản khỏe mạnh, dẻo dai và tràn đầy năng lượng mỗi ngày!
          </p>

          <Link
            to="/member/class-booking"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <span>Bắt đầu tập luyện</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right 3D Brand Mascot */}
        <div className="hidden sm:block absolute right-0 bottom-0 top-0 w-64 lg:w-80 overflow-hidden pointer-events-none">
          <img
            src="/images/gympilot-mascot-3d.jpg"
            alt="GymPilot 3D Coach Mascot"
            className="w-full h-full object-cover object-top drop-shadow-2xl [mask-image:linear-gradient(to_left,black_70%,transparent_100%)] opacity-95"
            loading="lazy"
          />
        </div>
      </div>

      {/* Right Membership Status Card */}
      <MembershipStatusCard />
    </section>
  );
};

export default WelcomeHero;
