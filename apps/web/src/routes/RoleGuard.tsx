import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '@gympilot/shared';
import { authStorage } from '../lib/auth';

interface RoleGuardProps {
  allowedRoles: Role[];
  userRole?: Role;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, userRole }) => {
  const effectiveRole = userRole || authStorage.getUserRole() || undefined;
  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default RoleGuard;
