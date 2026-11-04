import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ErrorCode } from '@gympilot/shared';

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = 400,
    public code: string = ErrorCode.BAD_REQUEST,
    public details?: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      code: ErrorCode.VALIDATION_ERROR,
      details: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details,
    });
    return;
  }

  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau',
    code: ErrorCode.INTERNAL_SERVER_ERROR,
  });
}
