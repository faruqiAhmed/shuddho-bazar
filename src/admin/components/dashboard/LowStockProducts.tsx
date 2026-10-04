import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { LOW_STOCK_PRODUCTS } from '../../data/adminMockData';

interface LowStockProductsProps {
  onViewAll?: () => void;
  onRestockProduct?: (id: string) => void;
}

export const LowStockProducts: React.FC<LowStockProductsProps> = ({ 
  onViewAll,
  onRestockProduct 
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-stone-900 leading-tight">
              Low Stock Products
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Items near reorder threshold
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

      {/* Product List (exact from screenshot) */}
      <div className="divide-y divide-stone-100">
        {LOW_STOCK_PRODUCTS.map((prod) => (
          <div 
            key={prod.id} 
            className="py-2.5 flex items-center justify-between gap-3 hover:bg-stone-50/60 rounded-xl px-1.5 transition-colors cursor-pointer"
            onClick={() => onRestockProduct?.(prod.id)}
            title="Click to manage stock"
          >
            {/* Image & Details */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {prod.name}
                </p>
                <p className="text-[11px] text-stone-400 font-medium">
                  {prod.weight}
                </p>
              </div>
            </div>

            {/* Left badge */}
            <div className="shrink-0">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#fee2e2] text-[#dc2626]">
                {prod.stockLeft} left
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
