// Mock data demo for Member Homepage (Tách riêng theo quy tắc kiến trúc, sẵn sàng thay thế khi Backend API hoàn thiện)

export interface MemberNotification {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  isUnread: boolean;
  type: 'class' | 'booking' | 'discount' | 'system' | 'social';
  avatar?: string;
}

export interface UpcomingClassItem {
  id: string;
  title: string;
  dayOfWeek: string;
  date: string;
  year: string;
  time: string;
  trainer: string;
  status: string;
  image: string;
}

export interface FeaturedClassItem {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  time: string;
  image: string;
}

export interface MembershipPlanItem {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  subtitle: string;
  benefits: string[];
  iconType: 'calendar' | 'award' | 'dumbbell' | 'heart';
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
  iconType: 'dumbbell' | 'calendar' | 'shield' | 'bell' | 'chart';
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export const memberMockData = {
  user: {
    fullName: 'Mai Thị Vy An',
    email: 'vyan.mai@gympilot.vn',
    avatar: '/images/avatar-user.svg',
    membership: {
      type: 'Premium Membership',
      status: 'Đang hoạt động',
      expiresAt: '30/11/2025',
    },
  },

  upcomingClass: {
    id: 'up-1',
    title: 'Yoga Flow',
    dayOfWeek: 'Thứ 5',
    date: '06/11',
    year: '2025',
    time: '18:00 - 19:00',
    trainer: 'HLV: Nguyễn Thảo',
    status: 'Đã đặt',
    image: '/images/yoga-flow.svg',
  } as UpcomingClassItem,

  weeklyActivity: {
    completedClasses: 3,
    targetClasses: 4,
    progressPercentage: 75,
    encouragementMessage: 'Bạn đang tiến bộ rất tốt! Cố lên nhé 💪',
  },

  notifications: [
    {
      id: 'notif-1',
      title: 'Lớp Yoga Flow sắp bắt đầu!',
      subtitle: 'Vào lúc 18:00 hôm nay',
      time: '2 giờ trước',
      isUnread: true,
      type: 'class',
    },
    {
      id: 'notif-2',
      title: 'Bạn đã đặt lịch thành công!',
      subtitle: 'Lớp Pilates Core - 17:00 hôm nay',
      time: '5 giờ trước',
      isUnread: false,
      type: 'booking',
    },
    {
      id: 'notif-3',
      title: 'Ưu đãi đặc biệt!',
      subtitle: 'Giảm 10% cho gói tập tháng này.',
      time: '1 ngày trước',
      isUnread: false,
      type: 'discount',
    },
    {
      id: 'notif-4',
      title: 'Cập nhật hệ thống',
      subtitle: 'GymPilot sẽ bảo trì hệ thống vào 23:00 ngày 30/11.',
      time: '2 ngày trước',
      isUnread: false,
      type: 'system',
    },
    {
      id: 'notif-5',
      title: 'Mai Thị Vy An đã bình luận bài viết của bạn',
      subtitle: '"Tuyệt vời quá!"',
      time: '3 ngày trước',
      isUnread: false,
      type: 'social',
      avatar: '/images/avatar-user.svg',
    },
  ] as MemberNotification[],

  featuredClasses: [
    {
      id: 'fc-1',
      title: 'HIIT Training',
      tag: 'Gym',
      tagColor: 'bg-slate-800 text-white',
      time: '19:00 - 20:30',
      image: '/images/class-hiit.svg',
    },
    {
      id: 'fc-2',
      title: 'Pilates Core',
      tag: 'Pilates',
      tagColor: 'bg-teal-600 text-white',
      time: '17:00 - 18:00',
      image: '/images/class-pilates.svg',
    },
    {
      id: 'fc-3',
      title: 'Yoga Basic',
      tag: 'Yoga',
      tagColor: 'bg-amber-600 text-white',
      time: '19:00 - 20:00',
      image: '/images/class-yoga-basic.svg',
    },
  ] as FeaturedClassItem[],

  membershipPlans: [
    {
      id: 'plan-1',
      name: 'Gói Tháng',
      badge: 'Phổ biến',
      isPopular: false,
      subtitle: 'Tập luyện thả ga trong 1 tháng',
      iconType: 'calendar',
      benefits: [
        'Không giới hạn lớp học',
        'Ưu tiên đặt lớp',
        'Hỗ trợ tư vấn 24/7',
      ],
    },
    {
      id: 'plan-2',
      name: 'Gói Quý',
      badge: 'Bán chạy',
      isPopular: true,
      subtitle: 'Tiết kiệm hơn, tập lâu hơn',
      iconType: 'award',
      benefits: [
        'Không giới hạn lớp học',
        'Ưu tiên đặt lớp',
        'Giảm 10% so với gói tháng',
      ],
    },
    {
      id: 'plan-3',
      name: 'Gói Buổi',
      isPopular: false,
      subtitle: 'Linh hoạt theo nhu cầu',
      iconType: 'dumbbell',
      benefits: [
        '10 buổi tập',
        'Thời hạn 2 tháng',
        'Phù hợp người bận rộn',
      ],
    },
    {
      id: 'plan-4',
      name: 'Gói Hội Viên VIP',
      isPopular: false,
      subtitle: 'Trải nghiệm cao cấp nhất',
      iconType: 'heart',
      benefits: [
        'Không giới hạn lớp học',
        'Ưu đãi đặc biệt',
        'Dịch vụ riêng',
      ],
    },
  ] as MembershipPlanItem[],

  whyChooseUs: [
    {
      id: 'why-1',
      title: 'Quản lý thông minh',
      description: 'Theo dõi hội viên, quản lý nhu cầu và lớp học dễ dàng',
      iconType: 'dumbbell',
    },
    {
      id: 'why-2',
      title: 'Đặt lớp nhanh chóng',
      description: 'Đặt và quản lý lớp tập mọi lúc, mọi nơi',
      iconType: 'calendar',
    },
    {
      id: 'why-3',
      title: 'Check-in tiện lợi',
      description: 'Bằng QR code hoặc thủ công',
      iconType: 'shield',
    },
    {
      id: 'why-4',
      title: 'Nhắc nhở tự động',
      description: 'Thông báo lịch tập, gói tập sắp hết hạn',
      iconType: 'bell',
    },
    {
      id: 'why-5',
      title: 'Báo cáo chi tiết',
      description: 'Thống kê chính xác, hỗ trợ ra quyết định',
      iconType: 'chart',
    },
  ] as WhyChooseItem[],

  testimonials: [
    {
      id: 'testi-1',
      name: 'Nguyễn Minh Anh',
      role: 'Hội viên',
      quote: 'GymPilot giúp mình sắp xếp lịch tập rất dễ dàng. Phòng gym cũng chuyên nghiệp hơn nhiều!',
      avatar: '/images/avatar-1.svg',
    },
    {
      id: 'testi-2',
      name: 'Trần Hoàng Nam',
      role: 'Hội viên',
      quote: 'Giao diện đẹp, dễ sử dụng. Check-in nhanh và luôn có nhắc nhở lịch tập.',
      avatar: '/images/avatar-2.svg',
    },
    {
      id: 'testi-3',
      name: 'Lê Thùy Linh',
      role: 'Hội viên',
      quote: 'Từ khi dùng GymPilot, mình duy trì tập luyện đều đặn và khỏe hơn rất nhiều!',
      avatar: '/images/avatar-3.svg',
    },
  ] as TestimonialItem[],
};
