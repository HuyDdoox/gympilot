import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  Shield,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Crown,
  KeyRound,
  Layers,
  CreditCard,
  Receipt,
  CalendarDays,
  History,
  QrCode,
  Check,
  ChevronRight,
} from 'lucide-react';
import { cn, formatVND } from '@/lib/utils';
import { authStorage } from '@/lib/auth';
import {
  memberUserProfileData,
  paymentTransactionsData,
  checkInHistoryData,
  upcomingClassesData,
} from '@/features/member/data';
import {
  Card,
  Button,
  Input,
} from '@/components/ui';

type ProfileTab =
  | 'overview'
  | 'profile'
  | 'password'
  | 'membership'
  | 'payments'
  | 'transactions'
  | 'schedule'
  | 'history';

interface SidebarSection {
  title: string;
  items: {
    id: ProfileTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const sidebarSections: SidebarSection[] = [
  {
    title: 'TỔNG QUAN',
    items: [
      { id: 'overview', label: 'Tổng quan hồ sơ', icon: User },
    ],
  },
  {
    title: 'TÀI KHOẢN',
    items: [
      { id: 'profile', label: 'Thông tin cá nhân', icon: Shield },
      { id: 'password', label: 'Đổi mật khẩu', icon: KeyRound },
    ],
  },
  {
    title: 'DỊCH VỤ',
    items: [
      { id: 'membership', label: 'Gói tập của tôi', icon: Layers, badge: 'Đang dùng' },
      { id: 'payments', label: 'Thanh toán', icon: CreditCard },
      { id: 'transactions', label: 'Lịch sử giao dịch', icon: Receipt },
    ],
  },
  {
    title: 'HOẠT ĐỘNG',
    items: [
      { id: 'schedule', label: 'Lịch tập của tôi', icon: CalendarDays },
      { id: 'history', label: 'Lịch sử tham gia lớp', icon: History },
    ],
  },
];

export const MemberProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read tab from query param e.g. /member/profile?tab=payments
  const tabParam = searchParams.get('tab') as ProfileTab | null;
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    tabParam && ['overview', 'profile', 'password', 'membership', 'payments', 'transactions', 'schedule', 'history'].includes(tabParam)
      ? tabParam
      : 'overview'
  );

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleSelectTab = (tab: ProfileTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const loggedInUser = authStorage.getUser();
  const baseUser = memberUserProfileData;

  // Personal Info Form State
  const [fullName, setFullName] = useState(loggedInUser?.fullName || baseUser.fullName);
  const [email] = useState(loggedInUser?.email || baseUser.email);
  const [phone, setPhone] = useState(baseUser.phone);
  const [dateOfBirth, setDateOfBirth] = useState(baseUser.dateOfBirth);
  const [gender, setGender] = useState(baseUser.gender);
  const [goal, setGoal] = useState(baseUser.goal);
  const [emergencyContact, setEmergencyContact] = useState(baseUser.emergencyContact);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  // Payments Filter
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');

  // Handle Personal Info Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || fullName.trim().length < 2) {
      setProfileErrorMsg('Họ và tên phải có ít nhất 2 ký tự.');
      return;
    }
    if (!phone.trim() || !/^(0|\+84)[0-9]{9,10}$/.test(phone.trim())) {
      setProfileErrorMsg('Số điện thoại không hợp lệ (cần từ 10 chữ số).');
      return;
    }

