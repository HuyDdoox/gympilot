import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { testimonialsData } from '@/features/member/data';

export const MemberTestimonials: React.FC = () => {
  const testimonials = testimonialsData;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-1">
        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <MessageSquare className="w-3.5 h-3.5 fill-emerald-600" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Cảm nhận từ hội viên
        </h3>
      </div>

      {/* 3 Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {testimonials.map((t, idx) => (
          <div
            key={t.id}
            onClick={() => setActiveIndex(idx)}
            className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
              activeIndex === idx
                ? 'border-emerald-400 shadow-md ring-2 ring-emerald-500/10'
                : 'border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-4">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                loading="lazy"
              />
              <div className="min-w-0">
                <h5 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                  {t.name}
                </h5>
                <span className="text-[11px] text-slate-400 font-medium">
                  {t.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-200 ${
              activeIndex === idx
                ? 'bg-emerald-500 w-6'
                : 'bg-slate-200 hover:bg-slate-300 w-2'
            }`}
            aria-label={`Chuyển tới đánh giá ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default MemberTestimonials;
