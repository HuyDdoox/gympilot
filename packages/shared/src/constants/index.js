export const Role = {
    OWNER: 'OWNER',
    STAFF: 'STAFF',
    TRAINER: 'TRAINER',
    MEMBER: 'MEMBER',
};
export const MemberStatus = {
    ACTIVE: 'ACTIVE',
    PAUSED: 'PAUSED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};
export const PlanType = {
    MONTHLY: 'MONTHLY',
    QUARTERLY: 'QUARTERLY',
    SESSION_PACK: 'SESSION_PACK',
    DROP_IN: 'DROP_IN',
};
export const MembershipStatus = {
    ACTIVE: 'ACTIVE',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};
export const BookingStatus = {
    BOOKED: 'BOOKED',
    ATTENDED: 'ATTENDED',
    CANCELLED: 'CANCELLED',
    WAITLISTED: 'WAITLISTED',
};
export const CheckInMethod = {
    QR: 'QR',
    STAFF: 'STAFF',
};
export const PaymentMethod = {
    BANK_TRANSFER: 'BANK_TRANSFER',
    CASH: 'CASH',
    MOMO: 'MOMO',
    VNPAY: 'VNPAY',
};
export const PaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};
export const NotificationType = {
    CLASS_REMINDER: 'CLASS_REMINDER',
    MEMBERSHIP_EXPIRING: 'MEMBERSHIP_EXPIRING',
    SESSIONS_LOW: 'SESSIONS_LOW',
    PAYMENT_REMINDER: 'PAYMENT_REMINDER',
    BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
};
export const ErrorCode = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    BAD_REQUEST: 'BAD_REQUEST',
};
//# sourceMappingURL=index.js.map