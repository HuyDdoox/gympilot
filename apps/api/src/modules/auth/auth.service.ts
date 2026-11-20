import { Role } from '@gympilot/shared';
import { prisma } from '../../prisma/client.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } from '../../utils/jwt.js';

export interface UserRecord {
  id: string;
  gymId: string;
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory fallback accounts matching seed.ts for resilience when external PostgreSQL is not running
const DEFAULT_PASSWORD_HASH = '$2b$10$mqobRSCtL7awrofkYQ72ZOfJUbh0ixVBPnPkRKkOLHtKjE5kSYcFa'; // GymPilot@2026

export const inMemoryUsers: Map<string, UserRecord> = new Map([
  [
    'owner@gympilot.vn',
    {
      id: 'usr_owner_01',
      gymId: 'gym_default_01',
      email: 'owner@gympilot.vn',
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: 'Nguyễn Văn Chủ',
      phone: '0901234567',
      role: Role.OWNER,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ],
  [
    'staff1@gympilot.vn',
    {
      id: 'usr_staff_01',
      gymId: 'gym_default_01',
      email: 'staff1@gympilot.vn',
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: 'Trần Thị Thu Ngân',
      phone: '0902345678',
      role: Role.STAFF,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ],
  [
    'trainer.mai@gympilot.vn',
    {
      id: 'usr_trainer_01',
      gymId: 'gym_default_01',
      email: 'trainer.mai@gympilot.vn',
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: 'Đặng Mai Phương',
      phone: '0903456789',
      role: Role.TRAINER,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ],
  [
    'member01@gympilot.vn',
    {
      id: 'usr_member_01',
      gymId: 'gym_default_01',
      email: 'member01@gympilot.vn',
      passwordHash: DEFAULT_PASSWORD_HASH,
      fullName: 'Phạm Thị Thùy Dung',
      phone: '0912345601',
      role: Role.MEMBER,
      isActive: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
  ],
]);

// Helper to check if Prisma DB is currently reachable with fast timeout & caching
let dbReachableCache: boolean | null = null;
let lastCheckTime = 0;

export async function isDatabaseReachable(): Promise<boolean> {
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

export class AuthService {
  async login(input: { email: string; password: string }) {
    const emailNorm = input.email.toLowerCase().trim();
    let user: UserRecord | null = null;

    if (await isDatabaseReachable()) {
      const dbUser = await prisma.user.findUnique({
        where: { email: emailNorm },
      });
      if (dbUser) {
        user = {
          ...dbUser,
          role: dbUser.role as Role,
        };
      }
    } else {
      user = inMemoryUsers.get(emailNorm) || null;
    }

    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    if (!user.isActive) {
      throw new Error('Tài khoản của bạn đã bị khóa hoặc vô hiệu hóa. Vui lòng liên hệ ban quản trị.');
    }

    // Compare password
    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    const payload = {
      id: user.id,
      gymId: user.gymId,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        gymId: user.gymId,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || null,
        role: user.role,
        isActive: user.isActive,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async registerOwner(input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    gymName: string;
    gymAddress?: string;
  }) {
    const emailNorm = input.email.toLowerCase().trim();

    if (await isDatabaseReachable()) {
      const existing = await prisma.user.findUnique({
        where: { email: emailNorm },
      });
      if (existing) {
        throw new Error(`Email "${input.email}" đã được đăng ký trong hệ thống.`);
      }

      const passwordHash = await hashPassword(input.password);

      const result = await prisma.$transaction(async (tx) => {
        const gym = await tx.gym.create({
          data: {
            name: input.gymName.trim(),
            address: input.gymAddress?.trim() || null,
          },
        });

        const user = await tx.user.create({
          data: {
            gymId: gym.id,
            email: emailNorm,
            passwordHash,
            fullName: input.fullName.trim(),
            phone: input.phone?.trim() || null,
            role: 'OWNER',
            isActive: true,
          },
        });

        return { user, gym };
      });

      const payload = {
        id: result.user.id,
        gymId: result.user.gymId,
        email: result.user.email,
        role: Role.OWNER,
        fullName: result.user.fullName,
      };

      return {
        user: {
          id: result.user.id,
          gymId: result.user.gymId,
          email: result.user.email,
          fullName: result.user.fullName,
          phone: result.user.phone,
          role: Role.OWNER,
          isActive: true,
        },
        tokens: {
          accessToken: signAccessToken(payload),
          refreshToken: signRefreshToken({ id: result.user.id, email: result.user.email }),
        },
      };
    } else {
      // In-memory fallback
      if (inMemoryUsers.has(emailNorm)) {
        throw new Error(`Email "${input.email}" đã được đăng ký trong hệ thống.`);
      }

      const passwordHash = await hashPassword(input.password);
      const newGymId = `gym_${Date.now()}`;
      const newUser: UserRecord = {
        id: `usr_${Date.now()}`,
        gymId: newGymId,
        email: emailNorm,
        passwordHash,
        fullName: input.fullName.trim(),
        phone: input.phone?.trim() || null,
        role: Role.OWNER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      inMemoryUsers.set(emailNorm, newUser);

      const payload = {
        id: newUser.id,
        gymId: newUser.gymId,
        email: newUser.email,
        role: Role.OWNER,
        fullName: newUser.fullName,
      };

      return {
        user: {
          id: newUser.id,
          gymId: newUser.gymId,
          email: newUser.email,
          fullName: newUser.fullName,
          phone: newUser.phone,
          role: Role.OWNER,
          isActive: true,
        },
        tokens: {
          accessToken: signAccessToken(payload),
          refreshToken: signRefreshToken({ id: newUser.id, email: newUser.email }),
        },
      };
    }
  }

  async refreshToken(token: string) {
    if (!token) {
      throw new Error('Refresh token không được để trống.');
    }

    let decoded: { id: string; email: string };
    try {
      decoded = verifyRefreshToken<{ id: string; email: string }>(token);
    } catch {
      throw new Error('Refresh token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
    }

    let user: UserRecord | null = null;
    if (await isDatabaseReachable()) {
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.id },
      });
      if (dbUser) {
        user = { ...dbUser, role: dbUser.role as Role };
      }
    } else {
      user = inMemoryUsers.get(decoded.email.toLowerCase()) || null;
    }

    if (!user || !user.isActive) {
      throw new Error('Tài khoản không tồn tại hoặc đã bị khóa.');
    }

    const payload = {
      id: user.id,
      gymId: user.gymId,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken({ id: user.id, email: user.email });

    return {
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      user: {
        id: user.id,
        gymId: user.gymId,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone || null,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async forgotPassword(email: string) {
    const emailNorm = email.toLowerCase().trim();
    let exists = false;

    if (await isDatabaseReachable()) {
      const dbUser = await prisma.user.findUnique({
        where: { email: emailNorm },
      });
      exists = Boolean(dbUser);
    } else {
      exists = inMemoryUsers.has(emailNorm);
    }

    if (!exists) {
      throw new Error('Không tìm thấy tài khoản với email này.');
    }

    // Generate a temporary reset token (valid for 15 minutes)
    const resetToken = signAccessToken({ email: emailNorm, purpose: 'password_reset' });

    return {
      message: 'Mã khôi phục mật khẩu đã được khởi tạo thành công.',
      resetToken,
    };
  }

  async resetPassword(input: { resetToken: string; newPassword: string }) {
    let decoded: { email: string; purpose?: string };
    try {
      decoded = verifyAccessToken<{ email: string; purpose?: string }>(input.resetToken);
      if (decoded.purpose !== 'password_reset') {
        throw new Error('Token không hợp lệ cho thao tác đặt lại mật khẩu.');
      }
    } catch {
      throw new Error('Mã khôi phục đã hết hạn hoặc không hợp lệ. Vui lòng gửi lại yêu cầu.');
    }

    const emailNorm = decoded.email.toLowerCase();
    const newHash = await hashPassword(input.newPassword);

    if (await isDatabaseReachable()) {
      await prisma.user.update({
        where: { email: emailNorm },
        data: { passwordHash: newHash },
      });
    } else {
      const user = inMemoryUsers.get(emailNorm);
      if (user) {
        user.passwordHash = newHash;
        user.updatedAt = new Date();
      }
    }

    return {
      message: 'Mật khẩu đã được thay đổi thành công. Bạn có thể đăng nhập bằng mật khẩu mới.',
    };
  }

  async getMe(userId: string) {
    let user: UserRecord | null = null;

    if (await isDatabaseReachable()) {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (dbUser) {
        user = { ...dbUser, role: dbUser.role as Role };
      }
    } else {
      for (const u of inMemoryUsers.values()) {
        if (u.id === userId) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      throw new Error('Người dùng không tồn tại.');
    }

    return {
      id: user.id,
      gymId: user.gymId,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || null,
      role: user.role,
      isActive: user.isActive,
    };
  }
}

export const authService = new AuthService();
