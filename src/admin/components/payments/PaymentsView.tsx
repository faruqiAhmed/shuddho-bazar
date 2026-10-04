import React from 'react';
import { CreditCard, CheckCircle2, Clock, Download } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const transactions = [
    { id: 'TXN-99120', orderId: '#SB-10248', customer: 'রাফি আহমেদ', method: 'bKash', amount: 1245, status: 'Settled', date: 'Sep 27, 2025 11:45 AM' },
    { id: 'TXN-99119', orderId: '#SB-10247', customer: 'সাবিনা আক্তার', method: 'Cash on Delivery', amount: 865, status: 'Pending Collection', date: 'Sep 27, 2025 10:32 AM' },
    { id: 'TXN-99118', orderId: '#SB-10246', customer: 'মো. সাইফুল ইসলাম', method: 'Nagad', amount: 2430, status: 'Settled', date: 'Sep 27, 2025 09:15 AM' },
    { id: 'TXN-99117', orderId: '#SB-10245', customer: 'নাসরিন সুলতানা', method: 'bKash', amount: 1760, status: 'Settled', date: 'Sep 26, 2025 08:47 PM' },
    { id: 'TXN-99116', orderId: '#SB-10244', customer: 'তানভীর হাসান', method: 'Card (Visa/Mastercard)', amount: 3280, status: 'Settled', date: 'Sep 26, 2025 06:22 PM' },
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Payments & Gateway Reconciliation (পেমেন্ট ও হিসাব)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Settlement records for bKash, Nagad, Rocket, Cash on Delivery, and Credit/Debit cards.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ডাউনলোড স্টেটমেন্ট</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">আজকের সংগৃহীত পেমেন্ট</span>
          <h3 className="font-display font-black text-2xl text-stone-900 mt-1">৳ ৪৫,৪০০</h3>
          <span className="text-[10px] text-emerald-700 font-bold">১২ টি সফল লেনদেন</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">বিকাশ ও মোবাইল ব্যাংকিং</span>
          <h3 className="font-display font-black text-2xl text-[#db2777] mt-1">৳ ১,৫৮,৬৫০</h3>
          <span className="text-[10px] text-stone-400 font-medium">চলতি সপ্তাহের মোট সংগ্রহ</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500">ক্যাশ অন ডেলিভারি (COD)</span>
          <h3 className="font-display font-black text-2xl text-blue-700 mt-1">৳ ৯০,১০০</h3>
          <span className="text-[10px] text-stone-400 font-medium">কুরিয়ার থেকে উত্তোলনের অপেক্ষায়</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs overflow-x-auto no-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-stone-100 text-stone-400 font-semibold text-[11px]">
              <th className="pb-3 font-semibold">Transaction ID</th>
              <th className="pb-3 font-semibold">Order</th>
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Gateway / Method</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3 font-mono font-bold text-stone-900">{t.id}</td>
                <td className="py-3 font-mono text-emerald-800 font-semibold">{t.orderId}</td>
                <td className="py-3 font-bold text-stone-800">{t.customer}</td>
                <td className="py-3">{t.method}</td>
                <td className="py-3 font-black text-stone-900">৳ {t.amount.toLocaleString('en-IN')}</td>
                <td className="py-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    t.status === 'Settled'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 text-right text-stone-500 text-[11px]">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
