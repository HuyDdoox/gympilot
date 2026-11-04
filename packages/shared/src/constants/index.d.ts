export declare const Role: {
    readonly OWNER: "OWNER";
    readonly STAFF: "STAFF";
    readonly TRAINER: "TRAINER";
    readonly MEMBER: "MEMBER";
};
export type Role = (typeof Role)[keyof typeof Role];
export declare const MemberStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly PAUSED: "PAUSED";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
};
export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];
export declare const PlanType: {
    readonly MONTHLY: "MONTHLY";
    readonly QUARTERLY: "QUARTERLY";
    readonly SESSION_PACK: "SESSION_PACK";
    readonly DROP_IN: "DROP_IN";
};
export type PlanType = (typeof PlanType)[keyof typeof PlanType];
export declare const MembershipStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
};
export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];
export declare const BookingStatus: {
    readonly BOOKED: "BOOKED";
    readonly ATTENDED: "ATTENDED";
    readonly CANCELLED: "CANCELLED";
    readonly WAITLISTED: "WAITLISTED";
};
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
export declare const CheckInMethod: {
    readonly QR: "QR";
    readonly STAFF: "STAFF";
};
export type CheckInMethod = (typeof CheckInMethod)[keyof typeof CheckInMethod];
export declare const PaymentMethod: {
    readonly BANK_TRANSFER: "BANK_TRANSFER";
    readonly CASH: "CASH";
    readonly MOMO: "MOMO";
    readonly VNPAY: "VNPAY";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const PaymentStatus: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export declare const NotificationType: {
    readonly CLASS_REMINDER: "CLASS_REMINDER";
    readonly MEMBERSHIP_EXPIRING: "MEMBERSHIP_EXPIRING";
    readonly SESSIONS_LOW: "SESSIONS_LOW";
    readonly PAYMENT_REMINDER: "PAYMENT_REMINDER";
    readonly BOOKING_CONFIRMATION: "BOOKING_CONFIRMATION";
};
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export declare const ErrorCode: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
    readonly BAD_REQUEST: "BAD_REQUEST";
};
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
//# sourceMappingURL=index.d.ts.map