import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Home,
  Calendar,
  CalendarCheck,
  Layers,
  CreditCard,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authStorage } from '@/lib/auth';
import { NotificationDropdown } from './NotificationDropdown';
import { memberMockData } from '@/pages/member/mockData';

export interface MemberHeaderProps {
  className?: string;
}

export const MemberHeader: React.FC<MemberHeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const token = authStorage.getToken();
  const rawUser = authStorage.getUser();
  const isAuthenticated = Boolean(token);
  const user = rawUser || memberMockData.user;

  const handleLogout = () => {
    authStorage.clearToken();
    navigate('/login');
  };

  const navItems = [
    { label: 'Trang chủ', to: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Hội viên (Supabase)', to: '/members', icon: <User className="w-4 h-4" /> },
    { label: 'Lịch tập', to: '/member/class-booking', icon: <Calendar className="w-4 h-4" /> },
    { label: 'Đặt lớp', to: '/member/class-booking', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: 'Gói tập', to: '/member/my-membership', icon: <Layers className="w-4 h-4" /> },
    { label: 'Thanh toán', to: '/member/my-membership', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <header className={cn('sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs h-16 px-4 sm:px-6 lg:px-8', className)}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: GymPilot Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Gym<span className="text-emerald-500">Pilot</span>
          </span>
        </Link>

        {/* Center: Horizontal Pill Navigation Bar (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60 text-xs font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/member/dashboard'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-150',
                  isActive
                    ? 'bg-emerald-100/80 text-emerald-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100/70'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Notification Button with Pill style */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-150',
                isNotifOpen
                  ? 'bg-emerald-100/80 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-100/70'
              )}
            >
              <Bell className="w-4 h-4" />
              <span>Thông báo</span>
              <span className="ml-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                2
              </span>
            </button>

            {/* Notification Dropdown Card */}
            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              notifications={memberMockData.notifications}
              onViewAll={() => {
                setIsNotifOpen(false);
              }}
            />
          </div>
        </nav>

        {/* Right: User Profile & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile notification toggle */}
          <div className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                2
              </span>
            </button>
            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              notifications={memberMockData.notifications}
            />
          </div>

          {/* Right Action: Login button for Guest OR User Profile for Authenticated */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <img
                  src={(user && 'avatar' in user && typeof (user as { avatar?: string }).avatar === 'string') ? (user as { avatar: string }).avatar : memberMockData.user.avatar}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                  {user.fullName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-800">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                    {rawUser?.role && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                        Vai trò: {rawUser.role}
                      </span>
                    )}
                  </div>

                  {rawUser?.role === 'OWNER' && (
                    <Link
                      to="/owner/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 font-medium"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Trang Quản trị (Owner)</span>
                    </Link>
                  )}

                  {rawUser?.role === 'STAFF' && (
                    <Link
                      to="/staff/today"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 font-medium"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Bàn làm việc Lễ tân</span>
                    </Link>
                  )}

                  <Link
                    to="/member/my-membership"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                  >
                    <User className="w-4 h-4" />
                    <span>Hồ sơ &amp; Gói tập</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs shadow-emerald-500/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Mobile hamburger menu */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-xl p-4 z-40 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium',
                    isActive
                      ? 'bg-emerald-100/80 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  )
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default MemberHeader;
