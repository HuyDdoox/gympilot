import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

export const ClassBookingPage: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-slate-900">Đặt lớp &amp; Lịch tập</h1>
          <p className="text-xs text-slate-500">Xem danh sách lớp học và đăng ký ca tập</p>
        </div>
      </div>

      <Card className="bg-white border-slate-200/80 text-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2 text-emerald-600">
            <Calendar className="w-5 h-5" />
            <CardTitle className="text-slate-900">Lịch lớp đang mở đăng ký</CardTitle>
          </div>
          <CardDescription>
            Chọn ngày và huấn luyện viên phù hợp để rèn luyện cùng GymPilot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Tính năng đặt lớp chi tiết đang được đồng bộ với Backend API của Huy trong Sprint 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassBookingPage;
