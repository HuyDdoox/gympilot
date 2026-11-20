import { useQuery } from '@tanstack/react-query';
import { memberService } from '../services/memberService';
import { membershipPlansData, featuredClassesData } from '../data';

/**
 * Hook tải danh sách gói tập kết nối Backend API (/api/plans)
 * Tự động cache qua TanStack Query và fallback về dữ liệu static chuẩn hóa
 */
export function useMembershipPlans() {
  return useQuery({
    queryKey: ['membership-plans'],
    queryFn: () => memberService.getPlans(),
    initialData: membershipPlansData,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook tải danh sách lớp học nổi bật
 */
export function useFeaturedClasses() {
  return useQuery({
    queryKey: ['featured-classes'],
    queryFn: () => memberService.getFeaturedClasses(),
    initialData: featuredClassesData,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook kiểm tra kết nối Backend
 */
export function useBackendHealth() {
  return useQuery({
    queryKey: ['backend-health'],
    queryFn: () => memberService.checkHealth(),
    refetchInterval: 30000,
    retry: 1,
  });
}
