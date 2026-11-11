import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Dumbbell, ArrowRight, UserCheck, Shield, AlertCircle } from 'lucide-react';
import { authStorage } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input } from '@/components/ui';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get target return url if user was redirected from a protected route
  const fromLocation = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const performLogin = (userRole: 'MEMBER' | 'OWNER' | 'STAFF', userData: {
    id: string;
    email: string;
    fullName: string;
  }) => {
    // Save token and user details to local storage
    const token = `gympilot_jwt_${userRole.toLowerCase()}_${Date.now()}`;
    authStorage.setToken(token);
    authStorage.setUser({
      id: userData.id,
      gymId: 'gym-boutique-01',
      email: userData.email,
      fullName: userData.fullName,
      role: userRole,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Smart 1-step redirect:
    // If a redirect URL was saved, send them back there
    if (fromLocation && fromLocation !== '/login') {
      navigate(fromLocation, { replace: true });
      return;
    }

    // Otherwise route based on verified role
    if (userRole === 'OWNER') {
      navigate('/owner/dashboard', { replace: true });
    } else if (userRole === 'STAFF') {
      navigate('/staff/today', { replace: true });
    } else {
      // Default Member route -> Member Homepage
      navigate('/', { replace: true });
    }
  };

  const handleLoginAsMember = () => {
    performLogin('MEMBER', {
      id: 'member-vyan-01',
      email: 'vyan.mai@gympilot.vn',
      fullName: 'Mai Thị Vy An',
    });
  };

  const handleLoginAsOwner = () => {
    performLogin('OWNER', {
      id: 'owner-01',
      email: 'owner@gympilot.vn',
      fullName: 'Nguyễn Văn Chủ',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);

    // Simulate instant secure auth verification
    setTimeout(() => {
      setIsLoading(false);
      // If email contains "owner" or "admin", log in as OWNER, otherwise as MEMBER
      if (email.toLowerCase().includes('owner') || email.toLowerCase().includes('admin')) {
        performLogin('OWNER', {
          id: 'owner-custom',
          email,
          fullName: 'Chủ Phòng Gym',
        });
      } else {
        performLogin('MEMBER', {
          id: 'member-custom',
          email,
          fullName: email.split('@')[0] || 'Hội viên GymPilot',
        });
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Logo Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Gym<span className="text-emerald-500">Pilot</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 font-medium">Hệ thống quản lý phòng gym, yoga &amp; pilates</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white border-slate-200/80 shadow-lg rounded-2xl p-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-slate-900">Đăng nhập một bước</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Truy cập tài khoản hội viên và hệ thống quản trị
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Email đăng nhập"
                type="email"
                placeholder="vyan.mai@gympilot.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 shadow-sm"
                isLoading={isLoading}
              >
                <span>Đăng nhập hệ thống</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>

            {/* Quick 1-click test role options */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                Đăng nhập nhanh cho kiểm thử (Demo Roles)
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full justify-center bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium"
                onClick={handleLoginAsMember}
                leftIcon={<UserCheck className="w-4 h-4 text-emerald-600" />}
              >
                Vào ngay với vai trò Hội viên (Mai Thị Vy An)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full justify-center text-slate-700 hover:bg-slate-50 border-slate-200 font-medium"
                onClick={handleLoginAsOwner}
                leftIcon={<Shield className="w-4 h-4 text-indigo-600" />}
              >
                Vào với vai trò Chủ phòng (Owner)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center">
          <Link to="/" className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors">
            ← Quay về Trang chủ GymPilot
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
