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

export interface UpdateMemberInput {
  fullName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  notes?: string;
  status?: MemberStatus;
}

export interface CsvRowError {
  row: number;
  field: string;
  message: string;
}

export interface CsvPreviewRow {
  row: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  notes: string;
  isValid: boolean;
  errors: string[];
}

export interface MemberRecord {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string | null;
  status: MemberStatus;
  qrToken: string;
  notes: string | null;
  joinedAt: string;
  activeMembership: {
    id: string;
    planName: string;
    planType: string;
    price: number;
    startDate: string;
    endDate: string | null;
    sessionsLeft: number | null;
    status: string;
  } | null;
}

// In-memory seed of 20 members (aligned with seed.ts)
const initialSeedMembers: MemberRecord[] = [
  {
    id: 'mem_01',
    userId: 'usr_mem_01',
    fullName: 'Phạm Thị Thùy Dung',
    email: 'member01@gympilot.vn',
    phone: '0912345601',
    gender: 'Nữ',
    dateOfBirth: '1995-04-12',
    status: MemberStatus.ACTIVE,
    qrToken: 'qr_token_mem_01',
    notes: 'Hội viên tập Yoga buổi sáng',
    joinedAt: '2026-01-10T08:00:00.000Z',
    activeMembership: {
      id: 'ms_01',
      planName: 'Gói Hội viên Vàng (Gold)',
      planType: 'MONTHLY',
      price: 1200000,
      startDate: '2026-01-10',
      endDate: '2026-07-10',
      sessionsLeft: null,
      status: 'ACTIVE',
    },
  },
  {
    id: 'mem_02',
    userId: 'usr_mem_02',
    fullName: 'Trần Văn Nam',
    email: 'member02@gympilot.vn',
    phone: '0912345602',
    gender: 'Nam',
    dateOfBirth: '1990-08-25',
    status: MemberStatus.ACTIVE,
    qrToken: 'qr_token_mem_02',
    notes: 'Tập Gym tăng cơ',
    joinedAt: '2026-01-15T09:30:00.000Z',
    activeMembership: {
      id: 'ms_02',
      planName: 'Gói Kim Cương (Diamond VIP)',
      planType: 'QUARTERLY',
      price: 2800000,
      startDate: '2026-01-15',
      endDate: '2026-10-15',
      sessionsLeft: null,
      status: 'ACTIVE',
    },
  },
  {
    id: 'mem_03',
    userId: 'usr_mem_03',
    fullName: 'Lê Thị Thu Thảo',
    email: 'member03@gympilot.vn',
    phone: '0912345603',
    gender: 'Nữ',
    dateOfBirth: '1998-11-03',
    status: MemberStatus.ACTIVE,
    qrToken: 'qr_token_mem_03',
    notes: 'Lớp Pilates Reformer',
    joinedAt: '2026-02-01T10:00:00.000Z',
    activeMembership: {
      id: 'ms_03',
      planName: 'Gói 20 Buổi Pilates',
      planType: 'SESSION_PACK',
      price: 1600000,
      startDate: '2026-02-01',
      endDate: '2026-05-01',
      sessionsLeft: 14,
      status: 'ACTIVE',
    },
  },
  {
    id: 'mem_04',
    userId: 'usr_mem_04',
    fullName: 'Hoàng Minh Đức',
    email: 'member04@gympilot.vn',
    phone: '0912345604',
    gender: 'Nam',
    dateOfBirth: '1992-06-18',
    status: MemberStatus.PAUSED,
    qrToken: 'qr_token_mem_04',
    notes: 'Tạm dừng bảo lưu 1 tháng',
    joinedAt: '2026-02-10T14:20:00.000Z',
    activeMembership: {
      id: 'ms_04',
      planName: 'Gói Tiêu Chuẩn (Silver)',
      planType: 'MONTHLY',
      price: 650000,
      startDate: '2026-02-10',
      endDate: '2026-05-10',
      sessionsLeft: null,
      status: 'ACTIVE',
    },
  },
  {
    id: 'mem_05',
    userId: 'usr_mem_05',
    fullName: 'Đỗ Quỳnh Nga',
    email: 'member05@gympilot.vn',
    phone: '0912345605',
    gender: 'Nữ',
    dateOfBirth: '1996-03-30',
    status: MemberStatus.EXPIRED,
    qrToken: 'qr_token_mem_05',
    notes: 'Gói tập đã hết hạn, cần gọi nhắc gia hạn',
    joinedAt: '2025-11-01T08:00:00.000Z',
    activeMembership: null,
  },
  {
    id: 'mem_06',
    userId: 'usr_mem_06',
    fullName: 'Nguyễn Tiến Dũng',
    email: 'member06@gympilot.vn',
    phone: '0912345606',
    gender: 'Nam',
    dateOfBirth: '1988-12-05',
    status: MemberStatus.ACTIVE,
    qrToken: 'qr_token_mem_06',
    notes: 'HLV cá nhân 1-1',
    joinedAt: '2026-02-15T16:00:00.000Z',
    activeMembership: {
      id: 'ms_06',
      planName: 'Gói Kim Cương (Diamond VIP)',
      planType: 'QUARTERLY',
      price: 2800000,
      startDate: '2026-02-15',
      endDate: '2026-11-15',
      sessionsLeft: null,
      status: 'ACTIVE',
    },
  },
  {
    id: 'mem_07',
    userId: 'usr_mem_07',
    fullName: 'Vũ Mai Hương',
    email: 'member07@gympilot.vn',
    phone: '0912345607',
    gender: 'Nữ',
    dateOfBirth: '2000-09-14',
    status: MemberStatus.ACTIVE,
    qrToken: 'qr_token_mem_07',
    notes: 'Hội viên sinh viên',
    joinedAt: '2026-02-20T11:00:00.000Z',
    activeMembership: {
      id: 'ms_07',
      planName: 'Gói Tiêu Chuẩn (Silver)',
      planType: 'MONTHLY',
      price: 650000,
      startDate: '2026-02-20',
      endDate: '2026-05-20',
      sessionsLeft: null,
      status: 'ACTIVE',
    },
  },
  {
    id: 'mem_08',
    userId: 'usr_mem_08',
    fullName: 'Bùi Tuấn Anh',
    email: 'member08@gympilot.vn',
    phone: '0912345608',
    gender: 'Nam',
    dateOfBirth: '1993-02-22',
    status: MemberStatus.CANCELLED,
    qrToken: 'qr_token_mem_08',
    notes: 'Chuyển công tác ra Hà Nội',
    joinedAt: '2025-10-01T09:00:00.000Z',
    activeMembership: null,
  },
];

