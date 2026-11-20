import type { UpcomingClassItem } from './classes.data';

export interface WeeklyActivityData {
  completedClasses: number;
  targetClasses: number;
  progressPercentage: number;
  encouragementMessage: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconType: 'dumbbell' | 'calendar' | 'shield' | 'bell' | 'chart';
}

export interface PaymentTransactionItem {
  id: string;
  code: string;
  planName: string;
  amount: number;
  date: string;
  method: 'BANK_TRANSFER' | 'MOMO' | 'VNPAY' | 'CASH';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export interface MemberCheckInLog {
  id: string;
  date: string;
  time: string;
  className: string;
  method: 'QR_CODE' | 'MANUAL';
  location: string;
  status: 'SUCCESS';
}

export interface MemberUserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  joinedDate: string;
  goal: string;
  emergencyContact: string;
  membership: {
    type: string;
    status: string;
    startDate: string;
    expiresAt: string;
    daysLeft: number;
    totalSessions: number;
    sessionsUsed: number;
  };
}

export const memberUserProfileData: MemberUserProfile = {
  id: 'member-vyan-01',
  fullName: 'Mai Thị Vy An',
  email: 'vyan.mai@gympilot.vn',
  avatar: '/images/avatar-user.svg',
  phone: '0909 123 456',
  dateOfBirth: '15/08/1998',
  gender: 'Nữ',
  joinedDate: '12/01/2025',
  goal: 'Tăng cường sức bền, cải thiện độ dẻo dai và vóc dáng',
  emergencyContact: 'Mai Văn Ba (Bố) - 0918 888 999',
  membership: {
    type: 'Premium Membership',
    status: 'Đang hoạt động',
    startDate: '01/11/2025',
    expiresAt: '30/11/2025',
    daysLeft: 14,
    totalSessions: 30,
    sessionsUsed: 12,
  },
};

export const upcomingClassesData: UpcomingClassItem[] = [
  {
    id: 'up-1',
    title: 'Yoga Flow',
    dayOfWeek: 'Thứ 5',
    date: '06/11',
    year: '2025',
    time: '18:00 - 19:00',
    trainer: 'HLV: Nguyễn Thảo',
    status: 'Đã đặt',
    image: '/images/class-yoga-real.jpg',
    tag: 'Yoga',
    tagColor: 'bg-emerald-600 text-white',
    level: 'Mọi cấp độ',
  },
  {
    id: 'up-2',
    title: 'Pilates Core',
    dayOfWeek: 'Thứ 6',
    date: '07/11',
    year: '2025',
    time: '07:30 - 08:30',
    trainer: 'HLV: Hoàng Minh',
    status: 'Đã đặt',
    image: '/images/class-pilates-real.jpg',
    tag: 'Pilates',
    tagColor: 'bg-teal-600 text-white',
    level: 'Cơ bản',
  },
];

export const upcomingClassData: UpcomingClassItem = upcomingClassesData[0];

export const weeklyActivityData: WeeklyActivityData = {
  completedClasses: 3,
  targetClasses: 4,
  progressPercentage: 75,
  encouragementMessage: 'Bạn đang tiến bộ rất tốt! Cố lên nhé 💪',
};

export const whyChooseGymPilotData: WhyChooseItem[] = [
  {
    id: 'why-1',
    title: 'Quản lý thông minh',
    description: 'Theo dõi tiến trình cá nhân và trạng thái gói tập nhanh chóng',
    iconType: 'dumbbell',
  },
  {
    id: 'why-2',
    title: 'Đặt lớp nhanh chóng',
    description: 'Đặt chỗ ca tập chỉ với một chạm ngay trên điện thoại',
    iconType: 'calendar',
  },
  {
    id: 'why-3',
    title: 'Check-in tiện lợi',
    description: 'Quét mã QR kỹ thuật số không cần mang thẻ nhựa',
    iconType: 'shield',
  },
  {
    id: 'why-4',
    title: 'Nhắc nhở tự động',
    description: 'Thông báo lịch tập và nhắc hạn trước khi gói hết hạn',
    iconType: 'bell',
  },
  {
    id: 'why-5',
    title: 'Báo cáo chi tiết',
    description: 'Thống kê tần suất luyện tập trực quan, truyền cảm hứng',
    iconType: 'chart',
  },
];

export const paymentTransactionsData: PaymentTransactionItem[] = [
  {
    id: 'pay-1',
    code: 'INV-2025-001',
    planName: 'Gói Quý (3 Tháng)',
    amount: 3200000,
    date: '01/11/2025',
    method: 'BANK_TRANSFER',
    status: 'COMPLETED',
  },
  {
    id: 'pay-2',
    code: 'INV-2025-002',
    planName: 'Gói Buổi PT 1-1 (5 Buổi)',
    amount: 1500000,
    date: '15/10/2025',
    method: 'MOMO',
    status: 'COMPLETED',
  },
  {
    id: 'pay-3',
    code: 'INV-2025-003',
    planName: 'Khăn tập & Bình nước GymPilot',
    amount: 250000,
    date: '02/10/2025',
    method: 'CASH',
    status: 'COMPLETED',
  },
];

export const checkInHistoryData: MemberCheckInLog[] = [
  {
    id: 'chk-1',
    date: '15/11/2026',
    time: '18:05',
    className: 'Pilates Core & Toning',
    method: 'QR_CODE',
    location: 'Cửa check-in Studio B',
    status: 'SUCCESS',
  },
  {
    id: 'chk-2',
    date: '12/11/2026',
    time: '17:58',
    className: 'Yoga Flow',
    method: 'QR_CODE',
    location: 'Cửa check-in Studio A',
    status: 'SUCCESS',
  },
  {
    id: 'chk-3',
    date: '08/11/2026',
    time: '06:35',
    className: 'Tự tập Gym Free Weight',
    method: 'MANUAL',
    location: 'Quầy Lễ Tân Tầng 1',
    status: 'SUCCESS',
  },
  {
    id: 'chk-4',
    date: '04/11/2026',
    time: '19:02',
    className: 'HIIT Training',
    method: 'QR_CODE',
    location: 'Cửa check-in Studio A',
    status: 'SUCCESS',
  },
];
