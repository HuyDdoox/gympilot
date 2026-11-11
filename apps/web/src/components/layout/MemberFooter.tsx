import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowUp, Send, Globe, Youtube, Instagram, Music2 } from 'lucide-react';

export const MemberFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1120] text-slate-400 text-xs border-t border-slate-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Logo & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm shadow-emerald-500/20">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Gym<span className="text-emerald-400">Pilot</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Khỏe mạnh hơn. Hạnh phúc hơn.
            </p>
          </div>

          {/* Col 2: Liên kết nhanh */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Liên kết nhanh</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/member/dashboard" className="hover:text-emerald-400 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/member/class-booking" className="hover:text-emerald-400 transition-colors">
                  Lịch tập
                </Link>
              </li>
              <li>
                <Link to="/member/class-booking" className="hover:text-emerald-400 transition-colors">
                  Đặt lớp
                </Link>
              </li>
              <li>
                <Link to="/member/my-membership" className="hover:text-emerald-400 transition-colors">
                  Gói tập
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hỗ trợ */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Hỗ trợ</h5>
            <ul className="space-y-2">
              <li>
                <a href="#faq" className="hover:text-emerald-400 transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-emerald-400 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-emerald-400 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Theo dõi chúng tôi */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Theo dõi chúng tôi</h5>
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Website / Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <Music2 className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 5: Đăng ký nhận tin */}
          <div>
            <h5 className="font-semibold text-white mb-3 text-sm">Đăng ký nhận tin</h5>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full bg-white text-slate-800 placeholder:text-slate-400 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
                aria-label="Gửi đăng ký"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section: Copyright & Scroll to Top */}
        <div className="pt-6 flex items-center justify-between text-slate-500 text-[11px]">
          <p>© 2025 GymPilot. Tất cả quyền được bảo lưu.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md"
            aria-label="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default MemberFooter;
