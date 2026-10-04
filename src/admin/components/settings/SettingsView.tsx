import React, { useState } from 'react';
import { Settings, Save, Check, ShieldCheck } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [storeName, setStoreName] = useState('Shuddho Bazar');
  const [storeTagline, setStoreTagline] = useState('শুদ্ধ খাবার, সুস্থ জীবন');
  const [hotline, setHotline] = useState('09612-445566');
  const [whatsapp, setWhatsapp] = useState('+8801700000000');
  const [insideCityFee, setInsideCityFee] = useState('70');
  const [outsideCityFee, setOutsideCityFee] = useState('130');
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('1500');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Store & System Settings (স্টোর সেটিংস)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Configure delivery fees in ৳ BDT, free shipping eligibility, and contact hotlines.
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Store Info */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-sm text-stone-900">
            স্টোর পরিচিতি (Store Profile)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                স্টোর ব্র্যান্ড নাম
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                ট্যাগলাইন
              </label>
              <input
                type="text"
                value={storeTagline}
                onChange={(e) => setStoreTagline(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                গ্রাহক সেবা হটলাইন
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                অফিসিয়াল হোয়াটসঅ্যাপ নম্বর
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
          <h3 className="font-display font-bold text-sm text-stone-900">
            ডেলিভারি চার্জ ও ফ্রি শিপিং কনফিগারেশন (Delivery & Shipping Rates in ৳ BDT)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                শহরের ভিতরে ডেলিভারি চার্জ (Inside City)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">৳</span>
                <input
                  type="number"
                  value={insideCityFee}
                  onChange={(e) => setInsideCityFee(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                শহরের বাইরে কুরিয়ার চার্জ (Outside City)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">৳</span>
                <input
                  type="number"
                  value={outsideCityFee}
                  onChange={(e) => setOutsideCityFee(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-stone-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                ফ্রি ডেলিভারি সর্বনিম্ন অর্ডার মূল্য
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">৳</span>
                <input
                  type="number"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-stone-200 rounded-xl font-bold text-emerald-800"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>পরিবর্তন সংরক্ষণ করুন (Save Settings)</span>
        </button>
      </form>
    </div>
  );
};
