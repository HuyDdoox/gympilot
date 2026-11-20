export interface NavigationItem {
  id: string;
  label: string;
  to: string;
  iconName: 'home' | 'calendar' | 'calendar-check' | 'layers' | 'credit-card' | 'user' | 'users';
  badge?: string;
  isExternal?: boolean;
}

export interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
    isExternal?: boolean;
  }[];
}

export const memberNavigationData: {
  guestNav: NavigationItem[];
  memberNav: NavigationItem[];
  mainNav: NavigationItem[]; // For backwards-compatibility
  footerSections: FooterSection[];
} = {
  // Navigation when guest is NOT logged in (Only Trang chủ & Đặt lớp)
  guestNav: [
    { id: 'nav-home', label: 'Trang chủ', to: '/', iconName: 'home' },
    { id: 'nav-booking', label: 'Đặt lớp', to: '/member/class-booking', iconName: 'calendar-check' },
  ],

  // Navigation when member IS logged in (Trang chủ, Lịch tập, Đặt lớp, Gói tập)
  // Notice: 'Thanh toán' is removed from Header and moved into Member Profile.
  memberNav: [
    { id: 'nav-home', label: 'Trang chủ', to: '/', iconName: 'home' },
    { id: 'nav-schedule', label: 'Lịch tập', to: '/member/schedule', iconName: 'calendar' },
    { id: 'nav-booking', label: 'Đặt lớp', to: '/member/class-booking', iconName: 'calendar-check' },
    { id: 'nav-plans', label: 'Gói tập', to: '/member/my-membership', iconName: 'layers' },
  ],

  mainNav: [
    { id: 'nav-home', label: 'Trang chủ', to: '/', iconName: 'home' },
    { id: 'nav-schedule', label: 'Lịch tập', to: '/member/schedule', iconName: 'calendar' },
    { id: 'nav-booking', label: 'Đặt lớp', to: '/member/class-booking', iconName: 'calendar-check' },
    { id: 'nav-plans', label: 'Gói tập', to: '/member/my-membership', iconName: 'layers' },
  ],

  footerSections: [
    {
      title: 'Liên kết nhanh',
      links: [
        { label: 'Trang chủ hội viên', href: '/' },
        { label: 'Lịch tập thể thao', href: '/member/schedule' },
        { label: 'Đặt lớp học theo ca', href: '/member/class-booking' },
        { label: 'Gói tập hội viên', href: '/member/my-membership' },
        { label: 'Hồ sơ & Thanh toán', href: '/member/profile?tab=payments' },
        { label: 'Thẻ QR Check-in', href: '/member/my-qr' },
      ],
    },
    {
      title: 'Hỗ trợ khách hàng',
      links: [
        { label: 'Câu hỏi thường gặp (FAQ)', href: '#faq' },
        { label: 'Quy định phòng tập', href: '#rules' },
        { label: 'Chính sách bảo mật', href: '#privacy' },
        { label: 'Điều khoản dịch vụ', href: '#terms' },
      ],
    },
  ],
};
