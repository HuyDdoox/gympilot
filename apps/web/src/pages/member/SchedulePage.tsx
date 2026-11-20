import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Plus,
  CalendarCheck,
  History,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { authStorage } from '@/lib/auth';
import { Card, Button, Modal } from '@/components/ui';

interface RegisteredClass {
  id: string;
  classId: string;
  title: string;
  category: 'YOGA' | 'PILATES' | 'HIIT' | 'GYM';
  trainer: string;
  date: string;
  dayOfWeek: string;
  time: string;
  room: string;
  status: 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';
  image: string;
  bookingCode: string;
}

const initialRegisteredClasses: RegisteredClass[] = [
  {
    id: 'reg-1',
    classId: 'sc-1',
    title: 'Yoga Flow Buổi Sáng',
    category: 'YOGA',
    trainer: 'HLV Nguyễn Thảo',
    date: '18/11/2026',
    dayOfWeek: 'Thứ Tư',
    time: '06:30 - 07:30',
    room: 'Studio A (Lầu 2)',
    status: 'CONFIRMED',
    image: '/images/class-yoga-real.jpg',
    bookingCode: 'BK-YOGA-092',
  },
  {
    id: 'reg-2',
    classId: 'sc-2',
    title: 'Pilates Core & Toning',
    category: 'PILATES',
    trainer: 'HLV Hoàng Minh',
    date: '19/11/2026',
    dayOfWeek: 'Thứ Năm',
    time: '17:30 - 18:30',
    room: 'Studio B (Lầu 3)',
    status: 'CONFIRMED',
    image: '/images/class-pilates-real.jpg',
    bookingCode: 'BK-PILA-114',
  },
  {
    id: 'reg-3',
    classId: 'sc-3',
    title: 'HIIT Fat Burn Sức Mạnh',
    category: 'HIIT',
    trainer: 'HLV Lê Dũng',
    date: '15/11/2026',
    dayOfWeek: 'Chủ Nhật',
    time: '19:00 - 20:00',
    room: 'Khu Functional',
    status: 'ATTENDED',
    image: '/images/class-hiit-real.jpg',
    bookingCode: 'BK-HIIT-055',
  },
  {
    id: 'reg-4',
    classId: 'sc-4',
    title: 'Hatha Yoga Cân Bằng Thân Tâm',
    category: 'YOGA',
    trainer: 'HLV Nguyễn Thảo',
    date: '12/11/2026',
    dayOfWeek: 'Thứ Năm',
    time: '18:00 - 19:00',
    room: 'Studio A (Lầu 2)',
    status: 'ATTENDED',
    image: '/images/class-yoga-real.jpg',
    bookingCode: 'BK-YOGA-041',
  },
];