export const inMemoryMembersList: MemberRecord[] = [...initialSeedMembers];

let dbReachableCache: boolean | null = null;
let lastCheckTime = 0;

async function isDatabaseReachable(): Promise<boolean> {
  const now = Date.now();
  if (dbReachableCache !== null && now - lastCheckTime < 30000) {
    return dbReachableCache;
  }

  const timeoutPromise = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 200));
  const queryPromise = prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);

  try {
    dbReachableCache = await Promise.race([queryPromise, timeoutPromise]);
    lastCheckTime = now;
    return dbReachableCache;
  } catch {
    dbReachableCache = false;
    lastCheckTime = now;
    return false;
  }
}

export class MembersService {
  async getMembers(query: GetMembersQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    if (await isDatabaseReachable()) {
      const whereClause: Record<string, unknown> = {};

      if (query.status && query.status !== 'ALL' && Object.values(MemberStatus).includes(query.status as MemberStatus)) {
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
    } else {
      // In-memory fallback
      let filtered = [...inMemoryMembersList];

      if (query.status && query.status !== 'ALL') {
        filtered = filtered.filter((m) => m.status === query.status);
      }

      if (query.search && query.search.trim()) {
        const term = query.search.trim().toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.fullName.toLowerCase().includes(term) ||
            m.email.toLowerCase().includes(term) ||
            m.phone.toLowerCase().includes(term)
        );
      }

      const totalItems = filtered.length;
      const paginatedMembers = filtered.slice(skip, skip + limit);

      return {
        members: paginatedMembers,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      };
    }
  }

