import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getProducts, subscribeToProducts } from '../../services/productService';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

interface LowStockProductsProps {
  onViewAll?: () => void;
  onRestockProduct?: (id: string) => void;
}

export const LowStockProducts: React.FC<LowStockProductsProps> = ({ 
  onViewAll,
  onRestockProduct 
}) => {
  const { tr, formatNumber, isBn } = useAdminLanguage();
  const [products, setProducts] = useState(() => getProducts());

  useEffect(() => {
    const unsub = subscribeToProducts(() => {
      setProducts(getProducts());
    });
    return unsub;
  }, []);

  const lowStockItems = products.filter(p => p.stock < 10).slice(0, 4);

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
              {tr('লো স্টক সতর্কতা', 'Low Stock Products')}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {tr('দ্রুত রি-স্টক প্রয়োজন এমন পণ্য', 'Items near reorder threshold')}
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            {tr('সব দেখুন', 'View All')}
          </button>
        )}
      </div>

      {/* Product List */}
      <div className="divide-y divide-stone-100">
        {lowStockItems.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400 font-medium">
            {tr('বর্তমানে কোনো পণ্যে লো স্টক নেই', 'All products have sufficient stock')}
          </div>
        ) : (
          lowStockItems.map((prod) => (
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
                    {isBn ? (prod.bengaliName || prod.name) : prod.name}
                  </p>
                  <p className="text-[11px] text-stone-400 font-medium">
                    {prod.unit}
                  </p>
                </div>
              </div>

              {/* Left badge */}
              <div className="shrink-0">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#fee2e2] text-[#dc2626] font-mono">
                  {isBn ? `${formatNumber(prod.stock)} টি বাকি` : `${prod.stock} left`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
