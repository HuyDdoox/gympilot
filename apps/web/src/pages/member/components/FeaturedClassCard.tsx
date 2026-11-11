import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { type FeaturedClassItem } from '../mockData';

export interface FeaturedClassCardProps {
  item: FeaturedClassItem;
}

export const FeaturedClassCard: React.FC<FeaturedClassCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* Image with Tag badge */}
      <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-bold shadow-xs ${item.tagColor}`}
        >
          {item.tag}
        </span>
      </div>

      {/* Details & CTA */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{item.time}</span>
          </div>
        </div>

        <Link
          to="/member/class-booking"
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-xs shadow-orange-500/20 transition-colors"
        >
          <span>Đặt lớp</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FeaturedClassCard;
