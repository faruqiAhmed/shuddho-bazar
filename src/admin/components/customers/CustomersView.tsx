import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getOrders, subscribeToOrders } from '../../services/orderService';
import { AdminPagination } from '../common/AdminPagination';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

export const CustomersView: React.FC = () => {
  const { tr, formatNumber, formatPrice, isBn } = useAdminLanguage();
  const [orders, setOrders] = useState(() => getOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const unsub = subscribeToOrders(() => setOrders(getOrders()));
    return unsub;
  }, []);

  // Aggregate customers live from orders
  const customerMap = new Map<string, any>();
  for (const o of orders) {
    const key = (o.customerPhone || o.customerName || '').trim();
    if (!key) continue;
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += o.amount || 0;
    } else {
      customerMap.set(key, {
        id: `cust_${key.replace(/\D/g, '') || Math.floor(Math.random() * 10000)}`,
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail || '',
        address: o.customerAddress || 'Dhaka, Bangladesh',
        totalOrders: 1,
        totalSpent: o.amount || 0,
        lastOrderDate: o.date || 'Today',
        status: (o.amount || 0) > 2000 ? 'VIP' : 'Active'
      });
    }
  }

  const customersList = Array.from(customerMap.values());

  const filtered = customersList.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCustomers = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            {tr('গ্রাহক তালিকা (Customer Directory)', 'Live Customer Directory')}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {tr(
              'অর্ডার স্থাপনকারী প্রকৃত গ্রাহকদের প্রোফাইল, সর্বমোট ব্যয় এবং যোগাযোগের বিবরণ।',
              'Real customer profiles, lifetime order history, and contact details synchronized with placed orders.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600 font-mono">
            {tr('মোট গ্রাহক:', 'Total Customers:')} <strong className="text-emerald-800 text-sm">{formatNumber(customersList.length)}</strong>
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
            placeholder={tr('নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন...', 'Search by name, phone or address...')}
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-2">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold text-[11px]">
                <th className="pb-3 font-semibold">{tr('গ্রাহকের নাম', 'Customer Name')}</th>
                <th className="pb-3 font-semibold">{tr('ফোন ও ইমেইল', 'Phone & Email')}</th>
                <th className="pb-3 font-semibold">{tr('ডেলিভারি ঠিকানা', 'Delivery Address')}</th>
                <th className="pb-3 font-semibold">{tr('মোট অর্ডার', 'Total Orders')}</th>
                <th className="pb-3 font-semibold">{tr('সর্বমোট ক্রয়', 'Lifetime Spent')}</th>
                <th className="pb-3 font-semibold">{tr('সর্বশেষ অর্ডার', 'Last Order')}</th>
                <th className="pb-3 font-semibold text-right">{tr('স্ট্যাটাস', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 font-bold text-stone-900">
                    {c.name}
                  </td>

                  <td className="py-3">
                    <div className="font-mono text-stone-800 font-semibold">{c.phone}</div>
                    {c.email && <div className="text-[10px] text-stone-400">{c.email}</div>}
                  </td>

                  <td className="py-3 text-stone-600 max-w-xs truncate">
                    {c.address}
                  </td>

                  <td className="py-3 font-black text-stone-800 font-mono">
                    {formatNumber(c.totalOrders)} {tr('টি', 'orders')}
                  </td>

                  <td className="py-3 font-black text-emerald-800 font-mono">
                    {formatPrice(c.totalSpent)}
                  </td>

                  <td className="py-3 text-stone-500 text-[11px]">
                    {c.lastOrderDate}
                  </td>

                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'VIP'
                        ? 'bg-amber-100 text-amber-800'
                        : c.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel={tr('গ্রাহক', 'customers')}
        />
      </div>
    </div>
  );
};
