import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '@gympilot/shared';

interface RoleGuardProps {
  allowedRoles: Role[];
  userRole?: Role;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, userRole }) => {
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
