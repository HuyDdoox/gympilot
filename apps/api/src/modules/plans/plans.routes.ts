import { Router, type Request, type Response } from 'express';
import { prisma } from '../../prisma/client.js';

export const planRoutes: Router = Router();

planRoutes.get('/', async (_req: Request, res: Response) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Lỗi khi lấy danh sách gói tập',
    });
  }
});
