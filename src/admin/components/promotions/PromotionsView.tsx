import React, { useState } from 'react';
import { Tag, Plus, CheckCircle2, Copy } from 'lucide-react';
import { PROMO_COUPONS } from '../../data/adminMockData';

export const PromotionsView: React.FC = () => {
  const [coupons, setCoupons] = useState(PROMO_COUPONS);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Promotions & Coupons (প্রমোশন ও ডিসকাউন্ট)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Active coupon campaigns, cart discounts, and voucher usage analytics.
          </p>
        </div>

        <button className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
          <Plus className="w-4 h-4" />
          <span>নতুন কুপন তৈরি করুন (Create Coupon)</span>
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <div key={c.code} className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  c.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                }`}>
                  {c.status}
                </span>
                <span className="text-[11px] text-stone-400 font-medium">মেয়াদ: {c.validUntil}</span>
              </div>

              <div className="mt-3 flex items-center justify-between p-2.5 bg-stone-50 border border-dashed border-emerald-600/40 rounded-xl">
                <span className="font-mono font-black text-base text-emerald-800">
                  {c.code}
                </span>
                <button
                  onClick={() => handleCopy(c.code)}
                  className="p-1 text-stone-400 hover:text-emerald-700 cursor-pointer"
                  title="Copy code"
                >
                  {copiedCode === c.code ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="mt-3 text-xs text-stone-600 space-y-1">
                <p>
                  ডিসকাউন্ট: <strong className="text-stone-900">{c.discountType === 'percentage' ? `${c.discountValue}% Off` : `৳${c.discountValue} Flat Discount`}</strong>
                </p>
                <p>
                  সর্বনিম্ন অর্ডার: <strong>৳ {c.minOrderValue.toLocaleString('en-IN')}</strong>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-400 text-[11px]">ব্যবহার সংখ্যা:</span>
              <span className="font-bold text-stone-800">{c.usageCount} / {c.maxUsage} বার</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
