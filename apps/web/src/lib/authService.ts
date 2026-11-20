import { api } from './axios';
import { authStorage } from './auth';
import type {
  ApiResponse,
  AuthResponseDto,
  UserDto,
} from '@gympilot/shared';
import type { z } from 'zod';
import type { LoginSchema, RegisterOwnerSchema } from '@gympilot/shared';

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterOwnerInput = z.infer<typeof RegisterOwnerSchema>;

export const authService = {
  /**
   * Gọi API đăng nhập hệ thống
   */
  async login(payload: LoginInput): Promise<AuthResponseDto> {
    const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/login', payload);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Đăng nhập không thành công');
    }
    const { data } = response.data;
    authStorage.setToken(data.tokens.accessToken);
    if (data.tokens.refreshToken) {
      authStorage.setRefreshToken(data.tokens.refreshToken);
    }
    authStorage.setUser(data.user);
    return data;
  },

  /**
   * Gọi API đăng ký tài khoản Owner
   */
  async register(payload: RegisterOwnerInput): Promise<AuthResponseDto> {
    const response = await api.post<ApiResponse<AuthResponseDto>>('/auth/register', payload);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Đăng ký không thành công');
    }
    const { data } = response.data;
    authStorage.setToken(data.tokens.accessToken);
    if (data.tokens.refreshToken) {
      authStorage.setRefreshToken(data.tokens.refreshToken);
    }
    authStorage.setUser(data.user);
    return data;
  },

  /**
   * Đăng xuất và xóa phiên đăng nhập
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // Bỏ qua lỗi mạng khi logout để luôn xóa token cục bộ
    } finally {
      authStorage.clearToken();
    }
  },

  /**
   * Yêu cầu gửi mã khôi phục mật khẩu
   */
  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const response = await api.post<ApiResponse<{ message: string; resetToken?: string }>>(
      '/auth/forgot-password',
      { email }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || 'Không thể gửi yêu cầu quên mật khẩu');
    }
    return response.data.data;
  },

  /**
   * Đặt lại mật khẩu mới với mã xác thực
   */
  async resetPassword(payload: { resetToken: string; newPassword: string }): Promise<string> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', payload);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Đặt lại mật khẩu thất bại');
    }
    return response.data.data?.message || 'Đặt lại mật khẩu thành công';
  },

  /**
   * Lấy thông tin user đang đăng nhập
   */
  async getCurrentUser(): Promise<UserDto | null> {
    const localUser = authStorage.getUser();
    if (!localUser) return null;
    try {
      const response = await api.get<ApiResponse<UserDto>>('/auth/me');
      if (response.data.success) {
        authStorage.setUser(response.data.data);
        return response.data.data;
      }
    } catch {
      // Fallback về thông tin lưu tại local nếu API chưa khả dụng
    }
    return localUser;
  },
};

export default authService;
