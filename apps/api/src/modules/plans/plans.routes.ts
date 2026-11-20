import { Router } from 'express';
import { plansController } from './plans.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { Role } from '@gympilot/shared';

export const planRoutes: Router = Router();

// Public / Member read endpoints
planRoutes.get('/', (req, res, next) => plansController.getPlans(req, res, next));
planRoutes.get('/:id', (req, res, next) => plansController.getPlanById(req, res, next));

// Owner management endpoints
planRoutes.post(
  '/',
  authMiddleware,
  roleMiddleware(Role.OWNER),
  (req, res, next) => plansController.createPlan(req, res, next)
);

planRoutes.put(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.OWNER),
  (req, res, next) => plansController.updatePlan(req, res, next)
);

planRoutes.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(Role.OWNER),
  (req, res, next) => plansController.deletePlan(req, res, next)
);
