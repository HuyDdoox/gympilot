import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Menu, LogOut, User } from 'lucide-react';
import { authStorage } from '@/lib/auth';

export interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const user = authStorage.getUser();
  const userRole = authStorage.getUserRole();

  const handleLogout = () => {
    authStorage.clearToken();
    navigate('/login');
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case 'OWNER':
        return 'Chủ phòng';
      case 'STAFF':
        return 'Nhân viên';
      case 'TRAINER':
        return 'HLV';
      case 'MEMBER':
        return 'Hội viên';
      default:
        return 'Quản trị';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Mobile menu toggle & Logo */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Mở danh mục điều hướng"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:inline">
            Gym<span className="text-emerald-400">Pilot</span>
          </span>
        </Link>
      </div>

      {/* Right section: User info & Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {user ? (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold text-xs border border-emerald-500/30">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-slate-200 leading-tight">
                {user.fullName || user.email}
              </p>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">
                {getRoleBadge(userRole)}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 px-2.5 py-1 rounded-lg bg-slate-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{getRoleBadge(userRole)}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Đăng xuất khỏi hệ thống"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
