import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers,
  Calendar,
  CreditCard,
  Crown,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { formatVND } from '@/lib/utils';
import { useMembershipPlans } from '@/features/member/hooks/useMemberData';
import {
  memberUserProfileData,
  paymentTransactionsData,
} from '@/features/member/data';
import {
  Card,
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui';

export interface MyMembershipPageProps {
  defaultTab?: 'plans' | 'payments';
}

export const MyMembershipPage: React.FC<MyMembershipPageProps> = ({ defaultTab }) => {
  const location = useLocation();
  const isPaymentRoute = location.pathname.includes('/payments') || defaultTab === 'payments';
  const [activeTab, setActiveTab] = useState<'plans' | 'payments'>(
    isPaymentRoute ? 'payments' : 'plans'
  );

  useEffect(() => {
    if (location.pathname.includes('/payments')) {
      setActiveTab('payments');
    } else if (location.pathname.includes('/my-membership')) {
      setActiveTab('plans');
    }
  }, [location.pathname]);

  const user = memberUserProfileData;
  const { membership } = user;
  const { data: membershipPlans = [] } = useMembershipPlans();
  const paymentHistory = paymentTransactionsData;

  const [renewNotice, setRenewNotice] = useState<string | null>(null);

  const handleRenewClick = () => {
    setRenewNotice(
      'Yêu cầu gia hạn đã được ghi nhận trên giao diện. Cổng thanh toán trực tuyến tự động (MoMo / VNPay) sẽ chính thức hoạt động khi Backend API /api/payments được triển khai trong Sprint 2. Bạn có thể thanh toán trực tiếp tại quầy lễ tân.'
    );
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
                {activeTab === 'payments' ? 'Lịch sử thanh toán & Hóa đơn' : 'Gói tập & Quyền lợi hội viên'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'payments'
                  ? 'Theo dõi biên lai giao dịch và hóa đơn thanh toán gói tập'
                  : 'Quản lý quyền lợi thẻ hội viên GymPilot và lựa chọn nâng cấp gói tập'}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRenewClick}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs font-semibold text-xs"
          >
            Gia hạn gói tập
          </Button>
        </div>

        {/* View Switcher Sub-tabs */}
        <div className="flex items-center gap-2 bg-slate-100/80 p-1 rounded-xl w-fit border border-slate-200/80">
          <Link
            to="/member/my-membership"
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'plans'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Gói tập của tôi</span>
          </Link>
          <Link
            to="/member/payments"
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'payments'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Lịch sử thanh toán ({paymentHistory.length})</span>
          </Link>
        </div>

        {renewNotice && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5 shadow-xs animate-in fade-in duration-200">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{renewNotice}</div>
          </div>
        )}

        {/* 1. Current Membership Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main Plan Card (2 Cols) */}
          <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-6 sm:p-8 border border-emerald-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            <Crown className="w-52 h-52 text-emerald-400/10 absolute -right-6 -bottom-6 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  <Crown className="w-3.5 h-3.5" />
                  Gói tập hiện tại
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-bold shadow-xs">
                  {membership.status}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                {membership.type}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed max-w-lg mb-6">
                Bạn đang được sử dụng toàn bộ tiện ích phòng gym, lớp Yoga, Pilates và tủ đồ cá nhân không giới hạn.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-emerald-800/80 text-xs">
                <div>
                  <span className="block text-emerald-300/80 text-[11px]">Ngày bắt đầu</span>
                  <span className="font-semibold text-white">{membership.startDate}</span>
                </div>
                <div>
                  <span className="block text-emerald-300/80 text-[11px]">Ngày hết hạn</span>
                  <span className="font-semibold text-white">{membership.expiresAt}</span>
                </div>
                <div>
                  <span className="block text-emerald-300/80 text-[11px]">Thời hạn còn lại</span>
                  <span className="font-bold text-emerald-400">{membership.daysLeft} ngày</span>
                </div>
                <div>
                  <span className="block text-emerald-300/80 text-[11px]">Số buổi đã tập</span>
                  <span className="font-semibold text-white">
                    {membership.sessionsUsed} / {membership.totalSessions} buổi
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative z-10 pt-4">
              <div className="flex justify-between text-[11px] text-emerald-200/90 mb-1.5 font-medium">
                <span>Tiến độ sử dụng</span>
                <span>40% chu kỳ gói</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-emerald-950 border border-emerald-800 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-[40%]" />
              </div>
            </div>
          </div>

          {/* Quick Perks Summary (1 Col) */}
          <Card className="bg-white border-slate-200 p-6 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Quyền lợi gói tập
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tham gia lớp học Yoga &amp; Pilates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sử dụng máy móc &amp; tạ khu vực Gym</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Check-in tiện lợi qua mã QR</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tủ đồ cá nhân &amp; phòng tắm nóng lạnh</span>
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRenewClick}
              className="w-full justify-center text-slate-700 hover:text-emerald-700 hover:border-emerald-500 text-xs font-semibold"
            >
              Nâng cấp gói VIP
            </Button>
          </Card>
        </div>

        {/* 2. Payment Transaction History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Lịch sử thanh toán &amp; Hóa đơn
                </h3>
                <p className="text-xs text-slate-500">
                  Ghi nhận các giao dịch thanh toán gói tập và dịch vụ
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">3 giao dịch gần nhất</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã giao dịch</TableHead>
                <TableHead>Gói tập / Dịch vụ</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngày giao dịch</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead className="text-right">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono font-bold text-slate-900">
                    {item.code}
                  </TableCell>
                  <TableCell className="font-semibold">{item.planName}</TableCell>
                  <TableCell className="font-bold text-emerald-600">
                    {formatVND(item.amount)}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {item.method === 'BANK_TRANSFER'
                        ? 'Chuyển khoản'
                        : item.method === 'MOMO'
                        ? 'Ví MoMo'
                        : 'Tiền mặt'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="success" size="sm">
                      Thành công
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 3. Explore Other Plans (Connected with Backend Plans API) */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Các gói tập khác của GymPilot
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {membershipPlans.map((plan) => (
              <Card key={plan.id} className="bg-white border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-emerald-300 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{plan.name}</h4>
                  <p className="text-xs text-slate-500 mb-4">{plan.subtitle}</p>
                  <ul className="space-y-1.5 text-xs text-slate-600 mb-6">
                    {plan.benefits.slice(0, 3).map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRenewClick}
                  className="w-full justify-center text-xs text-slate-700 hover:text-emerald-700 hover:border-emerald-500 font-semibold"
                >
                  Đăng ký gói này
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMembershipPage;
