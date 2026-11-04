import type { Request, Response, NextFunction } from 'express';
import type { Role } from '@gympilot/shared';

export function roleMiddleware(..._allowedRoles: Role[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    // To be implemented in Task 2
    next();
  };
}
