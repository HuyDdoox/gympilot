import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

export const MyMembershipPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/member/dashboard"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-colors"
          aria-label="Về trang chủ hội viên"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gói tập &amp; Thanh toán</h1>
          <p className="text-xs text-slate-500">Quản lý trạng thái membership và lịch sử giao dịch</p>
        </div>
      </div>

      <Card className="bg-white border-slate-200/80 text-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2 text-emerald-600">
            <Layers className="w-5 h-5" />
            <CardTitle className="text-slate-900">Thông tin gói tập hiện tại</CardTitle>
          </div>
          <CardDescription>
            Chi tiết gói Premium Membership và hạn sử dụng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Tính năng gia hạn gói tập và thanh toán tự động đang được chuẩn bị cho Sprint 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyMembershipPage;
