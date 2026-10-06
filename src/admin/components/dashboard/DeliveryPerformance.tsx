import React from 'react';
import { Truck, Clock, Hourglass, RotateCcw, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { DELIVERY_PERFORMANCE_METRICS } from '../../data/adminMockData';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

interface DeliveryPerformanceProps {
  onViewDetails?: () => void;
}

export const DeliveryPerformance: React.FC<DeliveryPerformanceProps> = ({ onViewDetails }) => {
  const { tr, formatNumber, isBn } = useAdminLanguage();
  const { 
    onTimePercentage, 
    onTimeCount, 
    totalOrders, 
    avgDeliveryTime, 
    avgDeliveryChange, 
    delayedOrders, 
    delayedChange, 
    returnedOrders, 
    returnedChange 
  } = DELIVERY_PERFORMANCE_METRICS;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (onTimePercentage / 100) * circumference;

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-stone-900 leading-tight">
              {tr('ডেলিভারি পারফরম্যান্স', 'Delivery Performance')}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {tr('লাইভ ফ্লিট ও ডেলিভারি রিপোর্ট', 'Live fleet & fulfillment metrics')}
            </p>
          </div>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            {tr('বিস্তারিত দেখুন', 'View Details')}
          </button>
        )}
      </div>

      {/* Circular Progress Gauge & Summary */}
      <div className="flex items-center gap-4 py-2 border-b border-stone-100">
        {/* Circular Gauge */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="9"
            />
            {/* Active green ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#15803d"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-black text-xl text-stone-900 font-mono">
              {formatNumber(onTimePercentage)}%
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div>
          <h4 className="font-display font-bold text-sm text-stone-900 leading-tight">
            {tr('সময়মতো ডেলিভারি', 'On-Time Delivery')}
          </h4>
          <p className="text-xs text-stone-500 mt-0.5 font-medium font-mono">
            {isBn ? `${formatNumber(onTimeCount)} / ${formatNumber(totalOrders)} টি অর্ডার` : `${onTimeCount} of ${totalOrders} orders`}
          </p>
          <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            {tr('চমৎকার রেটিং', 'Excellent Rating')}
          </span>
        </div>
      </div>

      {/* KPI Detail Rows (exact from screenshot) */}
      <div className="divide-y divide-stone-100 mt-2 text-xs">
        {/* Avg Delivery Time */}
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-600">
            <Clock className="w-4 h-4 text-stone-400" />
            <span className="font-medium">{tr('গড় ডেলিভারি সময়', 'Avg. Delivery Time')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-mono">{avgDeliveryTime}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center font-mono">
              <ArrowDownRight className="w-3 h-3" />
              {avgDeliveryChange}
            </span>
          </div>
        </div>

        {/* Delayed Orders */}
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-600">
            <Hourglass className="w-4 h-4 text-stone-400" />
            <span className="font-medium">{tr('বিলম্বিত অর্ডার', 'Delayed Orders')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-mono">{formatNumber(delayedOrders)}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center font-mono">
              <ArrowDownRight className="w-3 h-3" />
              {delayedChange}
            </span>
          </div>
        </div>

        {/* Returned Orders */}
        <div className="py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-600">
            <RotateCcw className="w-4 h-4 text-stone-400" />
            <span className="font-medium">{tr('ফেরত আসা অর্ডার', 'Returned Orders')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-mono">{formatNumber(returnedOrders)}</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center font-mono">
              <ArrowUpRight className="w-3 h-3" />
              {returnedChange}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
