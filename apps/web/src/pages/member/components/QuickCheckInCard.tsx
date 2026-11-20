import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, ArrowRight } from 'lucide-react';

export const QuickCheckInCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-950 to-slate-950 text-white p-5 sm:p-6 border border-emerald-800/80 shadow-xs flex flex-col items-center justify-between text-center min-h-[220px]">
      {/* Header */}
      <div className="flex items-center gap-2 text-white">
        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
          <QrCode className="w-4 h-4" />
        </div>
        <h3 className="text-sm sm:text-base font-bold tracking-tight">Check-in nhanh</h3>
      </div>

      {/* QR Code White Box */}
      <div className="bg-white p-2.5 rounded-xl shadow-lg my-2.5 border border-emerald-400/20 group hover:scale-105 transition-transform duration-200">
        <img
          src="/images/qr-code.svg"
          alt="Mã QR Check-in GymPilot"
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          loading="lazy"
        />
      </div>

      {/* Instructions & Link */}
      <div>
        <p className="text-xs text-emerald-200/90 font-medium mb-1">
          Quét mã để check-in vào lớp
        </p>
        <Link
          to="/member/my-qr"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>Xem lịch sử check-in</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default QuickCheckInCard;
