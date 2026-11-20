import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowUp, Send, Globe, Youtube, Instagram, Music2 } from 'lucide-react';
import { memberNavigationData } from '@/features/member/data';

export const MemberFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { footerSections } = memberNavigationData;

  return (
    <footer className="bg-[#0b1120] text-slate-300 text-xs border-t border-slate-800/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Logo & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-sm shadow-emerald-500/20">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Gym<span className="text-emerald-400">Pilot</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Nền tảng quản lý và trải nghiệm phòng tập Gym, Yoga &amp; Pilates chuẩn boutique.
            </p>
            <p className="text-emerald-400 text-xs font-semibold">
              Khỏe mạnh hơn. Hạnh phúc hơn mỗi ngày.
            </p>
          </div>

          {/* Col 2: Dynamic Footer Section 1 */}
          {footerSections[0] && (
            <div>
              <h5 className="font-bold text-white mb-3 text-sm tracking-tight">
                {footerSections[0].title}
              </h5>
              <ul className="space-y-2">
                {footerSections[0].links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="hover:text-emerald-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 3: Dynamic Footer Section 2 */}
          {footerSections[1] && (
            <div>
              <h5 className="font-bold text-white mb-3 text-sm tracking-tight">
                {footerSections[1].title}
              </h5>
              <ul className="space-y-2">
                {footerSections[1].links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:text-emerald-400 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4: Theo dõi chúng tôi */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm tracking-tight">Theo dõi chúng tôi</h5>
            <div className="flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Facebook"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors shadow-xs"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors shadow-xs"
                aria-label="TikTok"
              >
                <Music2 className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-emerald-600 hover:text-white text-slate-300 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              Cộng đồng hơn 10.000+ người yêu thể thao tại Việt Nam.
            </p>
          </div>

          {/* Col 5: Đăng ký nhận tin */}
          <div>
            <h5 className="font-bold text-white mb-3 text-sm tracking-tight">Đăng ký nhận tin</h5>
            <p className="text-[11px] text-slate-400 mb-2.5 leading-relaxed">
              Nhận thông báo ưu đãi và lịch học đặc biệt sớm nhất.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1.5">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                aria-label="Gửi đăng ký"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section: Copyright & Scroll to Top */}
        <div className="pt-6 flex items-center justify-between text-slate-400 text-xs">
          <p>© 2026 GymPilot SaaS. Tất cả quyền được bảo lưu.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
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
