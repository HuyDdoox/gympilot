import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { authStorage } from '@/lib/auth';
import { memberMockData } from '../mockData';
import { MembershipStatusCard } from './MembershipStatusCard';

export const WelcomeHero: React.FC = () => {
  const loggedInUser = authStorage.getUser();
  const displayName = loggedInUser?.fullName || memberMockData.user.fullName;

  return (
    <section className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-5 w-full">
      {/* Main Welcome Hero Banner */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 sm:p-8 flex items-center justify-between border border-emerald-800/50 shadow-xl min-h-[200px]">
        {/* Left Content */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-300 mb-1.5">
            <span>Chào mừng bạn trở lại!</span>
            <span role="img" aria-label="vẫy tay">👋</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2.5">
            {displayName}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/80 mb-6 leading-relaxed max-w-md">
            Cùng GymPilot kiến tạo phiên bản khỏe mạnh hơn mỗi ngày!
          </p>

          <Link
            to="/member/class-booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <span>Bắt đầu tập luyện</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right Athlete Image */}
        <div className="hidden sm:block absolute right-0 bottom-0 top-0 w-56 lg:w-72 overflow-hidden pointer-events-none">
          <img
            src="/images/hero-fitness.svg"
            alt="Gym fitness athlete"
            className="w-full h-full object-cover object-right-bottom opacity-90 drop-shadow-xl"
          />
        </div>
      </div>

      {/* Right Membership Status Card */}
      <MembershipStatusCard />
    </section>
  );
};

export default WelcomeHero;