  async getMemberById(id: string) {
    if (await isDatabaseReachable()) {
      const member = await prisma.member.findUnique({
        where: { id },
        include: {
          user: true,
          memberships: {
            include: { plan: true, payments: true },
            orderBy: { createdAt: 'desc' },
          },
          checkIns: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!member) {
        throw new Error('Không tìm thấy thông tin hội viên với mã đã cung cấp.');
      }

      const activeMembership = member.memberships.find((ms) => ms.status === MembershipStatus.ACTIVE);

      return {
        id: member.id,
        userId: member.userId,
        fullName: member.user.fullName,
        email: member.user.email,
        phone: member.user.phone || 'Chưa cập nhật',
        gender: member.gender || 'Khác',
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.toISOString().split('T')[0] : null,
        status: member.status,
        qrToken: member.qrToken,
        notes: member.notes,
        joinedAt: member.joinedAt.toISOString(),
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
        recentCheckIns: member.checkIns.map((c) => ({
          id: c.id,
          method: c.method,
          createdAt: c.createdAt.toISOString(),
          note: c.note,
        })),
      };
    } else {
      const member = inMemoryMembersList.find((m) => m.id === id || m.userId === id);
      if (!member) {
        throw new Error('Không tìm thấy thông tin hội viên với mã đã cung cấp.');
      }
      return {
        ...member,
        recentCheckIns: [
          {
            id: 'ci_01',
            method: 'QR_CODE',
            createdAt: new Date().toISOString(),
            note: 'Check-in tại cổng chính',
          },
          {
            id: 'ci_02',
            method: 'BARCODE',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            note: 'Check-in phòng tập Gym',
          },
        ],
      };
    }
  }

  async createMember(data: CreateMemberInput) {
    const emailNorm = data.email.toLowerCase().trim();

    if (await isDatabaseReachable()) {
      const defaultGym = await prisma.gym.findFirst();
      if (!defaultGym) {
        throw new Error('Chưa có phòng gym nào trong hệ thống. Vui lòng tạo gym trước.');
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: emailNorm },
      });
      if (existingUser) {
        throw new Error(`Email "${data.email}" đã được sử dụng bởi tài khoản khác.`);
      }

      const defaultPasswordHash = await hashPassword('GymPilot@2026');

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            gymId: defaultGym.id,
            email: emailNorm,
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
    } else {
      // In-memory fallback
      const exists = inMemoryMembersList.some((m) => m.email.toLowerCase() === emailNorm);
      if (exists) {
        throw new Error(`Email "${data.email}" đã được sử dụng bởi tài khoản khác.`);
      }

      const newId = `mem_${Date.now()}`;
      const newUserId = `usr_${Date.now()}`;
      const newMember: MemberRecord = {
        id: newId,
        userId: newUserId,
        fullName: data.fullName.trim(),
        email: emailNorm,
        phone: data.phone?.trim() || 'Chưa cập nhật',
        gender: data.gender || 'Khác',
        dateOfBirth: data.dateOfBirth || null,
        status: MemberStatus.ACTIVE,
        qrToken: `qr_token_${newId}`,
        notes: data.notes?.trim() || null,
        joinedAt: new Date().toISOString(),
        activeMembership: data.planId
          ? {
              id: `ms_${Date.now()}`,
              planName: 'Gói tập kích hoạt mới',
              planType: 'MONTHLY',
              price: 1200000,
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
              sessionsLeft: null,
              status: 'ACTIVE',
            }
          : null,
      };

      inMemoryMembersList.unshift(newMember);
      return newMember;
    }
  }

