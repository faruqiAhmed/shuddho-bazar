import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { REVENUE_TIMELINE } from '../../data/adminMockData';

export const RevenueChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('7D');
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number } | null>(null);

  const data = REVENUE_TIMELINE[timeframe];
  const maxVal = 60000;
  const svgWidth = 540;
  const svgHeight = 220;
  const paddingLeft = 60;
  const paddingBottom = 30;
  const paddingTop = 20;
  const paddingRight = 20;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Compute coordinates for data points
  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  // SVG path definition
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Fill area path (closed down to bottom)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header with Title and 7D / 30D / 90D Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-stone-900 leading-tight">
              Revenue Overview
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Total sales revenue for the last {timeframe === '7D' ? '7 days' : timeframe === '30D' ? '30 days' : '90 days'}
            </p>
          </div>
        </div>

        {/* Timeframe pill tabs (exact from screenshot) */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
          {(['7D', '30D', '90D'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeframe(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === tab
                  ? 'bg-[#15803d] text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line & Area Chart */}
      <div className="relative w-full overflow-hidden">
        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 right-4 bg-stone-900 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md z-10 animate-in fade-in duration-100">
            {hoveredPoint.label}: ৳ {hoveredPoint.value.toLocaleString('en-IN')}
          </div>
        )}

        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-56 select-none"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y labels */}
          {[0, 15000, 30000, 45000, 60000].map((val) => {
            const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray={val === 0 ? undefined : '3 3'}
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-stone-400 font-medium"
                >
                  ৳ {val.toLocaleString('en-IN')}
                </text>
              </g>
            );
          })}

          {/* Gradient Fill */}
          <path d={areaD} fill="url(#revenueGradient)" />

          {/* Green Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#15803d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points and X labels */}
          {points.map((p, idx) => (
            <g 
              key={idx} 
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              {/* Invisible bigger target for hover */}
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />

              {/* Point Dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="#15803d"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-transform hover:scale-150"
              />

              {/* X Axis Label */}
              <text
                x={p.x}
                y={svgHeight - 8}
                textAnchor="middle"
                className="text-[10px] fill-stone-400 font-medium"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
