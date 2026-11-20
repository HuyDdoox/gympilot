import { z } from 'zod';
export { RegisterOwnerSchema, LoginSchema, RefreshTokenSchema } from '@gympilot/shared';

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
});

export const ResetPasswordSchema = z.object({
  resetToken: z.string().min(1, 'Mã xác thực không được để trống'),
  newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
});