export const SchedulePage: React.FC = () => {
  const token = authStorage.getToken();
  const isAuthenticated = Boolean(token);

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY' | 'ALL'>('UPCOMING');
  const [classes, setClasses] = useState<RegisteredClass[]>(initialRegisteredClasses);
  const [cancellingClass, setCancellingClass] = useState<RegisteredClass | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filteredList = classes.filter((item) => {
    if (activeTab === 'UPCOMING') return item.status === 'CONFIRMED';
    if (activeTab === 'HISTORY') return item.status === 'ATTENDED' || item.status === 'CANCELLED';
    return true;
  });

  const handleCancelBooking = (item: RegisteredClass) => {
    setCancellingClass(item);
  };

  const confirmCancel = () => {
    if (!cancellingClass) return;
    setClasses((prev) =>
      prev.map((c) =>
        c.id === cancellingClass.id ? { ...c, status: 'CANCELLED' as const } : c
      )
    );
    setNotice(`Đã hủy thành công ca tập "${cancellingClass.title}". Suất tập đã được hoàn trả lại cho hệ thống.`);
    setCancellingClass(null);
    setTimeout(() => setNotice(null), 4000);
  };

  const getStatusBadge = (status: RegisteredClass['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã đặt chỗ
          </span>
        );
      case 'ATTENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
            Đã tham gia
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            Đã hủy
          </span>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-[#f8fafc] text-slate-800 pb-16 min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <Card className="bg-white border-slate-200 text-center p-8 rounded-2xl shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Yêu cầu đăng nhập</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bạn cần đăng nhập tài khoản hội viên GymPilot để theo dõi lịch tập cá nhân, ca tập đã đặt và lịch sử tham gia lớp học.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Đăng nhập tài khoản
              </Link>
              <Link
                to="/member/class-booking"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Xem các lớp đang mở đăng ký →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const upcomingCount = classes.filter((c) => c.status === 'CONFIRMED').length;
  const attendedCount = classes.filter((c) => c.status === 'ATTENDED').length;

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header Breadcrumb & Actions */}
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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Lịch tập của tôi
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {upcomingCount} ca sắp tới
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Theo dõi các lớp Yoga, Pilates và Gym bạn đã đăng ký hoặc đã hoàn thành
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/member/class-booking"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Đặt thêm lớp mới</span>
            </Link>
          </div>
        </div>

        {notice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* 2 Stats Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-white border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ca tập sắp diễn ra</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{upcomingCount} ca tập</h3>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Đã xác nhận giữ chỗ</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-6 h-6" />
            </div>
          </Card>

          <Card className="bg-white border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đã hoàn thành</p>
              <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{attendedCount} buổi tập</h3>
              <p className="text-[11px] text-slate-500 mt-1">Đã điểm danh thành công</p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <History className="w-6 h-6" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 rounded-2xl shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3 text-emerald-200" />
                Lưu ý đến phòng tập
              </span>
              <p className="text-xs text-white/90 mt-2 font-medium leading-relaxed">
                Vui lòng có mặt trước giờ tập 10-15 phút để chuẩn bị thảm và điểm danh bằng mã QR tại quầy tiếp tân.
              </p>
            </div>
            <Link
              to="/member/my-qr"
              className="mt-3 text-xs font-bold text-white underline underline-offset-4 hover:text-emerald-200"
            >
              Mở mã QR điểm danh →
            </Link>
          </Card>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('UPCOMING')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'UPCOMING'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lịch tập sắp tới ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'HISTORY'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Lịch sử tham gia ({attendedCount})
            </button>
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ALL'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả ({classes.length})
            </button>
          </div>
        </div>

        {/* Schedule List */}
        {filteredList.length === 0 ? (
          <Card className="bg-white border-slate-200 p-12 text-center rounded-2xl shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Không có ca tập nào trong danh sách này</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Bạn chưa có buổi tập nào theo bộ lọc đã chọn. Hãy khám phá danh sách lớp để đặt buổi tập mới ngay!
            </p>
            <Link
              to="/member/class-booking"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Khám phá lớp học &amp; Đặt lớp</span>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3.5">
            {filteredList.map((item) => (
              <Card
                key={item.id}
                className="bg-white border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-slate-200/80 shrink-0 bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 uppercase tracking-wider">
                          {item.category}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-emerald-500" />
                          {item.dayOfWeek}, {item.date} ({item.time})
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {item.trainer}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Booking Code */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      Mã đặt: <strong className="text-slate-700">{item.bookingCode}</strong>
                    </span>

                    {item.status === 'CONFIRMED' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelBooking(item)}
                          className="text-xs text-red-600 hover:bg-red-50 hover:border-red-200"
                        >
                          Hủy lịch tập
                        </Button>
                      </div>
                    )}

                    {item.status === 'ATTENDED' && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã tích lũy buổi tập
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal xác nhận hủy lịch */}
      {cancellingClass && (
        <Modal
          isOpen={Boolean(cancellingClass)}
          onClose={() => setCancellingClass(null)}
          title="Xác nhận hủy đặt chỗ ca tập"
          description={`Bạn có chắc chắn muốn hủy ca tập "${cancellingClass.title}" vào ngày ${cancellingClass.date} (${cancellingClass.time})?`}
          maxWidth="md"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-500">
              Sau khi hủy, chỗ trống sẽ được mở lại cho các hội viên khác. Bạn vẫn có thể đăng ký lại ca tập này nếu còn suất trống.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingClass(null)}
              >
                Giữ lại ca tập
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmCancel}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Xác nhận hủy
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SchedulePage;
