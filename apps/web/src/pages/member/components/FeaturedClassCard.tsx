import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import { type FeaturedClassItem } from '@/features/member/data';

export interface FeaturedClassCardProps {
  item: FeaturedClassItem;
}

export const FeaturedClassCard: React.FC<FeaturedClassCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group">
      {/* Image with Tag badge */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${item.tagColor}`}
        >
          {item.tag}
        </span>
      </div>

      {/* Details & CTA */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1.5 leading-snug">
            {item.title}
          </h4>
          <div className="space-y-1 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{item.time}</span>
            </div>
            {item.trainer && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.trainer}</span>
              </div>
            )}
          </div>
        </div>

        <Link
          to="/member/class-booking"
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xs font-semibold shadow-xs shadow-orange-500/20 transition-all cursor-pointer"
        >
          <span>Đặt lớp ngay</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedClassCard;
