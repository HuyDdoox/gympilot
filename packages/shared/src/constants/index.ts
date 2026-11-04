export const Role = {
  OWNER: 'OWNER',
  STAFF: 'STAFF',
  TRAINER: 'TRAINER',
  MEMBER: 'MEMBER',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const MemberStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;
export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];

export const PlanType = {
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  SESSION_PACK: 'SESSION_PACK',
  DROP_IN: 'DROP_IN',
} as const;
export type PlanType = (typeof PlanType)[keyof typeof PlanType];

export const MembershipStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
} as const;
export type MembershipStatus = (typeof MembershipStatus)[keyof typeof MembershipStatus];

export const BookingStatus = {
  BOOKED: 'BOOKED',
  ATTENDED: 'ATTENDED',
  CANCELLED: 'CANCELLED',
  WAITLISTED: 'WAITLISTED',
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const CheckInMethod = {
  QR: 'QR',
  STAFF: 'STAFF',
} as const;
export type CheckInMethod = (typeof CheckInMethod)[keyof typeof CheckInMethod];

export const PaymentMethod = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
  MOMO: 'MOMO',
  VNPAY: 'VNPAY',
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const NotificationType = {
  CLASS_REMINDER: 'CLASS_REMINDER',
  MEMBERSHIP_EXPIRING: 'MEMBERSHIP_EXPIRING',
  SESSIONS_LOW: 'SESSIONS_LOW',
  PAYMENT_REMINDER: 'PAYMENT_REMINDER',
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
