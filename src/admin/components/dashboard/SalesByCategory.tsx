import React from 'react';
import { Layers } from 'lucide-react';
import { CATEGORY_SALES_DATA } from '../../data/adminMockData';

interface SalesByCategoryProps {
  onViewAll?: () => void;
}

export const SalesByCategory: React.FC<SalesByCategoryProps> = ({ onViewAll }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-stone-900 leading-tight">
              Sales by Category
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Top performing categories
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Category List with Progress Bars (exact from screenshot) */}
      <div className="space-y-3 mt-1">
        {CATEGORY_SALES_DATA.map((cat, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {/* Category Icon / Emoji */}
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm shrink-0">
              {cat.iconEmoji}
            </div>

            {/* Category Name & Progress Bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-stone-800 truncate">
                  {cat.name}
                </span>
                <span className="font-black text-stone-900 ml-2">
                  ৳ {cat.amount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#15803d] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
