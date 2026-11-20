import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, UserCheck, Shield, Mail } from 'lucide-react';
import { LoginSchema, type Role } from '@gympilot/shared';
import { authStorage } from '@/lib/auth';
import { authService, type LoginInput } from '@/lib/authService';
import { zodResolver } from '@/lib/zodResolver';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
} from '@/components/ui';
import { AuthLayout, PasswordInput, AuthAlert } from './components';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL cần quay lại nếu người dùng bị redirect từ ProtectedRoute
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const [authError, setAuthError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const redirectUserByRole = (userRole: Role) => {
    if (fromLocation && fromLocation !== '/login') {
      navigate(fromLocation, { replace: true });
      return;
    }

    if (userRole === 'OWNER') {
      navigate('/owner/dashboard', { replace: true });
    } else if (userRole === 'STAFF') {
      navigate('/staff/today', { replace: true });
    } else {
      // Member về Member Homepage
      navigate('/', { replace: true });
    }
  };

  const handleFormSubmit = async (data: LoginInput) => {
    setAuthError(null);
    try {
      // Gọi qua Auth Service kết nối Backend API thực tế
      const result = await authService.login(data);
      redirectUserByRole(result.user.role);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Email hoặc mật khẩu không chính xác.');
    }
  };

  // 1-Click Fast Login cho kiểm thử môi trường (Demo Roles)
  const handleQuickDemoLogin = (role: 'MEMBER' | 'OWNER') => {
    const isOwner = role === 'OWNER';
    const token = `gympilot_jwt_${role.toLowerCase()}_${Date.now()}`;
    authStorage.setToken(token);
    authStorage.setUser({
      id: isOwner ? 'owner-01' : 'member-vyan-01',
      gymId: 'gym-boutique-01',
      email: isOwner ? 'owner@gympilot.vn' : 'vyan.mai@gympilot.vn',
      fullName: isOwner ? 'Nguyễn Văn Chủ' : 'Mai Thị Vy An',
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    redirectUserByRole(role);
  };

  return (
    <AuthLayout
      title="Đăng nhập tài khoản"
      subtitle="Truy cập cổng dịch vụ hội viên và trung tâm điều hành GymPilot"
      maxWidth="md"
    >
      <Card className="bg-white border border-slate-200/80 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-slate-900">
            Chào mừng bạn trở lại
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Nhập email và mật khẩu để tiếp tục vào hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6 pt-2">
          {/* Thông báo lỗi nếu có */}
          {authError && <AuthAlert type="error" message={authError} />}

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
            <div>
              <Input
                label="Email đăng nhập"
                type="email"
                placeholder="vyan.mai@gympilot.vn"
                isRequired
                leftIcon={<Mail className="w-4 h-4" />}
                className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div>
              <PasswordInput
                label="Mật khẩu"
                placeholder="••••••••"
                isRequired
                className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Checkbox Ghi nhớ & Quên mật khẩu */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút Đăng nhập */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2.5 shadow-md shadow-emerald-500/20"
            >
              <span>Đăng nhập hệ thống</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Link sang Đăng ký */}
          <div className="text-center pt-2 text-xs text-slate-600">
            <span>Chưa có tài khoản quản lý phòng gym? </span>
            <Link
              to="/register"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>

          {/* 1-Click Fast Login Demo Roles */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Đăng nhập nhanh cho kiểm thử (Demo Roles)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold py-2"
                onClick={() => handleQuickDemoLogin('MEMBER')}
                leftIcon={<UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
              >
                Hội viên (Vy An)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-center text-slate-700 hover:bg-slate-50 border-slate-200 text-xs font-semibold py-2"
                onClick={() => handleQuickDemoLogin('OWNER')}
                leftIcon={<Shield className="w-3.5 h-3.5 text-indigo-600" />}
              >
                Chủ phòng (Owner)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
