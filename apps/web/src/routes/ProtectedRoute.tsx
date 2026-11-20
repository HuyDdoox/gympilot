import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../lib/auth';

export const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const token = authStorage.getToken();

  if (!token) {
    // Chuyển hướng về đăng nhập và lưu lại vị trí ban đầu để redirect sau khi đăng nhập thành công
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
