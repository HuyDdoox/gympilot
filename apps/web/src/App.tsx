import React from 'react';
import { Dumbbell, Activity, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col justify-between p-6 md:p-12">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-700/60 pb-6 max-w-6xl w-full mx-auto">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
            <Dumbbell className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Gym<span className="text-emerald-400">Pilot</span>
            </span>
            <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MVP v1.0
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Hệ thống đang hoạt động</span>
        </div>
      </header>

      {/* Main Hero */}
      <main className="max-w-4xl w-full mx-auto my-auto text-center py-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-sm mb-6">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Khởi tạo dự án thành công (Task 1 — P0)</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          GymPilot đang khởi tạo
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Giải pháp tinh gọn all-in-one quản lý hội viên, gói tập, lịch lớp, QR check-in và doanh thu cho phòng gym, yoga và pilates boutique.
        </p>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-6 backdrop-blur-sm">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Kiến trúc Monorepo</h3>
            <p className="text-sm text-slate-400">
              Đồng bộ giữa Express backend, React frontend và packages dùng chung Zod validators.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-6 backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="text-lg font-semibold mb-1">TypeScript Strict Mode</h3>
            <p className="text-sm text-slate-400">
              Tuyệt đối không dùng `any`, chuẩn hóa dữ liệu từ Prisma ORM đến API response.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/70 rounded-2xl p-6 backdrop-blur-sm">
            <Activity className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="text-lg font-semibold mb-1">Sẵn sàng vận hành</h3>
            <p className="text-sm text-slate-400">
              Docker PostgreSQL 16, Prisma ORM với 11 models và RESTful health check endpoint.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
        © 2026 GymPilot. Phát triển cùng Google Antigravity.
      </footer>
    </div>
  );
};

export default App;
