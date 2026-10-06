import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Minus, Search, Check } from 'lucide-react';
import { AdminProduct } from '../../types';
import { getProducts, updateProduct, subscribeToProducts } from '../../services/productService';
import { AdminPagination } from '../common/AdminPagination';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

export const InventoryView: React.FC = () => {
  const { tr, formatNumber, isBn } = useAdminLanguage();
  const [products, setProducts] = useState<AdminProduct[]>(() => getProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const unsub = subscribeToProducts(() => {
      setProducts(getProducts());
    });
    return unsub;
  }, []);

  const handleAdjustStock = (id: string, delta: number) => {
    const current = products.find(p => p.id === id);
    if (!current) return;
    const newStock = Math.max(0, current.stock + delta);
    updateProduct(id, { stock: newStock });
  };

  const lowStockCount = products.filter(p => p.stock < 10).length;

  const filteredItems = products.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (i.bengaliName && i.bengaliName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            {tr('ইনভেন্টরি ও গুদাম স্টক (Live Inventory)', 'Live Inventory & Warehouse Stock')}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {tr(
              'গ্রাহক অর্ডারের সাথে স্বয়ংক্রিয়ভাবে স্টক হ্রাস এবং সরাসরি লাইভ স্টক বৃদ্ধি/হ্রাস।',
              'Real-time shelf quantities, automatic order deduction, and live instant stock adjustments.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${
            lowStockCount > 0 
              ? 'bg-rose-50 text-rose-700 border-rose-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              {lowStockCount > 0 
                ? (isBn ? `${formatNumber(lowStockCount)} টি পণ্য রি-অর্ডার সীমার নিচে` : `${lowStockCount} items below threshold`)
                : tr('সকল পণ্যের স্টক পর্যাপ্ত', 'All products in stock')}
            </span>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={tr('পণ্য বা ক্যাটাগরি খুঁজুন...', 'Search stock item...')}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-2">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold text-[11px]">
                <th className="pb-3 font-semibold">{tr('পণ্যের নাম', 'Product Name')}</th>
                <th className="pb-3 font-semibold">{tr('ক্যাটাগরি', 'Category')}</th>
                <th className="pb-3 font-semibold">{tr('সাইজ / ওজন', 'Unit / Size')}</th>
                <th className="pb-3 font-semibold">{tr('বর্তমান স্টক', 'Current Stock')}</th>
                <th className="pb-3 font-semibold">{tr('অবস্থা', 'Health Status')}</th>
                <th className="pb-3 font-semibold text-right">{tr('লাইভ স্টক সমন্বয়', 'Live Quick Adjustment')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedItems.map((item) => {
                const isCritical = item.stock < 10;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <span className="font-bold text-stone-900">
                          {isBn ? (item.bengaliName || item.name) : item.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-stone-600">
                      {item.category}
                    </td>

                    <td className="py-3 font-medium text-stone-700">
                      {item.unit}
                    </td>

                    <td className="py-3 font-bold font-mono text-stone-900">
                      {formatNumber(item.stock)}
                    </td>

                    <td className="py-3">
                      {item.stock <= 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          {tr('স্টক আউট', 'Out of Stock')}
                        </span>
                      ) : isCritical ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {tr('সীমিত স্টক', 'Low Stock')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <Check className="w-3 h-3 mr-1" />
                          {tr('পর্যাপ্ত', 'Sufficient')}
                        </span>
                      )}
                    </td>

                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          disabled={item.stock <= 0}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-700 shadow-2xs transition-colors cursor-pointer"
                          title="Reduce stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-stone-900 font-mono text-xs">
                          {formatNumber(item.stock)}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-[#15803d] hover:bg-[#166534] flex items-center justify-center text-white shadow-2xs transition-colors cursor-pointer"
                          title="Add stock"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <AdminPagination
          totalItems={filteredItems.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
};
