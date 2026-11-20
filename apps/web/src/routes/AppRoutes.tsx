import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout & Guards
import { AppLayout } from '@/components/layout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Owner Pages
import DashboardPage from '@/pages/owner/DashboardPage';
import MembersPage from '@/pages/owner/MembersPage';
import MemberDetailPage from '@/pages/owner/MemberDetailPage';
import ClassesPage from '@/pages/owner/ClassesPage';
import PlansPage from '@/pages/owner/PlansPage';
import PaymentsPage from '@/pages/owner/PaymentsPage';
import ReportsPage from '@/pages/owner/ReportsPage';

// Staff Pages
import TodayPage from '@/pages/staff/TodayPage';
import CheckInPage from '@/pages/staff/CheckInPage';

// Trainer Pages
import MyClassesPage from '@/pages/trainer/MyClassesPage';

// Member Pages
import MemberDashboardPage from '@/pages/member/MemberDashboardPage';
import ClassBookingPage from '@/pages/member/ClassBookingPage';
import SchedulePage from '@/pages/member/SchedulePage';
import MyMembershipPage from '@/pages/member/MyMembershipPage';
import MyQrPage from '@/pages/member/MyQrPage';
import MemberProfilePage from '@/pages/member/MemberProfilePage';

// 404 Page
import NotFoundPage from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Public Routes: Consumer Homepage, Class Booking & Schedule Browser */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<MemberDashboardPage />} />
        <Route path="/member" element={<MemberDashboardPage />} />
        <Route path="/member/dashboard" element={<MemberDashboardPage />} />
        <Route path="/member/class-booking" element={<ClassBookingPage />} />
        <Route path="/member/booking" element={<ClassBookingPage />} />
        <Route path="/booking" element={<ClassBookingPage />} />
        <Route path="/member/schedule" element={<SchedulePage />} />
        <Route path="/members" element={<MembersPage />} />
      </Route>

      {/* Auth Public Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* 2. Protected Routes wrapped in AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Owner Role Routes */}
          <Route element={<RoleGuard allowedRoles={['OWNER']} />}>
            <Route path="/owner/dashboard" element={<DashboardPage />} />
            <Route path="/owner/members" element={<MembersPage />} />
            <Route path="/owner/members/:id" element={<MemberDetailPage />} />
            <Route path="/owner/classes" element={<ClassesPage />} />
            <Route path="/owner/plans" element={<PlansPage />} />
            <Route path="/owner/payments" element={<PaymentsPage />} />
            <Route path="/owner/reports" element={<ReportsPage />} />
          </Route>

          {/* Staff & Owner Routes */}
          <Route element={<RoleGuard allowedRoles={['OWNER', 'STAFF']} />}>
            <Route path="/staff/today" element={<TodayPage />} />
            <Route path="/staff/check-in" element={<CheckInPage />} />
          </Route>

          {/* Trainer & Owner Routes */}
          <Route element={<RoleGuard allowedRoles={['OWNER', 'TRAINER']} />}>
            <Route path="/trainer/my-classes" element={<MyClassesPage />} />
          </Route>

          {/* Member & Owner Personal Protected Routes */}
          <Route element={<RoleGuard allowedRoles={['OWNER', 'MEMBER']} />}>
            <Route path="/member/my-membership" element={<MyMembershipPage defaultTab="plans" />} />
            {/* Redirect /member/payments directly to Member Profile payments tab */}
            <Route path="/member/payments" element={<Navigate to="/member/profile?tab=payments" replace />} />
            <Route path="/member/my-qr" element={<MyQrPage />} />
            <Route path="/member/profile" element={<MemberProfilePage />} />
          </Route>
        </Route>
      </Route>

      {/* 3. Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
