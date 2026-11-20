export interface BookingClassScheduleItem {
  id: string;
  title: string;
  category: 'YOGA' | 'PILATES' | 'HIIT' | 'GYM';
  trainer: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  availableSlots: number;
  totalSlots: number;
  isBooked: boolean;
}

export interface DayTabItem {
  id: string;
  label: string;
  sub: string;
  dateValue: string;
}

export const scheduleDaysData: DayTabItem[] = [
  { id: 'day-today', label: 'Hôm nay', sub: '17/11 (Thứ 3)', dateValue: '17/11/2026' },
  { id: 'day-tomorrow', label: 'Ngày mai', sub: '18/11 (Thứ 4)', dateValue: '18/11/2026' },
  { id: 'day-thu', label: 'Thứ Năm', sub: '19/11', dateValue: '19/11/2026' },
  { id: 'day-fri', label: 'Thứ Sáu', sub: '20/11', dateValue: '20/11/2026' },
  { id: 'day-sat', label: 'Thứ Bảy', sub: '21/11', dateValue: '21/11/2026' },
];

export const scheduleClassesData: BookingClassScheduleItem[] = [
  {
    id: 'sc-1',
    title: 'Yoga Flow Buổi Sáng',
    category: 'YOGA',
    trainer: 'Nguyễn Thảo',
    date: '17/11/2026',
    dayOfWeek: 'Thứ Ba',
    startTime: '06:30',
    endTime: '07:30',
    room: 'Studio A (Lầu 2)',
    availableSlots: 6,
    totalSlots: 15,
    isBooked: false,
  },
  {
    id: 'sc-2',
    title: 'Pilates Core & Toning',
    category: 'PILATES',
    trainer: 'Hoàng Minh',
    date: '17/11/2026',
    dayOfWeek: 'Thứ Ba',
    startTime: '17:30',
    endTime: '18:30',
    room: 'Studio B (Lầu 3)',
    availableSlots: 2,
    totalSlots: 12,
    isBooked: false,
  },
  {
    id: 'sc-3',
    title: 'HIIT Fat Burn',
    category: 'HIIT',
    trainer: 'Lê Dũng',
    date: '17/11/2026',
    dayOfWeek: 'Thứ Ba',
    startTime: '19:00',
    endTime: '20:00',
    room: 'Khu vực Functional',
    availableSlots: 8,
    totalSlots: 20,
    isBooked: false,
  },
  {
    id: 'sc-4',
    title: 'Yoga Flow Hoàng Hôn',
    category: 'YOGA',
    trainer: 'Nguyễn Thảo',
    date: '18/11/2026',
    dayOfWeek: 'Thứ Tư',
    startTime: '18:00',
    endTime: '19:00',
    room: 'Studio A (Lầu 2)',
    availableSlots: 0,
    totalSlots: 15,
    isBooked: true,
  },
  {
    id: 'sc-5',
    title: 'Gym Strength & Conditioning',
    category: 'GYM',
    trainer: 'Trần Bách',
    date: '18/11/2026',
    dayOfWeek: 'Thứ Tư',
    startTime: '19:30',
    endTime: '20:30',
    room: 'Tầng Gym Free Weights',
    availableSlots: 5,
    totalSlots: 15,
    isBooked: false,
  },
];
