import React, { useState } from 'react';
import { Layers, Plus, TrendingUp } from 'lucide-react';
import { CATEGORIES } from '../../../data/mockData';
import { CATEGORY_SALES_DATA } from '../../data/adminMockData';

export const CategoriesView: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Categories & Collections (ক্যাটাগরি ব্যবস্থাপনা)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Browse store product categories, revenue share, and live catalog performance.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি (Add Category)</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
          const salesMatch = CATEGORY_SALES_DATA.find(s => s.name.includes(cat.bengaliName.split(' ')[0])) || {
            amount: 28400,
            percentage: 45
          };

          return (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-sm text-stone-900 truncate">
                      {cat.bengaliName}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {cat.itemCount} টি পণ্য
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 font-medium mt-0.5 truncate">
                    {cat.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">মাসিক বিক্রি</span>
                  <span className="font-black text-stone-900">৳ {salesMatch.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block font-semibold">ক্যাটাগরি শেয়ার</span>
                  <span className="font-bold text-emerald-700">{salesMatch.percentage}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
