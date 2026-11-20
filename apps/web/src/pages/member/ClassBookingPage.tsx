import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Search,
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { authStorage } from '@/lib/auth';
import {
  scheduleDaysData,
  classCategories,
} from '@/features/member/data';
import { Card, Button, Modal } from '@/components/ui';

export interface BookingClassItem {
  id: string;
  title: string;
  category: 'YOGA' | 'PILATES' | 'HIIT' | 'GYM';
  trainer: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  branch: string;
  availableSlots: number;
  totalSlots: number;
  caloriesBurned: string;
  intensity: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  description: string;
  image: string;
}

const mockAvailableClasses: BookingClassItem[] = [
  {
    id: 'cb-1',
    title: 'Yoga Flow Buổi Sáng',
    category: 'YOGA',
    trainer: 'Nguyễn Thảo',
    date: '18/11/2026',
    dayOfWeek: 'Thứ Tư',
    startTime: '06:30',
    endTime: '07:30',
    room: 'Studio A (Lầu 2)',
    branch: 'GymPilot Boutique Studio - Quận 1',
    availableSlots: 6,
    totalSlots: 15,
    caloriesBurned: '300 - 400 kcal',
    intensity: 'Cơ bản',
    description: 'Khởi đầu ngày mới tràn đầy năng lượng với chuỗi chuyển động nhịp nhàng kết hợp hít thở sâu, giúp giãn cơ và sảng khoái tinh thần.',
    image: '/images/class-yoga-real.jpg',
  },
  {
    id: 'cb-2',
    title: 'Pilates Core & Toning',
    category: 'PILATES',
    trainer: 'Hoàng Minh',
    date: '18/11/2026',
    dayOfWeek: 'Thứ Tư',
    startTime: '17:30',
    endTime: '18:30',
    room: 'Studio B (Lầu 3)',
    branch: 'GymPilot Boutique Studio - Quận 1',
    availableSlots: 2,
    totalSlots: 12,
    caloriesBurned: '380 - 450 kcal',
    intensity: 'Trung bình',
    description: 'Chuyên sâu vào nhóm cơ lõi (Core), cơ bụng và cơ sàn chậu trên thảm kết hợp vòng Pilates để chỉnh sửa dáng và siết cơ thon gọn.',
    image: '/images/class-pilates-real.jpg',
  },
  {
    id: 'cb-3',
    title: 'HIIT Fat Burn Sức Mạnh',
    category: 'HIIT',
    trainer: 'Lê Dũng',
    date: '18/11/2026',
    dayOfWeek: 'Thứ Tư',
    startTime: '19:00',
    endTime: '20:00',
    room: 'Khu Functional Studio',
    branch: 'GymPilot Boutique Studio - Quận 1',
    availableSlots: 8,
    totalSlots: 20,
    caloriesBurned: '550 - 700 kcal',
    intensity: 'Nâng cao',
    description: 'Tập luyện ngắt quãng cường độ cao với tạ chuông (kettlebell), dây thừng (battle rope) và các bài cardio đốt calo tối đa.',
    image: '/images/class-hiit-real.jpg',
  },
  {
    id: 'cb-4',
    title: 'Gym Strength & Hypertrophy',
    category: 'GYM',
    trainer: 'Trần Bách',
    date: '19/11/2026',
    dayOfWeek: 'Thứ Năm',
    startTime: '08:00',
    endTime: '09:00',
    room: 'Tầng Gym Free Weights',
    branch: 'GymPilot Boutique Studio - Quận 1',
    availableSlots: 5,
    totalSlots: 15,
    caloriesBurned: '400 - 550 kcal',
    intensity: 'Trung bình',
    description: 'Rèn luyện sức mạnh và tăng kích thước cơ bắp với các bài tạ đòn Squat, Bench Press, Deadlift dưới sự chỉnh form sát sao của HLV.',
    image: '/images/gympilot-equipment-3d.jpg',
  },
  {
    id: 'cb-5',
    title: 'Hatha Yoga Cân Bằng Năng Lượng',
    category: 'YOGA',
    trainer: 'Nguyễn Thảo',
    date: '19/11/2026',
    dayOfWeek: 'Thứ Năm',
    startTime: '18:00',
    endTime: '19:00',
    room: 'Studio A (Lầu 2)',
    branch: 'GymPilot Boutique Studio - Quận 1',
    availableSlots: 0,
    totalSlots: 15,
    caloriesBurned: '250 - 350 kcal',
    intensity: 'Cơ bản',
    description: 'Giải phóng căng thẳng tích tụ sau giờ làm việc bằng các tư thế kéo giãn sâu, mở vai và mở khớp hông.',
    image: '/images/class-yoga-real.jpg',
  },
  {
    id: 'cb-6',
    title: 'Pilates Reformer Tinh Gọn',
    category: 'PILATES',
    trainer: 'Hoàng Minh',
    date: '19/11/2026',
    dayOfWeek: 'Thứ Năm',
    startTime: '19:30',
    endTime: '20:30',
    room: 'Studio C (Lầu 3)',
    branch: 'GymPilot Boutique Studio - Quận 1',
    availableSlots: 3,
    totalSlots: 10,
    caloriesBurned: '350 - 450 kcal',
    intensity: 'Trung bình',
    description: 'Tập luyện với máy Reformer chuyên dụng hỗ trợ kéo giãn cột sống, tạo đường cong săn chắc và cải thiện tính linh hoạt.',
    image: '/images/class-pilates-real.jpg',
  },
];

