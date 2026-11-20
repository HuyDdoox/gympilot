import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authStorage } from '@/lib/auth';
import { authService } from '@/lib/authService';
import { NotificationDropdown } from './NotificationDropdown';
import {
  memberNavigationData,
  memberUserProfileData,
  notificationsData,
} from '@/features/member/data';

export interface MemberHeaderProps {
  className?: string;
}

export const MemberHeader: React.FC<MemberHeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Reactive Auth State
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [currentUser, setCurrentUser] = useState(() => authStorage.getUser());

  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync auth state reactively on window events or route changes
  useEffect(() => {
    const handleAuthChange = () => {
      setToken(authStorage.getToken());
      setCurrentUser(authStorage.getUser());
    };

    window.addEventListener('gympilot_auth_changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    // Initial check
    handleAuthChange();

    return () => {
      window.removeEventListener('gympilot_auth_changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [location.pathname]);

  // Close menus on route change
  useEffect(() => {
    setIsNotifOpen(false);
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAuthenticated = Boolean(token);
  const displayUser = currentUser || memberUserProfileData;

  // Single-item exact active evaluator: avoids multi-active items
  const isNavItemActive = (itemTo: string) => {
    const currentPath = location.pathname;
    if (itemTo === '/') {
      return (
        currentPath === '/' ||
        currentPath === '/member' ||
        currentPath === '/member/dashboard'
      );
    }
    return currentPath === itemTo;
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    try {
      await authService.logout();
    } catch {
      authStorage.clearToken();
    }
    navigate('/login');
  };

  const getNavIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="w-4 h-4 shrink-0" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 shrink-0" />;
      case 'calendar-check':
        return <CalendarCheck className="w-4 h-4 shrink-0" />;
      case 'layers':
        return <Layers className="w-4 h-4 shrink-0" />;
      case 'credit-card':
        return <CreditCard className="w-4 h-4 shrink-0" />;
      default:
        return <Home className="w-4 h-4 shrink-0" />;
    }
  };

  // Select navigation list according to auth state
  // GUEST: Only Trang chủ & Đặt lớp
  // MEMBER: Trang chủ, Lịch tập, Đặt lớp, Gói tập (NO Thanh toán on header)
  const navItems = isAuthenticated
    ? memberNavigationData.memberNav
    : memberNavigationData.guestNav;

  const unreadCount = notificationsData.filter((n) => n.isUnread).length;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs h-16 px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Left: GymPilot Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Gym<span className="text-emerald-500">Pilot</span>
          </span>
        </Link>

        {/* Center: Dynamic Navigation Items (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-50/90 p-1.5 rounded-full border border-slate-200/80 text-xs font-semibold">
          {navItems.map((item) => {
            const active = isNavItemActive(item.to);
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-150 select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1',
                  active
                    ? 'bg-emerald-100 text-emerald-800 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100 font-medium'
                )}
              >
                {getNavIcon(item.iconName)}
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Notifications Button - ONLY for Authenticated Users */}
          {isAuthenticated && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                  isNotifOpen
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100 font-medium'
                )}
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>Thông báo</span>
                {unreadCount > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={notificationsData}
                onViewAll={() => {
                  setIsNotifOpen(false);
                  navigate('/member/profile');
                }}
              />
            </div>
          )}
        </nav>

        {/* Right Section: User Profile (Logged In) OR Login CTA (Guest) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Mobile notification toggle */}
              <div className="relative lg:hidden">
                <button
                  type="button"
                  onClick={() => setIsNotifOpen((prev) => !prev)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative cursor-pointer"
                  aria-label="Thông báo"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={isNotifOpen}
                  onClose={() => setIsNotifOpen(false)}
                  notifications={notificationsData}
                />
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-300 shrink-0">
                    {displayUser.fullName?.charAt(0) || 'H'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline truncate max-w-[130px]">
                    {displayUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900 leading-snug truncate">
                        {displayUser.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{displayUser.email}</p>
                      {currentUser?.role && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          Vai trò: {currentUser.role}
                        </span>
                      )}
                    </div>

                    {/* Role Shortcuts */}
                    {currentUser?.role === 'OWNER' && (
                      <Link
                        to="/owner/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-indigo-600 hover:bg-indigo-50 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        <span>Trang Quản trị (Owner)</span>
                      </Link>
                    )}

                    {currentUser?.role === 'STAFF' && (
                      <Link
                        to="/staff/today"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-indigo-600 hover:bg-indigo-50 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-500" />
                        <span>Bàn làm việc Lễ tân</span>
                      </Link>
                    )}

                    <Link
                      to="/member/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Hồ sơ hội viên</span>
                    </Link>

                    <Link
                      to="/member/my-membership"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Gói tập của tôi</span>
                    </Link>

                    <Link
                      to="/member/profile?tab=payments"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium"
                    >
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>Thanh toán &amp; Hóa đơn</span>
                    </Link>

                    <Link
                      to="/member/my-qr"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-emerald-600 font-medium"
                    >
                      <Dumbbell className="w-4 h-4 text-slate-400" />
                      <span>Mã QR Check-in</span>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-red-600 hover:bg-red-50 text-left font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest: Clear, single Login button with primary CTA styling */
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-500/20 transition-all select-none"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Menu điều hướng"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (Balanced, no layout jumping) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-xl p-4 z-40 animate-in slide-in-from-top duration-200">
          {isAuthenticated && (
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center border border-emerald-300 shrink-0">
                {displayUser.fullName?.charAt(0) || 'H'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-sm truncate">{displayUser.fullName}</p>
                <p className="text-xs text-slate-500 truncate">{displayUser.email}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isNavItemActive(item.to);
              return (
                <NavLink
                  key={item.id}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs transition-colors duration-150',
                    active
                      ? 'bg-emerald-100 text-emerald-800 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  )}
                >
                  {getNavIcon(item.iconName)}
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {isAuthenticated ? (
              <>
                <div className="border-t border-slate-100 my-1.5" />
                <Link
                  to="/member/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Hồ sơ hội viên</span>
                </Link>
                <Link
                  to="/member/profile?tab=payments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-medium"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Thanh toán &amp; Hóa đơn</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs text-red-600 hover:bg-red-50 font-semibold text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập tài khoản</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default MemberHeader;
