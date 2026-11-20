import { type Request, type Response } from 'express';
import { authService } from './auth.service.js';
import {
  LoginSchema,
  RegisterOwnerSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from './auth.schema.js';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Dữ liệu đăng nhập không hợp lệ.',
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const result = await authService.login(parsed.data);
      res.status(200).json({
        success: true,
        data: result,
        message: 'Đăng nhập thành công!',
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Đăng nhập thất bại.',
        code: 'AUTH_FAILED',
      });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const parsed = RegisterOwnerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Dữ liệu đăng ký không hợp lệ.',
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const result = await authService.registerOwner(parsed.data);
      res.status(201).json({
        success: true,
        data: result,
        message: 'Đăng ký tài khoản chủ phòng thành công!',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Đăng ký thất bại.',
        code: 'REGISTRATION_FAILED',
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const parsed = RefreshTokenSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: 'Refresh token không hợp lệ.',
          code: 'INVALID_TOKEN',
        });
        return;
      }

      const result = await authService.refreshToken(parsed.data.refreshToken);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Refresh token không hợp lệ hoặc đã hết hạn.',
        code: 'REFRESH_FAILED',
      });
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const parsed = ForgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Email không hợp lệ.',
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const result = await authService.forgotPassword(parsed.data.email);
      res.status(200).json({
        success: true,
        data: result,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Không thể xử lý yêu cầu quên mật khẩu.',
        code: 'FORGOT_PASSWORD_FAILED',
      });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const parsed = ResetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ.',
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const result = await authService.resetPassword(parsed.data);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Đặt lại mật khẩu thất bại.',
        code: 'RESET_PASSWORD_FAILED',
      });
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công!',
    });
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Chưa xác thực người dùng.',
          code: 'UNAUTHORIZED',
        });
        return;
      }

      const user = await authService.getMe(req.user.id);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Không tìm thấy người dùng.',
        code: 'USER_NOT_FOUND',
      });
    }
  }
}

export const authController = new AuthController();
