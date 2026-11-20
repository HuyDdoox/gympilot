import { api } from '@/lib/axios';
import {
  membershipPlansData,
  type MembershipPlanItem,
  featuredClassesData,
  type FeaturedClassItem,
  scheduleClassesData,
  type BookingClassScheduleItem,
} from '@/features/member/data';
import type { ApiResponse } from '@gympilot/shared';

export interface BackendPlanResponse {
  id: string;
  gymId?: string;
  name: string;
  type: string;
  price: number;
  durationDays?: number | null;
  totalSessions?: number | null;
  description?: string | null;
  isActive?: boolean;
}

export const memberService = {
  /**
   * Lấy danh sách gói tập từ Backend API (/api/plans)
   * Tự động fallback về static data an toàn nếu Backend offline hoặc chưa có dữ liệu
   */
  async getPlans(): Promise<MembershipPlanItem[]> {
    try {
      const response = await api.get<ApiResponse<BackendPlanResponse[]> | BackendPlanResponse[]>('/plans');
      const rawData = 'data' in response.data && response.data.success ? response.data.data : response.data;

      if (Array.isArray(rawData) && rawData.length > 0) {
        return rawData.map((p, idx) => {
          const matchedStatic = membershipPlansData.find((s) => s.name.toLowerCase() === p.name.toLowerCase());
          return {
            id: p.id,
            name: p.name,
            type: p.type as MembershipPlanItem['type'],
            price: p.price,
            badge: matchedStatic?.badge || (idx === 1 ? 'Bán chạy' : undefined),
            isPopular: matchedStatic?.isPopular || idx === 1,
            subtitle: p.description || matchedStatic?.subtitle || 'Gói tập chất lượng cao cùng GymPilot',
            benefits: matchedStatic?.benefits || [
              'Không giới hạn lớp học Yoga, Pilates & Gym',
              'Ưu tiên giữ chỗ ca tập trước 24 giờ',
              'Sử dụng tủ đồ cá nhân và phòng tắm nóng lạnh',
            ],
            iconType: matchedStatic?.iconType || (idx === 0 ? 'calendar' : idx === 1 ? 'award' : 'heart'),
          };
        });
      }
    } catch {
      // Backend offline hoặc lỗi kết nối -> Fallback mượt mà về static data
    }
    return membershipPlansData;
  },

  /**
   * Lấy danh sách lớp nổi bật
   */
  async getFeaturedClasses(): Promise<FeaturedClassItem[]> {
    try {
      const response = await api.get<ApiResponse<FeaturedClassItem[]>>('/classes');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    return featuredClassesData;
  },

  /**
   * Lấy lịch học theo ngày
   */
  async getScheduleClasses(): Promise<BookingClassScheduleItem[]> {
    try {
      const response = await api.get<ApiResponse<BookingClassScheduleItem[]>>('/sessions');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }
    return scheduleClassesData;
  },

  /**
   * Kiểm tra tình trạng kết nối máy chủ Backend
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await api.get('/health', { timeout: 3000 });
      return res.status === 200;
    } catch {
      return false;
    }
  },
};

export default memberService;