    setProfileErrorMsg(null);
    if (loggedInUser) {
      authStorage.setUser({
        ...loggedInUser,
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
    }

    setProfileSuccessMsg('Cập nhật thông tin hồ sơ thành công!');
    setTimeout(() => setProfileSuccessMsg(null), 3500);
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordErrorMsg('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setPasswordErrorMsg(null);
    setPasswordSuccessMsg('Đổi mật khẩu thành công! Hãy dùng mật khẩu mới trong lần đăng nhập tiếp theo.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMsg(null), 4000);
  };

  // Filter payments
  const filteredPayments = paymentTransactionsData.filter((p) => {
    if (paymentStatusFilter === 'ALL') return true;
    return p.status === paymentStatusFilter;
  });

  const totalSpent = paymentTransactionsData
    .filter((p) => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Header / Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
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
                Hồ sơ &amp; Tài khoản hội viên
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Quản lý thông tin cá nhân, gói tập, lịch sử giao dịch và theo dõi hoạt động tập luyện
              </p>
            </div>
          </div>

          <Link
            to="/member/my-qr"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 text-xs font-bold shadow-xs"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Mã QR Check-in</span>
          </Link>
        </div>

        {/* Layout: Left Sidebar + Right Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* A. SIDEBAR BÊN TRÁI (Sticky & Modern) */}
          <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-6">
            {/* User Profile Header in Sidebar */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-xl flex items-center justify-center border-2 border-emerald-100 shadow-sm shrink-0">
                {fullName?.charAt(0) || 'H'}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-slate-900 truncate">{fullName}</h2>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{email}</p>
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Crown className="w-3 h-3 text-emerald-600" />
                    <span>{baseUser.membership.type}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Groups */}
            <nav className="space-y-4">
              {sidebarSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left select-none',
                          isActive
                            ? 'bg-emerald-500 text-white shadow-xs shadow-emerald-500/20 font-bold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-400')} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={cn(
                              'text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none',
                              isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>

          {/* B. KHU VỰC NỘI DUNG CHÍNH BÊN PHẢI */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {/* 1. TỔNG QUAN HỒ SƠ */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Profile Overview Banner */}
                <Card className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
                        Hội viên chính thức
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                        Xin chào, {fullName}!
                      </h2>
                      <p className="text-xs text-emerald-100 mt-1 max-w-lg leading-relaxed">
                        Gói tập của bạn còn <strong>{baseUser.membership.daysLeft} ngày</strong> hiệu lực. Hãy duy trì lịch tập đều đặn để đạt được mục tiêu thể hình nhé!
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectTab('profile')}
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs shrink-0"
                    >
                      Cập nhật thông tin
                    </Button>
                  </div>
                </Card>

                {/* 3 Overview Quick Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-white border-slate-200/90 p-5 rounded-2xl shadow-xs">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Gói tập hiện tại</p>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1 truncate">
                      {baseUser.membership.type}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1">
                      {baseUser.membership.status}
                    </p>
                  </Card>

                  <Card className="bg-white border-slate-200/90 p-5 rounded-2xl shadow-xs">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Hạn sử dụng</p>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {baseUser.membership.expiresAt}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Còn {baseUser.membership.daysLeft} ngày
                    </p>
                  </Card>

                  <Card className="bg-white border-slate-200/90 p-5 rounded-2xl shadow-xs">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Số buổi đã tham gia</p>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {baseUser.membership.sessionsUsed} / {baseUser.membership.totalSessions} buổi
                    </h3>
                    <p className="text-[11px] text-blue-600 font-semibold mt-1">
                      Đạt {Math.round((baseUser.membership.sessionsUsed / baseUser.membership.totalSessions) * 100)}% mục tiêu
                    </p>
                  </Card>
                </div>

                {/* Upcoming Classes Preview */}
                <Card className="bg-white border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">Lịch tập sắp tới</h3>
                    </div>
                    <button
                      onClick={() => handleSelectTab('schedule')}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Xem toàn bộ →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingClassesData.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200/80 shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                            {item.dayOfWeek}, {item.date} • {item.time}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.trainer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* 2. THÔNG TIN CÁ NHÂN */}
            {activeTab === 'profile' && (
              <Card className="bg-white border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Thông tin cá nhân hội viên</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cập nhật số điện thoại, ngày sinh và mục tiêu rèn luyện thể chất của bạn
                  </p>
                </div>

                {profileSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 shadow-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        isRequired
                        leftIcon={<User className="w-4 h-4" />}
                      />
                    </div>
                    <div>
                      <Input
                        label="Địa chỉ email (Tên tài khoản)"
                        value={email}
                        disabled
                        leftIcon={<Mail className="w-4 h-4" />}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Input
                        label="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        isRequired
                        leftIcon={<Phone className="w-4 h-4" />}
                      />
                    </div>
                    <div>
                      <Input
                        label="Ngày sinh"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        leftIcon={<Calendar className="w-4 h-4" />}
                      />
                    </div>
                    <div>
                      <Input
                        label="Giới tính"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Mục tiêu tập luyện"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      leftIcon={<Heart className="w-4 h-4" />}
                      placeholder="VD: Giảm mỡ bụng, siết cơ thon gọn, tăng độ dẻo dai..."
                    />
                  </div>

                  <div>
                    <Input
                      label="Người liên hệ khẩn cấp (Tên & Số điện thoại)"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      leftIcon={<Shield className="w-4 h-4" />}
                      placeholder="VD: Anh Nam (Chồng) - 0912 345 678"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">
                      Thông tin được bảo mật và chỉ dùng trong phạm vi GymPilot
                    </span>
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Cập nhật thông tin
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* 3. ĐỔI MẬT KHẨU */}
            {activeTab === 'password' && (
              <Card className="bg-white border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-6 animate-in fade-in duration-200">
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Thay đổi mật khẩu tài khoản</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Để bảo mật, vui lòng chọn mật khẩu mạnh gồm chữ và số
                  </p>
                </div>

                {passwordSuccessMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{passwordSuccessMsg}</span>
                  </div>
                )}

                {passwordErrorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2 shadow-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{passwordErrorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                  <div>
                    <Input
                      label="Mật khẩu hiện tại"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Nhập mật khẩu bạn đang dùng"
                      isRequired
                    />
                  </div>

                  <div>
                    <Input
                      label="Mật khẩu mới"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      isRequired
                    />
                  </div>

                  <div>
                    <Input
                      label="Xác nhận mật khẩu mới"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu mới"
                      isRequired
                    />
                  </div>

                  <div className="pt-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                    >
                      Đổi mật khẩu
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* 4. GÓI TẬP CỦA TÔI */}
            {activeTab === 'membership' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md">
                        Gói đang kích hoạt
                      </span>
                      <h3 className="text-xl font-extrabold text-white mt-2">
                        {baseUser.membership.type}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Thời hạn từ: <strong>{baseUser.membership.startDate}</strong> đến <strong>{baseUser.membership.expiresAt}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-emerald-400">
                        {baseUser.membership.daysLeft} ngày
                      </span>
                      <p className="text-[11px] text-slate-400">còn lại trong chu kỳ</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-slate-400">Tổng số buổi trong gói:</span>
                      <p className="font-bold text-white text-sm mt-0.5">
                        {baseUser.membership.totalSessions} buổi tập
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-slate-400">Đã sử dụng:</span>
                      <p className="font-bold text-white text-sm mt-0.5">
                        {baseUser.membership.sessionsUsed} buổi
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                      <span className="text-slate-400">Buổi còn lại:</span>
                      <p className="font-bold text-emerald-400 text-sm mt-0.5">
                        {baseUser.membership.totalSessions - baseUser.membership.sessionsUsed} buổi
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Quyền lợi gói tập */}
                <Card className="bg-white border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Quyền lợi thành viên</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Không giới hạn số lượt check-in khu vực Gym Free Weights</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Được tham gia đầy đủ các lớp Yoga Flow và Pilates Core</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Miễn phí tủ đồ thông minh (Smart Locker) và khăn tắm</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Được đo chỉ số InBody miễn phí định kỳ 2 tuần/lần</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Link
                      to="/member/my-membership"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs"
                    >
                      <span>Xem bảng giá &amp; Gia hạn gói</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </Card>
              </div>
            )}

            {/* 5. THANH TOÁN (Trọng tâm chuyển từ Header sang Sidebar Hồ sơ) */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Total Spent Stat Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-white border-slate-200/90 p-5 rounded-2xl shadow-xs sm:col-span-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Tổng chi tiêu tích lũy
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      {formatVND(totalSpent)}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      Toàn bộ hóa đơn gói tập và dịch vụ phát sinh tại GymPilot
                    </p>
                  </Card>

                  <Card className="bg-white border-slate-200/90 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Số lượng giao dịch
                      </p>
                      <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                        {paymentTransactionsData.length} hóa đơn
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400">Đã cập nhật theo thời gian thực</span>
                  </Card>
                </div>

                {/* Payments Table Card */}
                <Card className="bg-white border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Danh sách hóa đơn thanh toán</h3>
                      <p className="text-xs text-slate-500">Các giao dịch đã được hệ thống xác nhận thành công</p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                      <button
                        onClick={() => setPaymentStatusFilter('ALL')}
                        className={cn(
                          'px-3 py-1 rounded-lg font-semibold transition-colors',
                          paymentStatusFilter === 'ALL'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        )}
                      >
                        Tất cả ({paymentTransactionsData.length})
                      </button>
                      <button
                        onClick={() => setPaymentStatusFilter('COMPLETED')}
                        className={cn(
                          'px-3 py-1 rounded-lg font-semibold transition-colors',
                          paymentStatusFilter === 'COMPLETED'
                            ? 'bg-white text-emerald-700 shadow-xs font-bold'
                            : 'text-slate-500 hover:text-slate-800'
                        )}
                      >
                        Thành công
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-3 px-4">Mã giao dịch</th>
                          <th className="py-3 px-4">Tên gói / Nội dung</th>
                          <th className="py-3 px-4">Ngày thanh toán</th>
                          <th className="py-3 px-4">Phương thức</th>
                          <th className="py-3 px-4 text-right">Số tiền</th>
                          <th className="py-3 px-4 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredPayments.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              {p.code}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-900">
                              {p.planName}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">{p.date}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                                {p.method}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-emerald-600">
                              {formatVND(p.amount)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Hoàn thành
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* 6. LỊCH SỬ GIAO DỊCH */}
            {activeTab === 'transactions' && (
              <Card className="bg-white border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Lịch sử giao dịch chi tiết</h3>
                    <p className="text-xs text-slate-500">Tra cứu toàn bộ biến động tài khoản và hóa đơn điện tử</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {paymentTransactionsData.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs sm:text-sm">{tx.planName}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                            Mã: {tx.code} • Ngày: {tx.date} • Cổng: {tx.method}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {formatVND(tx.amount)}
                        </p>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">
                          Giao dịch thành công
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 7. LỊCH TẬP CỦA TÔI */}
            {activeTab === 'schedule' && (
              <Card className="bg-white border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Lịch tập sắp tới</h3>
                    <p className="text-xs text-slate-500">Các buổi tập đã được xác nhận giữ chỗ của bạn</p>
                  </div>
                  <Link
                    to="/member/schedule"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Mở trang Lịch tập đầy đủ →
                  </Link>
                </div>

                <div className="space-y-3">
                  {upcomingClassesData.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h4>
                          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                            {item.dayOfWeek}, {item.date} ({item.time})
                          </p>
                          <p className="text-[11px] text-slate-400">{item.trainer}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 8. LỊCH SỬ THAM GIA LỚP */}
            {activeTab === 'history' && (
              <Card className="bg-white border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Lịch sử điểm danh (Check-in)</h3>
                    <p className="text-xs text-slate-500">Các buổi tập bạn đã đến phòng tập và hoàn thành</p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {checkInHistoryData.length} lần điểm danh
                  </span>
                </div>

                <div className="space-y-3">
                  {checkInHistoryData.map((chk) => (
                    <div
                      key={chk.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{chk.className}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {chk.date} - {chk.time}
                            </span>
                            <span>•</span>
                            <span>{chk.location}</span>
                          </p>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-mono text-[10px] font-bold">
                        {chk.method}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePage;
