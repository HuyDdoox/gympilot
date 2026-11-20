export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating?: number;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: 'testi-1',
    name: 'Nguyễn Minh Anh',
    role: 'Hội viên Pilates 6 tháng',
    quote: 'GymPilot giúp mình chủ động sắp xếp ca tập rất nhanh chóng. Giao diện trực quan, không bị rối mắt như các app quản lý thông thường!',
    avatar: '/images/avatar-1.svg',
    rating: 5,
  },
  {
    id: 'testi-2',
    name: 'Trần Hoàng Nam',
    role: 'Hội viên Gym 1 năm',
    quote: 'Check-in bằng mã QR tiện lợi vô cùng, không lo quên thẻ cứng. Hệ thống thông báo nhắc lịch tập trước 2 tiếng rất chu đáo.',
    avatar: '/images/avatar-2.svg',
    rating: 5,
  },
  {
    id: 'testi-3',
    name: 'Lê Thùy Linh',
    role: 'Hội viên Yoga Flow',
    quote: 'Từ khi sử dụng ứng dụng GymPilot, mình dễ dàng theo dõi tiến độ buổi tập theo tuần. Không gian tập luyện và dịch vụ tại cơ sở rất chuyên nghiệp!',
    avatar: '/images/avatar-3.svg',
    rating: 5,
  },
];
