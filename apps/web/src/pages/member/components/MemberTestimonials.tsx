import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { memberMockData } from '../mockData';

export const MemberTestimonials: React.FC = () => {
  const { testimonials } = memberMockData;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="space-y-4 w-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <MessageSquare className="w-3 h-3 fill-current" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Cảm nhận từ hội viên
        </h3>
      </div>

      {/* 3 Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, idx) => (
          <div
            key={t.id}
            onClick={() => setActiveIndex(idx)}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-200 flex items-start gap-3.5 cursor-pointer"
          >
            {/* Avatar */}
            <img
              src={t.avatar}
              alt={t.name}
              className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
            />

            {/* Testimonial Quote & Author */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <h5 className="text-xs font-bold text-slate-900 leading-tight">
                  {t.name}
                </h5>
                <span className="text-[10px] text-slate-400 font-medium">
                  {t.role}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              activeIndex === idx
                ? 'bg-emerald-500 w-5'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Chuyển tới đánh giá ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default MemberTestimonials;
