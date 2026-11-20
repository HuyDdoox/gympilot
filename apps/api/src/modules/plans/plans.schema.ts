import { z } from 'zod';
import { PlanType } from '@gympilot/shared';

export const CreatePlanSchema = z.object({
  name: z.string().min(2, 'Tên gói tập phải có ít nhất 2 ký tự.'),
  type: z.enum([
    PlanType.MONTHLY,
    PlanType.QUARTERLY,
    PlanType.SESSION_PACK,
    PlanType.DROP_IN,
  ], {
    message: 'Loại gói tập không hợp lệ (MONTHLY, QUARTERLY, SESSION_PACK, DROP_IN).',
  }),
  price: z.coerce.number().min(0, 'Giá gói tập không thể âm.'),
  durationDays: z.coerce.number().min(1, 'Thời hạn tối thiểu 1 ngày.').nullable().optional(),
  totalSessions: z.coerce.number().min(1, 'Số buổi tối thiểu là 1.').nullable().optional(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const UpdatePlanSchema = z.object({
  name: z.string().min(2, 'Tên gói tập phải có ít nhất 2 ký tự.').optional(),
  type: z.enum([
    PlanType.MONTHLY,
    PlanType.QUARTERLY,
    PlanType.SESSION_PACK,
    PlanType.DROP_IN,
  ]).optional(),
  price: z.coerce.number().min(0, 'Giá gói tập không thể âm.').optional(),
  durationDays: z.coerce.number().min(1).nullable().optional(),
  totalSessions: z.coerce.number().min(1).nullable().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type CreatePlanDto = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanDto = z.infer<typeof UpdatePlanSchema>;
