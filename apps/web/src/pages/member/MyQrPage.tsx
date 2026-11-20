import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Info,
  ShieldCheck,
} from 'lucide-react';
import {
  memberUserProfileData,
  checkInHistoryData,
} from '@/features/member/data';
import {
  Card,
  CardContent,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

export const MyQrPage: React.FC = () => {
  const user = memberUserProfileData;
  const checkInHistory = checkInHistoryData;
  const [copied, setCopied] = useState(false);

  const qrTokenCode = 'GP-MEMBER-VYAN-884920';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrTokenCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition-colors shadow-xs"
              aria-label="Về trang chủ"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Mã QR Check-in
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Thẻ hội viên kỹ thuật số dùng để điểm danh vào lớp và cửa ra vào
              </p>
            </div>
          </div>

          <Link
            to="/member/class-booking"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Xem lịch tập</span>
          </Link>
        </div>

        {/* 1. Main Grid: Digital QR Pass + Check-in Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Digital QR Pass (1 Col) */}
          <Card className="bg-white border-slate-200/90 shadow-md rounded-3xl overflow-hidden text-center">
            {/* Top Pass Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
              <div className="w-16 h-16 rounded-full border-2 border-white/80 mx-auto overflow-hidden shadow-md mb-2.5 bg-white">
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-extrabold text-base text-white leading-tight">{user.fullName}</h3>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">{user.membership.type}</p>
              <div className="mt-2.5 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Thẻ hội viên hợp lệ</span>
              </div>
            </div>

            {/* QR Area */}
            <CardContent className="p-6 flex flex-col items-center">
              <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-emerald-300 shadow-xs mb-3">
                <img
                  src="/images/qr-code.svg"
                  alt="QR Code Check-in GymPilot"
                  className="w-44 h-44 object-contain"
                  loading="lazy"
                />
              </div>

              {/* Token code pill */}
              <div className="w-full flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-4">
                <span className="font-mono font-bold text-slate-800">{qrTokenCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs">
                Mã QR được mã hóa theo tài khoản của bạn. Đưa mã vào máy quét tại cửa để mở cửa và ghi nhận buổi tập tự động.
              </p>
            </CardContent>
          </Card>

          {/* Right: Check-in instructions & Fast Guidelines (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3.5 flex items-center gap-2 tracking-tight">
                <Info className="w-5 h-5 text-emerald-600" />
                <span>Hướng dẫn check-in tại phòng tập</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Mở mã QR</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Truy cập trang này trên điện thoại khi đến cơ sở GymPilot.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Quét mã tại cửa</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Đưa màn hình trước máy quét hoặc quầy lễ tân để ghi nhận.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">Vào phòng tập</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Cửa tự động mở và buổi tập được tính vào tiến độ tuần của bạn.
                  </p>
                </div>
              </div>
            </Card>

            {/* Check-in History Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <Clock className="w-4 h-4 text-emerald-600" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Lịch sử check-in gần đây
                    </h3>
                    <p className="text-xs text-slate-500">Các lần điểm danh ra vào phòng tập</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">4 lần gần nhất</span>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Lớp / Hoạt động</TableHead>
                    <TableHead>Địa điểm</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkInHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.date}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-slate-600">{item.time}</TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {item.className}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {item.method === 'QR_CODE' ? 'Quét QR' : 'Thủ công'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success" size="sm">
                          Hợp lệ
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyQrPage;
