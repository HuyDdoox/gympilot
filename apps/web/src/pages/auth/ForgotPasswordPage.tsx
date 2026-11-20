import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Mail, ArrowLeft, KeyRound, CheckCircle2, Send, Key } from 'lucide-react';
import { zodResolver } from '@/lib/zodResolver';
import { authService } from '@/lib/authService';
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

const RequestResetSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập địa chỉ email').email('Email không đúng định dạng'),
});

const ConfirmResetSchema = z
  .object({
    resetToken: z.string().min(1, 'Vui lòng nhập mã xác thực khôi phục'),
    newPassword: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RequestResetInput = z.infer<typeof RequestResetSchema>;
type ConfirmResetInput = z.infer<typeof ConfirmResetSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'REQUEST' | 'RESET' | 'SUCCESS'>('REQUEST');
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [savedResetToken, setSavedResetToken] = useState<string>('');

  // Form 1: Request Reset
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors, isSubmitting: isSubmittingRequest },
  } = useForm<RequestResetInput>({
    resolver: zodResolver(RequestResetSchema),
    defaultValues: { email: '' },
  });

  // Form 2: Set New Password
  const {
    register: registerConfirm,
    handleSubmit: handleSubmitConfirm,
    setValue: setConfirmValue,
    formState: { errors: confirmErrors, isSubmitting: isSubmittingConfirm },
  } = useForm<ConfirmResetInput>({
    resolver: zodResolver(ConfirmResetSchema),
    defaultValues: {
      resetToken: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Step 1: Submit email to Backend
  const handleRequestReset = async (data: RequestResetInput) => {
    setAuthError(null);
    try {
      const res = await authService.forgotPassword(data.email);
      if (res.resetToken) {
        setSavedResetToken(res.resetToken);
        setConfirmValue('resetToken', res.resetToken);
      }
      setSuccessMessage('Hệ thống đã tạo mã khôi phục mật khẩu. Vui lòng nhập mật khẩu mới để hoàn tất.');
      setStep('RESET');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Không thể gửi yêu cầu khôi phục mật khẩu.');
    }
  };

  // Step 2: Submit new password to Backend
  const handleConfirmReset = async (data: ConfirmResetInput) => {
    setAuthError(null);
    try {
      const msg = await authService.resetPassword({
        resetToken: data.resetToken,
        newPassword: data.newPassword,
      });
      setSuccessMessage(msg);
      setStep('SUCCESS');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Đặt lại mật khẩu thất bại.');
    }
  };

  return (
    <AuthLayout
      title="Khôi phục mật khẩu"
      subtitle="Bảo mật và an toàn cho tài khoản hệ thống GymPilot"
      maxWidth="md"
    >
      <Card className="bg-white border border-slate-200/80 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="pb-2 pt-6 px-6">
          <CardTitle className="text-xl font-bold text-slate-900">
            {step === 'SUCCESS'
              ? 'Đổi mật khẩu thành công!'
              : step === 'RESET'
              ? 'Thiết lập mật khẩu mới'
              : 'Quên mật khẩu?'}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {step === 'SUCCESS'
              ? 'Mật khẩu của bạn đã được cập nhật thành công vào hệ thống'
              : step === 'RESET'
              ? 'Nhập mã xác thực khôi phục và mật khẩu mới để hoàn tất'
              : 'Nhập email tài khoản của bạn để nhận mã khôi phục bảo mật'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-6 pt-2">
          {authError && <AuthAlert type="error" message={authError} />}

          {step === 'REQUEST' && (
            <form onSubmit={handleSubmitRequest(handleRequestReset)} className="space-y-4" noValidate>
              <div>
                <Input
                  label="Địa chỉ email đã đăng ký"
                  type="email"
                  placeholder="owner@gympilot.vn"
                  isRequired
                  leftIcon={<Mail className="w-4 h-4" />}
                  className="bg-white text-slate-900 border-slate-300 focus:bg-white placeholder:text-slate-400"
                  error={requestErrors.email?.message}
                  {...registerRequest('email')}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmittingRequest}
                className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold py-2.5 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4 mr-1.5" />
                <span>Gửi yêu cầu khôi phục</span>
              </Button>
            </form>
          )}

          {step === 'RESET' && (
            <form onSubmit={handleSubmitConfirm(handleConfirmReset)} className="space-y-4" noValidate>
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                  {successMessage}
                </div>
              )}

              <div>
                <Input
                  label="Mã xác thực khôi phục (Reset Token)"
                  type="text"
                  placeholder="Dán mã khôi phục tại đây"
                  isRequired
                  leftIcon={<Key className="w-4 h-4" />}
                  defaultValue={savedResetToken}
                  error={confirmErrors.resetToken?.message}
                  {...registerConfirm('resetToken')}
                />
              </div>

              <div>
                <PasswordInput
                  label="Mật khẩu mới (tối thiểu 8 ký tự)"
                  placeholder="••••••••"
                  isRequired
                  error={confirmErrors.newPassword?.message}
                  {...registerConfirm('newPassword')}
                />
              </div>

              <div>
                <PasswordInput
                  label="Xác nhận mật khẩu mới"
                  placeholder="••••••••"
                  isRequired
                  error={confirmErrors.confirmPassword?.message}
                  {...registerConfirm('confirmPassword')}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmittingConfirm}
                className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 shadow-md"
              >
                <KeyRound className="w-4 h-4 mr-1.5" />
                <span>Cập nhật mật khẩu mới</span>
              </Button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                {successMessage || 'Mật khẩu đã được cập nhật thành công. Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay bây giờ.'}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
              >
                <span>Đăng nhập ngay</span>
              </Link>
            </div>
          )}

          {/* Quay lại đăng nhập */}
          {step !== 'SUCCESS' && (
            <div className="pt-2 border-t border-slate-100 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Quay lại trang Đăng nhập</span>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
