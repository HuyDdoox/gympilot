import type {
  Role,
  MemberStatus,
  PlanType,
  MembershipStatus,
  BookingStatus,
  CheckInMethod,
  PaymentMethod,
  PaymentStatus,
  NotificationType,
} from '../constants/index.js';

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  code: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface GymDto {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  logoUrl?: string | null;
  openTime?: string | null;
  closeTime?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserDto {
  id: string;
  gymId: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MemberDto {
  id: string;
  userId: string;
  gymId: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  notes?: string | null;
  status: MemberStatus;
  qrToken: string;
  joinedAt: string;
  updatedAt: string;
}

export interface TrainerDto {
  id: string;
  userId: string;
  gymId: string;
  specialty?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDto {
  id: string;
  gymId: string;
  name: string;
  type: PlanType;
  price: number;
  durationDays?: number | null;
  totalSessions?: number | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipDto {
  id: string;
  memberId: string;
  planId: string;
  startDate: string;
  endDate?: string | null;
  sessionsLeft?: number | null;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDto {
  id: string;
  memberId: string;
  sessionId: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInDto {
  id: string;
  memberId: string;
  method: CheckInMethod;
  note?: string | null;
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  membershipId?: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string | null;
  createdById: string;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDto {
  id: string;
  memberId: string;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseDto {
  user: UserDto;
  tokens: AuthTokensDto;
}