export const ClassBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const token = authStorage.getToken();
  const isAuthenticated = Boolean(token);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('18/11/2026');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Booking Flow States (Steps 2 - 6)
  const [selectedClass, setSelectedClass] = useState<BookingClassItem | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    success: boolean;
    bookingCode?: string;
    classItem?: BookingClassItem;
  } | null>(null);

  // Filter classes
  const filteredClasses = mockAvailableClasses.filter((c) => {
    const matchCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchDay = selectedDay === 'ALL' || c.date === selectedDay;
    const matchSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.branch.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchDay && matchSearch;
  });

  // Step 2 & 3: Select class and view details
  const handleSelectClass = (classItem: BookingClassItem) => {
    setSelectedClass(classItem);
    setIsConfirmModalOpen(true);
  };

  // Step 5 & 6: Confirm booking and display result
  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedClass || selectedClass.availableSlots <= 0) return;

    // Simulate booking success
    const generatedCode = `BK-${selectedClass.category}-${Math.floor(100 + Math.random() * 900)}`;
    setBookingResult({
      success: true,
      bookingCode: generatedCode,
      classItem: selectedClass,
    });
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="w-full bg-[#f8fafc] text-slate-800 pb-16 min-h-screen">
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
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Đặt lớp học &amp; Ca tập
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {filteredClasses.length} lớp khả dụng
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tìm kiếm và giữ chỗ các lớp Yoga, Pilates, HIIT cùng các Huấn luyện viên chuyên nghiệp
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <Link
              to="/member/schedule"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-200 text-xs font-bold shadow-xs transition-colors"
            >
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Xem lịch tập đã đặt</span>
            </Link>
          )}
        </div>

        {/* Step 1: Filter Bar (Search + Days + Categories) */}
        <div className="space-y-4">
          <Card className="bg-white border-slate-200/80 p-4 rounded-2xl shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên lớp, HLV, phòng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              {/* Day selection tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
                <button
                  onClick={() => setSelectedDay('ALL')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors',
                    selectedDay === 'ALL'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  Tất cả ngày
                </button>
                {scheduleDaysData.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDay(d.dateValue)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors',
                      selectedDay === d.dateValue
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    )}
                  >
                    {d.label} ({d.dateValue.slice(0, 5)})
                  </button>
                ))}
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 overflow-x-auto">
              <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Bộ môn:</span>
              {classCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                    selectedCategory === cat.value
                      ? 'bg-emerald-100 text-emerald-800 font-bold'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Card className="bg-white border-slate-200 p-12 text-center rounded-2xl shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Không tìm thấy lớp học nào</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy thử chọn ngày khác hoặc đổi từ khóa tìm kiếm để khám phá các ca tập đang mở.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map((item) => {
              const isFull = item.availableSlots <= 0;
              return (
                <Card
                  key={item.id}
                  className="bg-white border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Class Image & Badges */}
                    <div className="h-44 relative bg-slate-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                          {item.category}
                        </span>
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs">
                          {item.intensity}
                        </span>
                      </div>

                      <div className="absolute bottom-3 right-3">
                        {isFull ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500 text-white shadow-xs">
                            Hết chỗ
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                            Còn {item.availableSlots} / {item.totalSlots} chỗ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            Thời gian:
                          </span>
                          <strong className="text-slate-800">
                            {item.dayOfWeek}, {item.date} ({item.startTime} - {item.endTime})
                          </strong>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Huấn luyện viên:
                          </span>
                          <span className="font-semibold text-slate-800">{item.trainer}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            Phòng học:
                          </span>
                          <span className="text-slate-700">{item.room}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            Tiêu hao ước tính:
                          </span>
                          <span className="font-semibold text-amber-600">{item.caloriesBurned}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="p-4 sm:p-5 pt-0">
                    <Button
                      variant={isFull ? 'outline' : 'primary'}
                      size="md"
                      disabled={isFull}
                      onClick={() => handleSelectClass(item)}
                      className={cn(
                        'w-full text-xs font-bold justify-center rounded-xl shadow-xs',
                        isFull
                          ? 'border-slate-200 text-slate-400 cursor-not-allowed bg-slate-50'
                          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      )}
                    >
                      {isFull ? 'Đã hết chỗ trống' : 'Xem chi tiết & Đặt chỗ'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 3, 4, 5: Modal Xem thông tin chi tiết & Xác nhận đặt lớp */}
      {selectedClass && (
        <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title={`Xác nhận đặt lớp: ${selectedClass.title}`}
          description="Vui lòng kiểm tra lại thông tin chi tiết ca tập trước khi gửi xác nhận."
          maxWidth="lg"
        >
          <div className="space-y-4 pt-2">
            <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={selectedClass.image}
                alt={selectedClass.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Thời gian ca tập:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {selectedClass.dayOfWeek}, {selectedClass.date} ({selectedClass.startTime} - {selectedClass.endTime})
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Huấn luyện viên phụ trách:</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedClass.trainer}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Địa điểm & Phòng học:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {selectedClass.room} - {selectedClass.branch}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Tình trạng suất tập:</span>
                <p className="font-bold text-emerald-600 mt-0.5">
                  Còn {selectedClass.availableSlots} chỗ trống (trên {selectedClass.totalSlots} thảm)
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
              <strong>Lưu ý:</strong> Vui lòng mặc trang phục thể thao thoải mái, mang theo khăn lau mồ hôi và đến trước giờ tập 10 phút.
            </div>

            {!isAuthenticated && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-center justify-between gap-3">
                <span>Bạn cần đăng nhập tài khoản để hoàn tất việc giữ chỗ.</span>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shrink-0"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmBooking}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
              >
                {isAuthenticated ? 'Xác nhận đặt lớp' : 'Đăng nhập để đặt lớp'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Step 6: Modal Kết quả đặt lớp thành công */}
      {bookingResult && (
        <Modal
          isOpen={Boolean(bookingResult)}
          onClose={() => setBookingResult(null)}
          title="Đặt lớp thành công!"
          description="Ca tập của bạn đã được ghi nhận trên hệ thống GymPilot."
          maxWidth="md"
        >
          <div className="space-y-4 pt-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {bookingResult.classItem?.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {bookingResult.classItem?.dayOfWeek}, {bookingResult.classItem?.date} ({bookingResult.classItem?.startTime} - {bookingResult.classItem?.endTime})
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
              <span className="text-slate-400 block text-[10px] uppercase">Mã phiếu đặt</span>
              <strong className="text-emerald-700 text-sm font-extrabold">{bookingResult.bookingCode}</strong>
            </div>

            <p className="text-xs text-slate-500">
              Hệ thống đã lưu ca tập vào lịch tập cá nhân của bạn. Bạn có thể mở mã QR tại phòng tập để điểm danh khi đến lớp.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBookingResult(null)}
              >
                Tiếp tục xem lớp khác
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setBookingResult(null);
                  navigate('/member/schedule');
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
              >
                Xem lịch tập của tôi →
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClassBookingPage;
