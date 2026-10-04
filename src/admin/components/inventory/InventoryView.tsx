import React, { useState } from 'react';
import { Boxes, AlertTriangle, Plus, Minus, Search, Check } from 'lucide-react';
import { LOW_STOCK_PRODUCTS } from '../../data/adminMockData';

export const InventoryView: React.FC = () => {
  const [items, setItems] = useState([
    ...LOW_STOCK_PRODUCTS,
    {
      id: 'ls-6',
      name: 'সুন্দরবনের খলিশা মধু',
      weight: '1 kg',
      stockLeft: 42,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80',
      category: 'Raw Honey',
      reorderLevel: 20,
    },
    {
      id: 'ls-7',
      name: 'বিলোনা গাওয়া ঘি',
      weight: '500g',
      stockLeft: 30,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=150&q=80',
      category: 'Pure Ghee',
      reorderLevel: 15,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleAdjustStock = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, stockLeft: Math.max(0, item.stockLeft + delta) } : item
      )
    );
  };

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Inventory & Stock Warehouse (ইনভেন্টরি ও গুদাম স্টক)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Real-time shelf quantities, batch thresholds, and instant stock increment/decrement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>৫ টি পণ্য রি-অর্ডার সীমার নিচে</span>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock item..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-2">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold text-[11px]">
                <th className="pb-3 font-semibold">Item & Variant</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Current Stock</th>
                <th className="pb-3 font-semibold">Reorder Alert Level</th>
                <th className="pb-3 font-semibold">Stock Health</th>
                <th className="pb-3 font-semibold text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map((item) => {
                const isCritical = item.stockLeft <= 10;
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{item.name}</p>
                          <p className="text-[11px] text-stone-400 font-medium">প্যাক: {item.weight}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 text-stone-600 font-medium">
                      {item.category}
                    </td>

                    <td className="py-3 font-black text-stone-900 text-sm">
                      {item.stockLeft}
                    </td>

                    <td className="py-3 text-stone-500 font-medium">
                      {item.reorderLevel} units
                    </td>

                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCritical ? '⚠️ Reorder Now' : '✓ Healthy'}
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="inline-flex items-center border border-stone-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                        <button
                          onClick={() => handleAdjustStock(item.id, -1)}
                          className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                          title="Reduce stock"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center font-bold text-stone-800">
                          {item.stockLeft}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(item.id, 1)}
                          className="p-1.5 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                          title="Add stock"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
