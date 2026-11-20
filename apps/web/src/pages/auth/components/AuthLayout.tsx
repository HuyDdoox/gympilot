import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg';
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  className,
  maxWidth = 'md',
}) => {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[maxWidth];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Bar with Brand Logo */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform text-white">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Gym<span className="text-emerald-500">Pilot</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Bảo mật dữ liệu chuẩn SaaS</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex items-center justify-center py-8">
        <div className={cn('w-full space-y-6', maxWidthClass, className)}>
          {/* Page Heading */}
          <div className="text-center space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Render Children (Form Card) */}
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto pt-6 text-center text-xs text-slate-400 border-t border-slate-200/60">
        © 2026 GymPilot. Nền tảng quản lý phòng tập thông minh.
      </footer>
    </div>
  );
};

export default AuthLayout;
