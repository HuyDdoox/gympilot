export interface FeaturedClassItem {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  time: string;
  image: string;
  trainer: string;
  level: string;
  caloriesBurned?: string;
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
  tag?: string;
  tagColor?: string;
  level?: string;
}

export interface ClassCategoryItem {
  id: string;
  label: string;
  value: string;
  description: string;
}

export const classCategories: ClassCategoryItem[] = [
  { id: 'cat-all', label: 'Tất cả lớp', value: 'ALL', description: 'Toàn bộ các lớp trong tuần' },
  { id: 'cat-yoga', label: 'Yoga Flow', value: 'YOGA', description: 'Cân bằng thân tâm trí' },
  { id: 'cat-pilates', label: 'Pilates Core', value: 'PILATES', description: 'Siết cơ, chỉnh dáng chuẩn' },
  { id: 'cat-hiit', label: 'HIIT & Cardio', value: 'HIIT', description: 'Đốt mỡ cường độ cao' },
  { id: 'cat-gym', label: 'Gym & Sức mạnh', value: 'GYM', description: 'Tăng cơ bắp và thể lực' },
];

export const featuredClassesData: FeaturedClassItem[] = [
  {
    id: 'fc-1',
    title: 'HIIT Training',
    tag: 'Gym & Cardio',
    tagColor: 'bg-slate-900 text-white',
    time: '19:00 - 20:30',
    image: '/images/class-hiit-real.jpg',
    trainer: 'HLV Lê Dũng',
    level: 'Mọi cấp độ',
    caloriesBurned: '550 - 700 kcal',
  },
  {
    id: 'fc-2',
    title: 'Pilates Core',
    tag: 'Pilates Reformer',
    tagColor: 'bg-emerald-700 text-white',
    time: '17:00 - 18:00',
    image: '/images/class-pilates-real.jpg',
    trainer: 'HLV Hoàng Minh',
    level: 'Cơ bản - Trung cấp',
    caloriesBurned: '350 - 450 kcal',
  },
  {
    id: 'fc-3',
    title: 'Yoga Basic',
    tag: 'Hatha Yoga',
    tagColor: 'bg-amber-600 text-white',
    time: '19:00 - 20:00',
    image: '/images/class-yoga-real.jpg',
    trainer: 'HLV Nguyễn Thảo',
    level: 'Dành cho người mới',
    caloriesBurned: '250 - 350 kcal',
  },
];
