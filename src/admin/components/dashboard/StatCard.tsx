import React from 'react';
import { ShoppingBag, Users, Package, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AdminStat } from '../../types';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

export const StatCard: React.FC<{ stat: AdminStat }> = ({ stat }) => {
  const { tr, formatNumber } = useAdminLanguage();

  const getTranslatedTitle = (title: string) => {
    switch (title) {
      case 'Total Sales': return tr('মোট বিক্রয়', 'Total Sales');
      case 'Total Orders': return tr('মোট অর্ডার', 'Total Orders');
      case 'Total Customers': return tr('মোট গ্রাহক', 'Total Customers');
      case 'Total Products': return tr('মোট পণ্য সংখ্যা', 'Total Products');
      default: return title;
    }
  };

  const getTranslatedPeriod = (period: string) => {
    if (period.includes('last 7 days')) {
      return tr('বিগত ৭ দিনের তুলনায়', 'vs. last 7 days');
    }
    return period;
  };

  const getTranslatedValue = (val: string) => {
    return formatNumber(val);
  };

  const getIconConfig = (type: AdminStat['iconType']) => {
    switch (type) {
      case 'sales':
        return {
          bg: 'bg-emerald-500',
          text: 'text-white',
          Icon: Wallet,
          strokeColor: '#22c55e',
        };
      case 'orders':
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          Icon: ShoppingBag,
          strokeColor: '#3b82f6',
        };
      case 'customers':
        return {
          bg: 'bg-purple-500',
          text: 'text-white',
          Icon: Users,
          strokeColor: '#a855f7',
        };
      case 'products':
        return {
          bg: 'bg-amber-500',
          text: 'text-white',
          Icon: Package,
          strokeColor: '#f97316',
        };
    }
  };

  const config = getIconConfig(stat.iconType);
  const IconComponent = config.Icon;

  // Build SVG path for smooth sparkline
  const min = Math.min(...stat.sparklineData);
  const max = Math.max(...stat.sparklineData);
  const range = max - min || 1;
  const width = 85;
  const height = 36;
  const points = stat.sparklineData.map((val, idx) => {
    const x = (idx / (stat.sparklineData.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
      {/* Top row: Icon */}
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-2xl ${config.bg} ${config.text} flex items-center justify-center shadow-xs`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Metric Middle */}
      <div className="mt-3">
        <span className="text-xs font-semibold text-stone-500 block">
          {getTranslatedTitle(stat.title)}
        </span>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-900 mt-1 tracking-tight">
          {getTranslatedValue(stat.value)}
        </h3>
      </div>

      {/* Bottom row: Trend percentage + Sparkline chart */}
      <div className="flex items-end justify-between mt-3 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center text-xs font-bold text-emerald-600">
            {stat.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
            <span>{stat.change}</span>
          </span>
          <span className="text-[11px] text-stone-400 font-medium">
            {getTranslatedPeriod(stat.comparisonPeriod)}
          </span>
        </div>

        {/* Vector Sparkline */}
        <div className="w-20 h-9 shrink-0">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
            <polyline
              fill="none"
              stroke={config.strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {/* End point dot */}
            {stat.sparklineData.length > 0 && (
              <circle
                cx={width}
                cy={height - ((stat.sparklineData[stat.sparklineData.length - 1] - min) / range) * (height - 8) - 4}
                r="3"
                fill={config.strokeColor}
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};
