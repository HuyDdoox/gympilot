import { prisma } from '../../prisma/client.js';
import { isDatabaseReachable } from '../auth/auth.service.js';
import type { CreatePlanDto, UpdatePlanDto } from './plans.schema.js';
import type { PlanType } from '@gympilot/shared';

export interface PlanRecord {
  id: string;
  gymId: string;
  name: string;
  type: PlanType;
  price: number;
  durationDays: number | null;
  totalSessions: number | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const initialSeedPlans: PlanRecord[] = [
  {
    id: 'seed-plan-01',
    gymId: 'gym-boutique-01',
    name: 'Gói Tiêu Chuẩn (Silver)',
    type: 'MONTHLY',
    price: 650000,
    durationDays: 30,
    totalSessions: null,
    description: 'Tập luyện toàn diện không giới hạn các khung giờ tiêu chuẩn.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-plan-02',
    gymId: 'gym-boutique-01',
    name: 'Gói Hội viên Vàng (Gold)',
    type: 'QUARTERLY',
    price: 1200000,
    durationDays: 90,
    totalSessions: null,
    description: 'Tự do tham gia các lớp Yoga Flow, Gym và tủ đồ cá nhân.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-plan-03',
    gymId: 'gym-boutique-01',
    name: 'Gói Kim Cương (Diamond VIP)',
    type: 'QUARTERLY',
    price: 2800000,
    durationDays: 180,
    totalSessions: null,
    description: 'Đặc quyền phòng xông hơi, HLV định hướng và đặt chỗ ưu tiên.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-plan-04',
    gymId: 'gym-boutique-01',
    name: 'Gói 20 Buổi Pilates Reformer',
    type: 'SESSION_PACK',
    price: 1600000,
    durationDays: 90,
    totalSessions: 20,
    description: 'Tập luyện chuyên sâu trên máy Reformer cùng HLV.',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

const inMemoryPlansList: PlanRecord[] = [...initialSeedPlans];

export class PlansService {
  async getPlans(options?: { type?: string; isActive?: boolean }) {
    if (await isDatabaseReachable()) {
      const where: Record<string, unknown> = {};
      if (options?.isActive !== undefined) {
        where.isActive = options.isActive;
      }
      if (options?.type) {
        where.type = options.type;
      }

      const plans = await prisma.plan.findMany({
        where,
        orderBy: { price: 'asc' },
      });
      return plans;
    } else {
      let filtered = [...inMemoryPlansList];
      if (options?.isActive !== undefined) {
        filtered = filtered.filter((p) => p.isActive === options.isActive);
      }
      if (options?.type && options.type !== 'ALL') {
        filtered = filtered.filter((p) => p.type === options.type);
      }
      return filtered.sort((a, b) => a.price - b.price);
    }
  }

  async getPlanById(id: string) {
    if (await isDatabaseReachable()) {
      const plan = await prisma.plan.findUnique({
        where: { id },
      });
      if (!plan) {
        throw new Error('Không tìm thấy thông tin gói tập.');
      }
      return plan;
    } else {
      const plan = inMemoryPlansList.find((p) => p.id === id);
      if (!plan) {
        throw new Error('Không tìm thấy thông tin gói tập.');
      }
      return plan;
    }
  }

  async createPlan(data: CreatePlanDto) {
    if (await isDatabaseReachable()) {
      const defaultGym = await prisma.gym.findFirst();
      if (!defaultGym) {
        throw new Error('Chưa có phòng gym nào trong hệ thống. Vui lòng tạo gym trước.');
      }

      const newPlan = await prisma.plan.create({
        data: {
          gymId: defaultGym.id,
          name: data.name.trim(),
          type: data.type,
          price: data.price,
          durationDays: data.durationDays ?? null,
          totalSessions: data.totalSessions ?? null,
          description: data.description?.trim() ?? null,
          isActive: data.isActive ?? true,
        },
      });
      return newPlan;
    } else {
      const newPlan: PlanRecord = {
        id: `plan_${Date.now()}`,
        gymId: 'gym-boutique-01',
        name: data.name.trim(),
        type: data.type as PlanType,
        price: data.price,
        durationDays: data.durationDays ?? null,
        totalSessions: data.totalSessions ?? null,
        description: data.description?.trim() ?? null,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      inMemoryPlansList.push(newPlan);
      return newPlan;
    }
  }

  async updatePlan(id: string, data: UpdatePlanDto) {
    if (await isDatabaseReachable()) {
      const plan = await prisma.plan.findUnique({ where: { id } });
      if (!plan) {
        throw new Error('Không tìm thấy gói tập cần cập nhật.');
      }

      const updated = await prisma.plan.update({
        where: { id },
        data: {
          name: data.name ? data.name.trim() : undefined,
          type: data.type,
          price: data.price,
          durationDays: data.durationDays !== undefined ? data.durationDays : undefined,
          totalSessions: data.totalSessions !== undefined ? data.totalSessions : undefined,
          description: data.description !== undefined ? data.description?.trim() ?? null : undefined,
          isActive: data.isActive !== undefined ? data.isActive : undefined,
        },
      });
      return updated;
    } else {
      const index = inMemoryPlansList.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Không tìm thấy gói tập cần cập nhật.');
      }

      const current = inMemoryPlansList[index];
      const updated: PlanRecord = {
        ...current,
        name: data.name ? data.name.trim() : current.name,
        type: (data.type as PlanType) || current.type,
        price: data.price !== undefined ? data.price : current.price,
        durationDays: data.durationDays !== undefined ? data.durationDays : current.durationDays,
        totalSessions: data.totalSessions !== undefined ? data.totalSessions : current.totalSessions,
        description: data.description !== undefined ? data.description : current.description,
        isActive: data.isActive !== undefined ? data.isActive : current.isActive,
        updatedAt: new Date().toISOString(),
      };

      inMemoryPlansList[index] = updated;
      return updated;
    }
  }

  async deletePlan(id: string) {
    if (await isDatabaseReachable()) {
      const plan = await prisma.plan.findUnique({
        where: { id },
        include: { memberships: true },
      });
      if (!plan) {
        throw new Error('Không tìm thấy gói tập cần xóa.');
      }

      if (plan.memberships.length > 0) {
        // Soft delete (deactivate) if there are memberships attached
        await prisma.plan.update({
          where: { id },
          data: { isActive: false },
        });
        return { message: 'Gói tập đã có hội viên đăng ký, đã chuyển sang trạng thái Ngưng kích hoạt.' };
      } else {
        await prisma.plan.delete({ where: { id } });
        return { message: 'Đã xóa gói tập thành công.' };
      }
    } else {
      const index = inMemoryPlansList.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error('Không tìm thấy gói tập cần xóa.');
      }
      inMemoryPlansList[index].isActive = false;
      return { message: 'Đã cập nhật trạng thái ngưng kích hoạt gói tập thành công.' };
    }
  }
}

export const plansService = new PlansService();
