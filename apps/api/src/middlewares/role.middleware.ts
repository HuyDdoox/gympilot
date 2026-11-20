import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@gympilot/shared';

export function roleMiddleware(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Yêu cầu xác thực tài khoản.',
        code: 'UNAUTHORIZED',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      res.status(403).json({
        success: false,
        message: 'Bạn không có quyền truy cập vào tài nguyên này.',
        code: 'FORBIDDEN',
      });
      return;
    }

    next();
  };
}