  async updateMember(id: string, data: UpdateMemberInput) {
    if (await isDatabaseReachable()) {
      const member = await prisma.member.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!member) {
        throw new Error('Không tìm thấy hội viên cần cập nhật.');
      }

      const result = await prisma.$transaction(async (tx) => {
        if (data.fullName || data.phone !== undefined) {
          await tx.user.update({
            where: { id: member.userId },
            data: {
              fullName: data.fullName ? data.fullName.trim() : undefined,
              phone: data.phone !== undefined ? data.phone.trim() : undefined,
            },
          });
        }

        const updatedMember = await tx.member.update({
          where: { id },
          data: {
            gender: data.gender !== undefined ? data.gender : undefined,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            notes: data.notes !== undefined ? data.notes.trim() : undefined,
            status: data.status ? data.status : undefined,
          },
          include: { user: true },
        });

        return updatedMember;
      });

      return result;
    } else {
      const member = inMemoryMembersList.find((m) => m.id === id);
      if (!member) {
        throw new Error('Không tìm thấy hội viên cần cập nhật.');
      }

      if (data.fullName) member.fullName = data.fullName.trim();
      if (data.phone !== undefined) member.phone = data.phone.trim();
      if (data.gender !== undefined) member.gender = data.gender;
      if (data.dateOfBirth !== undefined) member.dateOfBirth = data.dateOfBirth;
      if (data.notes !== undefined) member.notes = data.notes.trim();
      if (data.status) member.status = data.status;

      return member;
    }
  }

  async deleteMember(id: string) {
    if (await isDatabaseReachable()) {
      const member = await prisma.member.findUnique({ where: { id } });
      if (!member) throw new Error('Hội viên không tồn tại.');
      await prisma.member.update({
        where: { id },
        data: { status: MemberStatus.CANCELLED },
      });
      return { success: true, message: 'Đã hủy kích hoạt trạng thái hội viên.' };
    } else {
      const idx = inMemoryMembersList.findIndex((m) => m.id === id);
      if (idx === -1) throw new Error('Hội viên không tồn tại.');
      inMemoryMembersList[idx].status = MemberStatus.CANCELLED;
      return { success: true, message: 'Đã hủy kích hoạt trạng thái hội viên.' };
    }
  }

  // Preview CSV without inserting to database
  previewCsv(csvContent: string): {
    totalRows: number;
    validCount: number;
    invalidCount: number;
    previewRows: CsvPreviewRow[];
    errors: CsvRowError[];
  } {
    if (!csvContent || !csvContent.trim()) {
      throw new Error('Tập tin CSV không có nội dung hoặc rỗng.');
    }

    const lines = csvContent
      .replace(/^\uFEFF/, '') // Strip UTF-8 BOM
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      throw new Error('Tệp CSV phải có ít nhất 1 dòng tiêu đề và 1 dòng dữ liệu.');
    }

    const headers = lines[0].split(',').map((h) => h.replace(/["']/g, '').trim().toLowerCase());

    // Validate expected columns
    const hasName = headers.some((h) => h.includes('tên') || h.includes('name'));
    const hasEmail = headers.some((h) => h.includes('email') || h.includes('mail'));

    if (!hasName || !hasEmail) {
      throw new Error('Tệp CSV thiếu các cột bắt buộc: "Họ và tên", "Email".');
    }

    const previewRows: CsvPreviewRow[] = [];
    const errors: CsvRowError[] = [];
    const seenEmails = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const rawCols = lines[i].split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
      const fullName = rawCols[0] || '';
      const email = (rawCols[1] || '').toLowerCase();
      const phone = rawCols[2] || '';
      const gender = rawCols[3] || 'Khác';
      const dateOfBirth = rawCols[4] || '';
      const notes = rawCols[5] || '';

      const rowErrors: string[] = [];

      if (!fullName || fullName.length < 2) {
        rowErrors.push('Họ tên hội viên phải từ 2 ký tự trở lên.');
        errors.push({ row: i + 1, field: 'fullName', message: 'Họ tên hội viên phải từ 2 ký tự trở lên.' });
      }

      if (!email) {
        rowErrors.push('Email không được để trống.');
        errors.push({ row: i + 1, field: 'email', message: 'Email không được để trống.' });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        rowErrors.push('Email không đúng định dạng hợp lệ.');
        errors.push({ row: i + 1, field: 'email', message: 'Email không đúng định dạng hợp lệ.' });
      } else if (seenEmails.has(email)) {
        rowErrors.push('Email bị trùng lặp trong tệp CSV này.');
        errors.push({ row: i + 1, field: 'email', message: 'Email bị trùng lặp trong tệp CSV này.' });
      } else {
        seenEmails.add(email);
      }

      if (phone && !/^(0|\+84)[0-9]{9,10}$/.test(phone)) {
        rowErrors.push('Số điện thoại không đúng định dạng 10 số.');
        errors.push({ row: i + 1, field: 'phone', message: 'Số điện thoại không đúng định dạng 10 số.' });
      }

      previewRows.push({
        row: i + 1,
        fullName,
        email,
        phone,
        gender,
        dateOfBirth,
        notes,
        isValid: rowErrors.length === 0,
        errors: rowErrors,
      });
    }

    const validCount = previewRows.filter((r) => r.isValid).length;
    const invalidCount = previewRows.filter((r) => !r.isValid).length;

    return {
      totalRows: previewRows.length,
      validCount,
      invalidCount,
      previewRows,
      errors,
    };
  }

  // Import confirmed valid rows into Database/Store
  async importCsv(rows: Array<{
    fullName: string;
    email: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    notes?: string;
  }>) {
    let importedCount = 0;
    let failedCount = 0;
    const errors: Array<{ row: number; email: string; message: string }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await this.createMember({
          fullName: row.fullName,
          email: row.email,
          phone: row.phone,
          gender: row.gender,
          dateOfBirth: row.dateOfBirth,
          notes: row.notes,
        });
        importedCount++;
      } catch (err) {
        failedCount++;
        errors.push({
          row: i + 1,
          email: row.email,
          message: err instanceof Error ? err.message : 'Lỗi không xác định khi lưu hội viên',
        });
      }
    }

    return {
      totalSubmitted: rows.length,
      importedCount,
      failedCount,
      errors,
    };
  }

  // Return standard CSV template with UTF-8 BOM
  getTemplateCsv(): string {
    const BOM = '\uFEFF';
    const csvContent =
      'Họ và tên,Email,Số điện thoại,Giới tính,Ngày sinh (YYYY-MM-DD),Ghi chú\n' +
      'Nguyễn Văn An,nguyenvanan@gmail.com,0901234567,Nam,1995-05-15,Hội viên mới đăng ký\n' +
      'Trần Thị Mai,tranmai@gmail.com,0987654321,Nữ,1998-08-20,Ưu tiên lớp Yoga sáng\n' +
      'Lê Hoàng Long,hoanglong@gmail.com,0912345678,Nam,1992-12-01,Tập Gym tăng cơ';

    return BOM + csvContent;
  }
}

export const membersService = new MembersService();
