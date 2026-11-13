import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  QrCode,
  FileBarChart,
  Layers,
  Dumbbell,
  Clock,
  X,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authStorage } from '@/lib/auth';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  to: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const currentRole = authStorage.getUserRole();

  const navigationGroups: NavGroup[] = [
    {
      group: 'Tổng quan & Khách hàng',
      items: [
        {
          title: 'Trang chủ Landing',
          to: '/',
          icon: <Compass className="w-4 h-4" />,
        },
        {
          title: 'Hội viên (Supabase)',
          to: '/members',
          icon: <Users className="w-4 h-4" />,
        },
      ],
    },
    {
      group: 'Quản lý (Owner)',
      items: [
        {
          title: 'Bảng điều khiển',
          to: '/owner/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: ['OWNER'],
        },
        {
          title: 'Quản lý hội viên',
          to: '/owner/members',
          icon: <Users className="w-4 h-4" />,
          roles: ['OWNER'],
        },
        {
          title: 'Lịch & Loại lớp',
          to: '/owner/classes',
          icon: <CalendarDays className="w-4 h-4" />,
          roles: ['OWNER'],
        },
        {
          title: 'Gói tập gym',
          to: '/owner/plans',
          icon: <Layers className="w-4 h-4" />,
          roles: ['OWNER'],
        },
        {
          title: 'Thanh toán & Thu tiền',
          to: '/owner/payments',
          icon: <CreditCard className="w-4 h-4" />,
          roles: ['OWNER'],
        },
        {
          title: 'Báo cáo & Thống kê',
          to: '/owner/reports',
          icon: <FileBarChart className="w-4 h-4" />,
          roles: ['OWNER'],
        },
      ],
    },
    {
      group: 'Lễ tân & Vận hành (Staff)',
      items: [
        {
          title: 'Lịch trực hôm nay',
          to: '/staff/today',
          icon: <Clock className="w-4 h-4" />,
          roles: ['OWNER', 'STAFF'],
        },
        {
          title: 'Quét QR Check-in',
          to: '/staff/check-in',
          icon: <QrCode className="w-4 h-4" />,
          roles: ['OWNER', 'STAFF'],
        },
      ],
    },
    {
      group: 'Huấn luyện viên (Trainer)',
      items: [
        {
          title: 'Lớp được phân công',
          to: '/trainer/my-classes',
          icon: <Dumbbell className="w-4 h-4" />,
          roles: ['OWNER', 'TRAINER'],
        },
      ],
    },
    {
      group: 'Hội viên (Member)',
      items: [
        {
          title: 'Khu vực hội viên',
          to: '/member/dashboard',
          icon: <LayoutDashboard className="w-4 h-4" />,
          roles: ['MEMBER', 'OWNER'],
        },
        {
          title: 'Đặt lịch lớp',
          to: '/member/class-booking',
          icon: <CalendarDays className="w-4 h-4" />,
          roles: ['MEMBER', 'OWNER'],
        },
        {
          title: 'Gói tập của tôi',
          to: '/member/my-membership',
          icon: <Layers className="w-4 h-4" />,
          roles: ['MEMBER', 'OWNER'],
        },
        {
          title: 'Mã QR cá nhân',
          to: '/member/my-qr',
          icon: <QrCode className="w-4 h-4" />,
          roles: ['MEMBER', 'OWNER'],
        },
      ],
    },
  ];

  // Filter items according to active role (if user has no role set yet, display all for navigation during MVP setup)
  const isItemVisible = (item: NavItem) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!currentRole) return true;
    return item.roles.includes(currentRole);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-16 z-40 lg:z-20 h-screen lg:h-[calc(100vh-4rem)] w-64 shrink-0 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile Header in Drawer */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">GymPilot</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navigationGroups.map((group) => {
            const visibleItems = group.items.filter(isItemVisible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.group}>
                <h4 className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.group}
                </h4>
                <ul className="space-y-1">
                  {visibleItems.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        onClick={() => {
                          if (window.innerWidth < 1024) onClose();
                        }}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150',
                            isActive
                              ? 'bg-emerald-500/15 text-emerald-400 font-semibold border-l-2 border-emerald-400'
                              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                          )
                        }
                      >
                        {item.icon}
                        <span className="truncate">{item.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
          GymPilot MVP v1.0
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
