import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowRight,
  Plus,
  Layers,
  QrCode,
} from 'lucide-react';
import { api } from '@/lib/axios';
import { Card } from '@/components/ui';

interface MemberSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  joinedAt: string;
  planName?: string;
}

export const DashboardPage: React.FC = () => {
  const [recentMembers, setRecentMembers] = useState<MemberSummary[]>([]);
  const [totalMembers, setTotalMembers] = useState<number>(20);
  const [activeMembers] = useState<number>(18);
  const [totalPlans, setTotalPlans] = useState<number>(4);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Load members summary
        const resMem = await api.get('/members', { params: { limit: 5 } });
        if (resMem.data?.success && resMem.data?.data) {
          const list = resMem.data.data.members || [];
          setRecentMembers(
            list.map((m: MemberSummary & { activeMembership?: { planName?: string } }) => ({
              id: m.id,
              fullName: m.fullName,
              email: m.email,
              phone: m.phone,
              status: m.status,
              joinedAt: m.joinedAt,
              planName: m.activeMembership?.planName || 'Chưa đăng ký',
            }))
          );
          if (resMem.data.data.pagination) {
            setTotalMembers(resMem.data.data.pagination.totalItems);
          }
        }

        // Load plans count
        const resPlans = await api.get('/plans');
        if (resPlans.data?.success && Array.isArray(resPlans.data?.data)) {
          setTotalPlans(resPlans.data.data.length);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
      }
    }
    loadDashboardData();
  }, []);

  const weeklyRevenueBars = [
    { day: 'T2', value: 3200000, height: '40%' },
    { day: 'T3', value: 4800000, height: '60%' },
    { day: 'T4', value: 6500000, height: '80%' },
    { day: 'T5', value: 5200000, height: '65%' },
    { day: 'T6', value: 7800000, height: '95%' },
    { day: 'T7', value: 9200000, height: '100%' },
    { day: 'CN', value: 6100000, height: '75%' },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Bàn điều hành Quản trị (Owner Dashboard)
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tổng quan tình hình kinh doanh, số lượng hội viên và ca tập đang diễn ra
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/owner/members"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Quản lý hội viên</span>
            </Link>

            <Link
              to="/owner/plans"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo gói tập mới</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doanh thu tháng này</p>
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2">42.800.000 đ</h3>
            <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.8% so với tháng trước</span>
            </p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tổng hội viên</p>
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2">{totalMembers} hội viên</h3>
            <p className="text-xs text-slate-400 mt-1">
              <strong className="text-emerald-400">{activeMembers}</strong> đang hoạt động
            </p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lượt Check-in hôm nay</p>
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2">34 lượt</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>28 lượt quét mã QR tự động</span>
            </p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-5 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gói tập niêm yết</p>
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-2xl font-extrabold text-white mt-2">{totalPlans} gói</h3>
            <p className="text-xs text-emerald-400 mt-1">Đang mở bán công khai</p>
          </Card>
        </div>

        {/* 2 Columns: Revenue Chart & Today Class Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Bars (2 cols) */}
          <Card className="lg:col-span-2 bg-slate-900 border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Biến động doanh thu theo tuần</h3>
                <p className="text-xs text-slate-400">Tổng thu từ bán gói tập và dịch vụ phòng tập trong 7 ngày gần nhất</p>
              </div>
              <span className="text-xs font-bold text-emerald-400">42.8M VNĐ</span>
            </div>

            {/* Simulated Chart Bars */}
            <div className="pt-4 flex items-end justify-between gap-3 h-52 px-2">
              {weeklyRevenueBars.map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(bar.value / 1000000).toFixed(1)}M
                  </span>
                  <div
                    style={{ height: bar.height }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl group-hover:brightness-110 transition-all shadow-xs"
                  />
                  <span className="text-xs font-semibold text-slate-400 mt-1">{bar.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Today Classes Preview (1 col) */}
          <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Lớp học hôm nay</h3>
              <Link to="/owner/classes" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                Xem tất cả →
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Yoga Flow Buổi Sáng</span>
                  <span className="text-emerald-400 font-semibold">06:30 - 07:30</span>
                </div>
                <p className="text-[11px] text-slate-400">HLV Nguyễn Thảo • 15/15 thảm (Đầy)</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Pilates Core &amp; Toning</span>
                  <span className="text-emerald-400 font-semibold">17:30 - 18:30</span>
                </div>
                <p className="text-[11px] text-slate-400">HLV Hoàng Minh • Còn 2 chỗ trống</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">HIIT Fat Burn</span>
                  <span className="text-emerald-400 font-semibold">19:00 - 20:00</span>
                </div>
                <p className="text-[11px] text-slate-400">HLV Lê Dũng • Còn 8 chỗ trống</p>
              </div>
            </div>

            <Link
              to="/staff/today"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
            >
              <span>Mở bàn làm việc Lễ tân (Check-in)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        </div>

        {/* Recent Registered Members */}
        <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Hội viên mới nhất</h3>
              <p className="text-xs text-slate-400">Danh sách tài khoản hội viên vừa gia nhập phòng tập</p>
            </div>
            <Link
              to="/owner/members"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              <span>Xem danh sách đầy đủ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Hội viên</th>
                  <th className="py-3 px-4">Số điện thoại</th>
                  <th className="py-3 px-4">Gói tập</th>
                  <th className="py-3 px-4">Ngày đăng ký</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {recentMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/30 shrink-0">
                        {m.fullName.charAt(0)}
                      </div>
                      <div>
                        <span>{m.fullName}</span>
                        <p className="text-[10px] text-slate-500">{m.email}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{m.phone}</td>
                    <td className="py-3.5 px-4 font-medium text-emerald-400">{m.planName}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(m.joinedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/owner/members/${m.id}`}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Hồ sơ
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
