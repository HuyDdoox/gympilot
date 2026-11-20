import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, User, Mail, Phone, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { RegisterOwnerSchema } from '@gympilot/shared';
import { authService, type RegisterOwnerInput } from '@/lib/authService';
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

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterOwnerInput>({
    resolver: zodResolver(RegisterOwnerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phone: '',
      gymName: '',
      gymAddress: '',
    },
  });

  const handleFormSubmit = async (data: RegisterOwnerInput) => {
    setAuthError(null);
    setSuccessInfo(null);

    try {
      // Gọi service kết nối Backend API đăng ký thực tế
      await authService.register(data);
      setSuccessInfo('Đăng ký tài khoản chủ phòng thành công! Đang chuyển hướng về trang quản trị...');
      setTimeout(() => {
        navigate('/owner/dashboard', { replace: true });
      }, 1200);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Không thể hoàn tất đăng ký tài khoản.');
    }
  };

  return (
    <AuthLayout
      title="Đăng ký đối tác GymPilot"
      subtitle="Giải pháp toàn diện quản lý hội viên, lịch tập và thanh toán cho phòng tập boutique"
      maxWidth="lg"
    >
      <Card className="bg-white border border-slate-200/80 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-900">
              Thông tin phòng tập &amp; Chủ cơ sở
            </CardTitle>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Dành cho Chủ phòng tập
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Điền các thông tin theo hợp đồng API hệ thống để thiết lập phòng tập
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 sm:px-8 pb-6 pt-2">
          {/* Thông báo trạng thái */}
          {authError && <AuthAlert type="error" message={authError} />}
          {successInfo && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <p className="leading-relaxed font-medium">{successInfo}</p>
                <div className="pt-1">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    <span>Đến trang Đăng nhập</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Form đăng ký */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Họ và tên chủ phòng"
                  placeholder="Nguyễn Văn Chủ"
                  isRequired
                  leftIcon={<User className="w-4 h-4" />}
                  className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                  error={errors.fullName?.message}
                  {...register('fullName')}
                />
              </div>

              <div>
                <Input
                  label="Số điện thoại"
                  type="tel"
                  placeholder="0987654321"
                  leftIcon={<Phone className="w-4 h-4" />}
                  className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>
            </div>

            <div>
              <Input
                label="Email doanh nghiệp"
                type="email"
                placeholder="owner@gympilot.vn"
                isRequired
                leftIcon={<Mail className="w-4 h-4" />}
                className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Tên phòng gym / câu lạc bộ"
                  placeholder="Boutique Fitness Studio"
                  isRequired
                  leftIcon={<Building2 className="w-4 h-4" />}
                  className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                  error={errors.gymName?.message}
                  {...register('gymName')}
                />
              </div>

              <div>
                <Input
                  label="Địa chỉ phòng tập"
                  placeholder="Số 123 Đường ABC, Quận 1, TP.HCM"
                  leftIcon={<MapPin className="w-4 h-4" />}
                  className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                  error={errors.gymAddress?.message}
                  {...register('gymAddress')}
                />
              </div>
            </div>

            <div>
              <PasswordInput
                label="Mật khẩu khởi tạo"
                placeholder="Tối thiểu 8 ký tự"
                isRequired
                helperText="Mật khẩu cần có tối thiểu 8 ký tự an toàn"
                className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            {/* Nút gửi form */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2.5 shadow-md shadow-emerald-500/20"
              >
                <span>Đăng ký tài khoản phòng tập</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>

          {/* Link sang Đăng nhập */}
          <div className="text-center pt-2 text-xs text-slate-600">
            <span>Đã có tài khoản đối tác hoặc hội viên? </span>
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;
