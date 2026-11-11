import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';

export const MyQrPage: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-slate-900">Mã QR Check-in</h1>
          <p className="text-xs text-slate-500">Mã check-in điểm danh cá nhân tại phòng gym</p>
        </div>
      </div>

      <Card className="bg-white border-slate-200/80 text-slate-800 max-w-md mx-auto text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 text-emerald-600">
            <QrCode className="w-5 h-5" />
            <CardTitle className="text-slate-900">Mã QR của bạn</CardTitle>
          </div>
          <CardDescription>
            Đưa mã này cho lễ tân hoặc quét tại cửa để điểm danh vào lớp
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-md">
            <img src="/images/qr-code.svg" alt="QR Code" className="w-48 h-48" />
          </div>
          <p className="text-xs text-slate-500 mt-4">
            Mã định danh cá nhân liên kết với tài khoản hội viên của bạn
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyQrPage;
