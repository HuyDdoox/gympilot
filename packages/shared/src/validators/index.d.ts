import { z } from 'zod';
export declare const RoleEnumSchema: z.ZodEnum<["OWNER", "STAFF", "TRAINER", "MEMBER"]>;
export declare const MemberStatusEnumSchema: z.ZodEnum<["ACTIVE", "PAUSED", "EXPIRED", "CANCELLED"]>;
export declare const PlanTypeEnumSchema: z.ZodEnum<["MONTHLY", "QUARTERLY", "SESSION_PACK", "DROP_IN"]>;
export declare const PaymentMethodEnumSchema: z.ZodEnum<["BANK_TRANSFER", "CASH", "MOMO", "VNPAY"]>;
export declare const RegisterOwnerSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    gymName: z.ZodString;
    gymAddress: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    fullName: string;
    email: string;
    password: string;
    gymName: string;
    phone?: string | undefined;
    gymAddress?: string | undefined;
}, {
    fullName: string;
    email: string;
    password: string;
    gymName: string;
    phone?: string | undefined;
    gymAddress?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RefreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
//# sourceMappingURL=index.d.ts.map