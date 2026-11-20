export interface MemberNotification {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  isUnread: boolean;
  type: 'class' | 'booking' | 'discount' | 'system' | 'social';
  avatar?: string;
}

export interface SideNotificationItem {
  id: string;
  type: 'class' | 'membership' | 'welcome';
  title: string;
  time: string;
}

export const notificationsData: MemberNotification[] = [
  {
    id: 'notif-1',
    title: 'Lớp Yoga Flow sắp bắt đầu!',
    subtitle: 'Vào lúc 18:00 hôm nay tại Phòng Studio 1 (Lầu 2)',
    time: '2 giờ trước',
    isUnread: true,
    type: 'class',
  },
  {
    id: 'notif-2',
    title: 'Bạn đã đặt lịch thành công!',
    subtitle: 'Lớp Pilates Core - 17:00 ngày mai cùng HLV Hoàng Minh',
    time: '5 giờ trước',
    isUnread: false,
    type: 'booking',
  },
  {
    id: 'notif-3',
    title: 'Ưu đãi gia hạn đặc biệt!',
    subtitle: 'Giảm 15% khi gia hạn Gói Quý trước ngày 30/11',
    time: '1 ngày trước',
    isUnread: false,
    type: 'discount',
  },
  {
    id: 'notif-4',
    title: 'Cập nhật hệ thống GymPilot',
    subtitle: 'Hệ thống bảo trì định kỳ lúc 23:00 ngày 30/11',
    time: '2 ngày trước',
    isUnread: false,
    type: 'system',
  },
  {
    id: 'notif-5',
    title: 'Thành tích tập luyện tuần này',
    subtitle: 'Chúc mừng bạn đã hoàn thành mục tiêu 3 buổi tập!',
    time: '3 ngày trước',
    isUnread: false,
    type: 'social',
    avatar: '/images/avatar-user.svg',
  },
];

export const sideNotificationsData: SideNotificationItem[] = [
  {
    id: 'side-1',
    type: 'class',
    title: 'Lớp Yoga Flow vào thứ 5 sắp bắt đầu! Đừng quên chuẩn bị trang phục thoải mái nhé.',
    time: '2 giờ trước',
  },
  {
    id: 'side-2',
    type: 'membership',
    title: 'Gói tập của bạn sẽ hết hạn trong 14 ngày. Gia hạn ngay để duy trì mạch tập luyện!',
    time: '1 ngày trước',
  },
  {
    id: 'side-3',
    type: 'welcome',
    title: 'GymPilot chúc bạn một tuần mới tràn đầy năng lượng và hiệu quả bứt phá!',
    time: '2 ngày trước',
  },
];
