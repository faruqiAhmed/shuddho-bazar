import React from 'react';
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';
import { RevenueChart } from '../dashboard/RevenueChart';
import { OrderStatusChart } from '../dashboard/OrderStatusChart';

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Sales & Analytics Reports (বিক্রি ও লাভ রিপোর্ট)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Weekly and monthly financial growth, margins, and customer retention metrics.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ডাউনলোড পূর্ণাঙ্গ রিপোর্ট</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">মোট বিক্রয় (Gross Sales)</span>
          <h3 className="font-display font-black text-2xl text-stone-900 mt-1">৳ ২,৪৮,৭৫০</h3>
          <span className="text-[10px] text-emerald-700 font-bold">↑ +১২.৫% প্রবৃদ্ধি</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">পণ্য সংগ্রহ খরচ (COGS)</span>
          <h3 className="font-display font-black text-2xl text-stone-800 mt-1">৳ ১,৬৪,১০০</h3>
          <span className="text-[10px] text-stone-400 font-medium">৬৬% মোট বিক্রয়ের</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">মোট লাভ (Gross Margin)</span>
          <h3 className="font-display font-black text-2xl text-emerald-800 mt-1">৳ ৮৪,৬৫০</h3>
          <span className="text-[10px] text-emerald-700 font-bold">৩৪% নেট মার্জিন</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">গড় অর্ডার মূল্য (AOV)</span>
          <h3 className="font-display font-black text-2xl text-stone-900 mt-1">৳ ১,৮২০</h3>
          <span className="text-[10px] text-emerald-700 font-bold">↑ +৫.২% বৃদ্ধি</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RevenueChart />
        <OrderStatusChart />
      </div>
    </div>
  );
};
