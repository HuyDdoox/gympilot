import { z } from 'zod';
import { Role, MemberStatus, PlanType, PaymentMethod, } from '../constants/index.js';
export const RoleEnumSchema = z.enum([
    Role.OWNER,
    Role.STAFF,
    Role.TRAINER,
    Role.MEMBER,
]);
export const MemberStatusEnumSchema = z.enum([
    MemberStatus.ACTIVE,
    MemberStatus.PAUSED,
    MemberStatus.EXPIRED,
    MemberStatus.CANCELLED,
]);
export const PlanTypeEnumSchema = z.enum([
    PlanType.MONTHLY,
    PlanType.QUARTERLY,
    PlanType.SESSION_PACK,
    PlanType.DROP_IN,
]);
export const PaymentMethodEnumSchema = z.enum([
    PaymentMethod.BANK_TRANSFER,
    PaymentMethod.CASH,
    PaymentMethod.MOMO,
    PaymentMethod.VNPAY,
]);
export const RegisterOwnerSchema = z.object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không đúng định dạng'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    phone: z.string().optional(),
    gymName: z.string().min(2, 'Tên phòng gym phải có ít nhất 2 ký tự'),
    gymAddress: z.string().optional(),
});
export const LoginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
export const RefreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token không được để trống'),
});
//# sourceMappingURL=index.js.map