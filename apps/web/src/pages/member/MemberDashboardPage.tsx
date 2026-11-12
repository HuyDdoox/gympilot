import React from 'react';
import { Sparkles, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authStorage } from '@/lib/auth';
import { WelcomeHero } from './components/WelcomeHero';
import { UpcomingClassesCard } from './components/UpcomingClassesCard';
import { QuickCheckInCard } from './components/QuickCheckInCard';
import { WeeklyActivityCard } from './components/WeeklyActivityCard';
import { FeaturedClassesSection } from './components/FeaturedClassesSection';
import { MembershipPlansSection } from './components/MembershipPlansSection';
import { WhyChooseGymPilot } from './components/WhyChooseGymPilot';
import { MemberTestimonials } from './components/MemberTestimonials';
import { FinalCTA } from './components/FinalCTA';

export const MemberDashboardPage: React.FC = () => {
  const token = authStorage.getToken();
  const isAuthenticated = Boolean(token);

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        {/* Guest Demo Mode Notice */}
        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-950 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Chế độ xem trước (Demo Mode):</strong> Bạn đang xem giao diện mẫu của hội viên. Hãy đăng nhập để lưu lịch tập và quản lý gói tập thật.
              </span>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shrink-0 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập ngay</span>
            </Link>
          </div>
        )}

        {/* 1. Welcome Hero & Membership Status */}
        <WelcomeHero />

        {/* 2. Three Cards Row: Upcoming Classes, Quick QR Check-in, Weekly Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          <UpcomingClassesCard />
          <QuickCheckInCard />
          <WeeklyActivityCard />
        </div>

        {/* 3. Featured Classes & Side Notifications */}
        <FeaturedClassesSection />

        {/* 4. Membership Plans */}
        <MembershipPlansSection />

        {/* 5. Why Choose GymPilot */}
        <WhyChooseGymPilot />

        {/* 6. Member Testimonials */}
        <MemberTestimonials />

        {/* 7. Final Call to Action Banner */}
        <FinalCTA />
      </div>
    </div>
  );
};

export default MemberDashboardPage;
