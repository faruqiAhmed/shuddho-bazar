import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import { ORDER_STATUS_DISTRIBUTION } from '../../data/adminMockData';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

export const OrderStatusChart: React.FC = () => {
  const { tr, formatNumber } = useAdminLanguage();
  const total = 482;
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const getStatusName = (name: string) => {
    switch (name) {
      case 'Delivered': return tr('ডেলিভার্ড', 'Delivered');
      case 'Processing': return tr('প্রসেসিং', 'Processing');
      case 'Shipped': return tr('শিপ্ড', 'Shipped');
      case 'Cancelled': return tr('বাতিল', 'Cancelled');
      case 'Pending': return tr('পেন্ডিং', 'Pending');
      default: return name;
    }
  };

  // Compute stroke offsets for each segment
  let accumulatedPercent = 0;
  const segments = ORDER_STATUS_DISTRIBUTION.map((item) => {
    const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += item.percentage;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
          <PieIcon className="w-5 h-5 text-emerald-700" />
        </div>
        <div>
          <h3 className="font-display font-extrabold text-base text-stone-900 leading-tight">
            {tr('অর্ডার স্ট্যাটাস', 'Order Status')}
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            {tr('স্ট্যাটাস অনুযায়ী অর্ডার বণ্টন', 'Order distribution by status')}
          </p>
        </div>
      </div>

      {/* Donut Chart & Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        {/* SVG Donut Chart */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            ))}
          </svg>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-display font-black text-2xl text-stone-900 leading-none">
              {formatNumber(total)}
            </span>
            <span className="text-[11px] font-semibold text-stone-400 mt-1">
              {tr('মোট অর্ডার', 'Total Orders')}
            </span>
          </div>
        </div>

        {/* Legend List (exact from screenshot) */}
        <div className="flex-1 w-full space-y-2.5 text-xs">
          {ORDER_STATUS_DISTRIBUTION.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-semibold text-stone-700">
                  {getStatusName(item.name)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-stone-500 font-medium">
                <span className="text-stone-400 text-[11px] font-mono">{formatNumber(item.percentage)}%</span>
                <span className="font-bold text-stone-900 w-8 text-right font-mono">
                  {formatNumber(item.count)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
