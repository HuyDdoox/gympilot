import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authStorage } from './auth';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm Bearer token vào Header nếu đã đăng nhập
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý tập trung response và bắt lỗi 401 an toàn
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Khi token hết hạn hoặc không hợp lệ:
      // Lưu ý: Hiện tại Backend (Huy) chưa hoàn thiện contract cho endpoint refresh token (/api/auth/refresh).
      // Để tránh vòng lặp request vô hạn, ta xóa token và điều hướng về trang đăng nhập nếu chưa ở trang login.
      authStorage.clearToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
