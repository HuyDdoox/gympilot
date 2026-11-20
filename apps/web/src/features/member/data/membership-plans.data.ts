export interface MembershipPlanItem {
  id: string;
  name: string;
  type?: 'MONTHLY' | 'QUARTERLY' | 'SESSION_PACK' | 'DROP_IN';
  price?: number;
  badge?: string;
  isPopular?: boolean;
  subtitle: string;
  benefits: string[];
  iconType: 'calendar' | 'award' | 'dumbbell' | 'heart';
}

export const membershipPlansData: MembershipPlanItem[] = [
  {
    id: 'plan-monthly',
    name: 'Gói Tháng',
    type: 'MONTHLY',
    price: 1200000,
    badge: 'Phổ biến',
    isPopular: false,
    subtitle: 'Tập luyện thả ga trong 30 ngày',
    iconType: 'calendar',
    benefits: [
      'Không giới hạn lớp học Yoga, Pilates & Gym',
      'Ưu tiên đặt lớp trước 48 giờ',
      'Miễn phí tủ đồ cá nhân & phòng tắm nóng lạnh',
    ],
  },
  {
    id: 'plan-quarterly',
    name: 'Gói Quý (3 Tháng)',
    type: 'QUARTERLY',
    price: 3200000,
    badge: 'Bán chạy nhất',
    isPopular: true,
    subtitle: 'Tiết kiệm 15% so với gói tháng',
    iconType: 'award',
    benefits: [
      'Toàn bộ quyền lợi của Gói Tháng',
      'Tặng 02 buổi tập cùng Huấn luyện viên cá nhân (PT 1-1)',
      'Miễn phí đo chỉ số InBody và tư vấn dinh dưỡng',
      'Quyền lợi bảo lưu gói tập tối đa 15 ngày',
    ],
  },
  {
    id: 'plan-sessions',
    name: 'Gói 10 Buổi Linh Hoạt',
    type: 'SESSION_PACK',
    price: 1500000,
    isPopular: false,
    subtitle: 'Linh hoạt cho người có lịch trình bận rộn',
    iconType: 'dumbbell',
    benefits: [
      '10 buổi tập tùy chọn bất kỳ ca nào',
      'Thời hạn sử dụng lên đến 60 ngày',
      'Tự do phân bổ theo lịch làm việc cá nhân',
    ],
  },
  {
    id: 'plan-vip',
    name: 'Gói Hội Viên VIP Diamond',
    type: 'QUARTERLY',
    price: 5900000,
    badge: 'Đặc quyền',
    isPopular: false,
    subtitle: 'Trải nghiệm thể chất & phục hồi đẳng cấp',
    iconType: 'heart',
    benefits: [
      'Đặc quyền sử dụng phòng VIP Lounge & đồ uống thảo mộc',
      'Ưu tiên giữ chỗ mọi khung giờ cao điểm',
      'Khăn tập cao cấp và đồ dùng cá nhân chuẩn bị sẵn',
      'Bảo lưu gói không giới hạn số lần',
    ],
  },
];
