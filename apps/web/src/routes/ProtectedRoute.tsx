import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authStorage } from '../lib/auth';

export const ProtectedRoute: React.FC = () => {
  const token = authStorage.getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
