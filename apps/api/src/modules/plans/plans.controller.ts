import type { Request, Response, NextFunction } from 'express';
import { plansService } from './plans.service.js';
import { CreatePlanSchema, UpdatePlanSchema } from './plans.schema.js';

export class PlansController {
  async getPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type as string | undefined;
      const isActiveParam = req.query.isActive as string | undefined;
      let isActive: boolean | undefined = undefined;
      if (isActiveParam === 'true') isActive = true;
      if (isActiveParam === 'false') isActive = false;

      const plans = await plansService.getPlans({ type, isActive });
      res.status(200).json({
        success: true,
        data: plans,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const plan = await plansService.getPlanById(id);
      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = CreatePlanSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Dữ liệu gói tập không hợp lệ.',
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const plan = await plansService.createPlan(parsed.data);
      res.status(201).json({
        success: true,
        message: 'Tạo gói tập mới thành công.',
        data: plan,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const parsed = UpdatePlanSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.issues[0]?.message || 'Dữ liệu cập nhật không hợp lệ.',
          code: 'VALIDATION_ERROR',
        });
        return;
      }

      const plan = await plansService.updatePlan(id, parsed.data);
      res.status(200).json({
        success: true,
        message: 'Cập nhật gói tập thành công.',
        data: plan,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await plansService.deletePlan(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const plansController = new PlansController();
