import type { Request, Response, NextFunction } from 'express';

export function authMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  // To be implemented in Task 2
  next();
}
