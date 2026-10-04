import React, { useState } from 'react';
import { Users, Phone, Mail, MapPin, Search } from 'lucide-react';
import { ADMIN_CUSTOMERS } from '../../data/adminMockData';

export const CustomersView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = ADMIN_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Customer Directory (গ্রাহক তালিকা)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Registered customer profiles, lifetime order history, and contact details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-600">
            Total Customers: <strong className="text-emerald-800 text-sm">1,243</strong>
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone or address..."
            className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="overflow-x-auto no-scrollbar -mx-4 px-4 pt-2">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold text-[11px]">
                <th className="pb-3 font-semibold">Customer Name</th>
                <th className="pb-3 font-semibold">Phone & Email</th>
                <th className="pb-3 font-semibold">Delivery Address</th>
                <th className="pb-3 font-semibold">Total Orders</th>
                <th className="pb-3 font-semibold">Lifetime Spent</th>
                <th className="pb-3 font-semibold">Last Order</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 font-bold text-stone-900">
                    {c.name}
                  </td>

                  <td className="py-3">
                    <div className="font-mono text-stone-800 font-semibold">{c.phone}</div>
                    <div className="text-[10px] text-stone-400">{c.email}</div>
                  </td>

                  <td className="py-3 text-stone-600 max-w-xs truncate">
                    {c.address}
                  </td>

                  <td className="py-3 font-black text-stone-800">
                    {c.totalOrders} orders
                  </td>

                  <td className="py-3 font-black text-emerald-800">
                    ৳ {c.totalSpent.toLocaleString('en-IN')}
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
      </div>
    </div>
  );
};
