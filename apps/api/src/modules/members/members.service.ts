import { Role, MemberStatus, MembershipStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { prisma } from '../../prisma/client.js';
import { hashPassword } from '../../utils/password.js';

export interface GetMembersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CreateMemberInput {
  fullName: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  notes?: string;
  planId?: string;
}

export class MembersService {
  async getMembers(query: GetMembersQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};

    if (query.status && Object.values(MemberStatus).includes(query.status as MemberStatus)) {
      whereClause.status = query.status as MemberStatus;
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      whereClause.OR = [
        { user: { fullName: { contains: term, mode: 'insensitive' } } },
        { user: { email: { contains: term, mode: 'insensitive' } } },
        { user: { phone: { contains: term, mode: 'insensitive' } } },
      ];
    }

    const [members, totalItems] = await Promise.all([
      prisma.member.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
              role: true,
              isActive: true,
            },
          },
          memberships: {
            where: { status: MembershipStatus.ACTIVE },
            include: {
              plan: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { joinedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.member.count({ where: whereClause }),
    ]);

    const formattedMembers = members.map((m) => {
      const activeMembership = m.memberships[0];
      return {
        id: m.id,
        userId: m.userId,
        fullName: m.user.fullName,
        email: m.user.email,
        phone: m.user.phone || 'Chưa cập nhật',
        gender: m.gender || 'Khác',
        dateOfBirth: m.dateOfBirth ? m.dateOfBirth.toISOString().split('T')[0] : null,
        status: m.status,
        qrToken: m.qrToken,
        notes: m.notes,
        joinedAt: m.joinedAt.toISOString(),
        activeMembership: activeMembership
          ? {
              id: activeMembership.id,
              planName: activeMembership.plan.name,
              planType: activeMembership.plan.type,
              price: activeMembership.plan.price,
              startDate: activeMembership.startDate.toISOString().split('T')[0],
              endDate: activeMembership.endDate ? activeMembership.endDate.toISOString().split('T')[0] : null,
              sessionsLeft: activeMembership.sessionsLeft,
              status: activeMembership.status,
            }
          : null,
      };
    });

    return {
      members: formattedMembers,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  async createMember(data: CreateMemberInput) {
    // 1. Tìm phòng gym mặc định
    const defaultGym = await prisma.gym.findFirst();
    if (!defaultGym) {
      throw new Error('Chưa có phòng gym nào trong hệ thống. Vui lòng tạo gym trước.');
    }

    // 2. Kiểm tra email đã tồn tại hay chưa
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });
    if (existingUser) {
      throw new Error(`Email "${data.email}" đã được sử dụng bởi tài khoản khác.`);
    }

    // 3. Mật khẩu mặc định
    const defaultPasswordHash = await hashPassword('GymPilot@2026');

    // 4. Tạo User và Member trong transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          gymId: defaultGym.id,
          email: data.email.toLowerCase().trim(),
          passwordHash: defaultPasswordHash,
          fullName: data.fullName.trim(),
          phone: data.phone?.trim() || null,
          role: Role.MEMBER,
          isActive: true,
        },
      });

      const member = await tx.member.create({
        data: {
          userId: user.id,
          gymId: defaultGym.id,
          gender: data.gender || 'Khác',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          notes: data.notes?.trim() || null,
          status: MemberStatus.ACTIVE,
        },
      });

      // Nếu có chọn gói tập, gán luôn Membership và Payment
      if (data.planId) {
        const plan = await tx.plan.findUnique({
          where: { id: data.planId },
        });

        if (plan) {
          const startDate = new Date();
          let endDate: Date | null = null;
          let sessionsLeft: number | null = null;

          if (plan.durationDays) {
            endDate = new Date(startDate.getTime() + plan.durationDays * 86400000);
          }
          if (plan.totalSessions) {
            sessionsLeft = plan.totalSessions;
          }

          const membership = await tx.membership.create({
            data: {
              memberId: member.id,
              planId: plan.id,
              startDate,
              endDate,
              sessionsLeft,
              status: MembershipStatus.ACTIVE,
            },
          });

          await tx.payment.create({
            data: {
              membershipId: membership.id,
              amount: plan.price,
              method: PaymentMethod.CASH,
              status: PaymentStatus.PAID,
              paidAt: startDate,
              createdById: user.id,
              note: `Thanh toán kích hoạt gói ${plan.name}`,
            },
          });
        }
      }

      return {
        id: member.id,
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: member.status,
        qrToken: member.qrToken,
      };
    });

    return result;
  }
}

export const membersService = new MembersService();
