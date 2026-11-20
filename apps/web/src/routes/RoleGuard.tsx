import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import type { Role } from '@gympilot/shared';
import { authStorage } from '../lib/auth';
import { Button } from '@/components/ui';

interface RoleGuardProps {
  allowedRoles: Role[];
  userRole?: Role;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, userRole }) => {
  const effectiveRole = userRole || authStorage.getUserRole() || undefined;

  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              403 - Giới hạn quyền truy cập
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Tài khoản của bạn ({effectiveRole || 'Khách'}) không có quyền hạn truy cập vào khu vực này. Khu vực này chỉ dành cho vai trò: {allowedRoles.join(', ')}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Link to="/" className="flex-1">
              <Button variant="outline" size="md" className="w-full text-xs font-semibold">
                <Home className="w-4 h-4 mr-1.5" />
                Về trang chủ
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={() => window.history.back()}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RoleGuard;
