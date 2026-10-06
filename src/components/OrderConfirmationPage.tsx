import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Printer, 
  ShoppingBag, 
  MessageCircle, 
  Copy, 
  Check, 
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import { Order } from '../types';
import { formatBdt } from './BdtPrice';

interface OrderConfirmationPageProps {
  order: Order;
  onBackToStore: () => void;
  onTrackOrder?: (orderId: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onBackToStore,
  onTrackOrder,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `আসসালামু আলাইকুম, আমি একটি অর্ডার সম্পন্ন করেছি।\nঅর্ডার আইডি: ${order.id}\nমোট টাকা: ৳${order.total}\nগ্রাহকের নাম: ${order.customerName}\nমোবাইল: ${order.phone}`
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-stone-900 py-4 sm:py-8 px-3 sm:px-6">
      {/* Centered Large Card Container matching exact Screenshot design */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
        {/* Header matching Screenshot: DF badge, Title, Subtitle, Back button */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#183124] text-amber-300 font-extrabold flex items-center justify-center text-sm shadow-xs border border-emerald-950/20">
              DF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-lg sm:text-xl text-stone-900 leading-tight">
                  অর্ডার সফলভাবে নিশ্চিত হয়েছে 🎉
                </h1>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  কনফার্মড
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                নিরাপদ ও দ্রুত হোম ডেলিভারি কনফার্মেশন • Shuddho Bazar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer print:hidden"
            >
              <Printer className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">রসিদ প্রিন্ট</span>
            </button>
            <button
              onClick={onBackToStore}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Back to store"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Layout matching Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
          {/* Left Column: Confirmation Details & Delivery Status (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {/* Success Celebration Banner */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-extrabold text-sm sm:text-base text-emerald-950">
                  ধন্যবাদ, {order.customerName}!
                </h2>
                <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                  আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের টিম খুব দ্রুত পণ্য প্যাকিং করে আপনার ঠিকানায় পাঠাবে।
                </p>
              </div>
            </div>

            {/* Quick Order Credentials Box */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/60">
                <span className="text-stone-400 font-medium block text-[11px]">অর্ডার আইডি</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="font-mono font-black text-sm text-emerald-800">{order.id}</span>
                  <button
                    onClick={handleCopyId}
                    className="p-1 hover:bg-stone-200 rounded text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    title="Copy Order ID"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/60">
                <span className="text-stone-400 font-medium block text-[11px]">পেমেন্ট মেথড</span>
                <span className="font-bold text-xs text-stone-900 mt-1 block">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/60 col-span-2 sm:col-span-1">
                <span className="text-stone-400 font-medium block text-[11px]">আনুমানিক সময়</span>
                <span className="font-bold text-xs text-emerald-700 mt-1 block">
                  {order.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Live Order Timeline Progress */}
            <div className="bg-stone-50/70 rounded-2xl p-4 sm:p-5 border border-stone-200/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                <span className="font-bold text-xs text-stone-800">অর্ডার অগ্রগতি ট্র্যাকিং</span>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-stone-900">অর্ডার প্লেসড</p>
                    <p className="text-[10px] text-stone-400">গৃহীত হয়েছে</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs ring-4 ring-emerald-50 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-stone-900">প্যাকিং ও কোয়ালিটি</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">প্রক্রিয়াধীন</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center opacity-60">
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-stone-800">কুরিয়ারে হস্তান্তর</p>
                    <p className="text-[10px] text-stone-400">অপেক্ষমাণ</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2.5 text-left sm:text-center opacity-60">
                  <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-500 flex items-center justify-center font-bold text-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-stone-800">ডেলিভারি সম্পন্ন</p>
                    <p className="text-[10px] text-stone-400">গন্তব্যে পৌঁছানো</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Customer Details */}
            <div className="bg-stone-50/70 rounded-2xl p-4 sm:p-5 border border-stone-200/60 space-y-2.5 text-xs">
              <span className="font-bold text-stone-800 block pb-1 border-b border-stone-200/60">
                ডেলিভারি ঠিকানা ও গ্রাহকের তথ্য
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-stone-400 block text-[11px]">প্রাপক:</span>
                  <p className="font-bold text-stone-900 text-xs sm:text-sm">{order.customerName}</p>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">মোবাইল নম্বর:</span>
                  <p className="font-mono font-bold text-stone-900">{order.phone}</p>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-stone-400 block text-[11px]">ডেলিভারি ঠিকানা:</span>
                  <p className="font-medium text-stone-800 mt-0.5 leading-relaxed">
                    {order.address} ({order.city})
                  </p>
                </div>
              </div>
            </div>

            {/* Safety Guarantee */}
            <div className="bg-stone-900 text-white rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-300 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-white block">১০০% ক্যাশ অন ডেলিভারি সুরক্ষা</span>
                <p className="text-stone-300 text-[11px] mt-0.5">
                  পণ্য হাতে পেয়ে দেখে নেওয়ার পর মূল্য পরিশোধ করতে পারবেন।
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (5 Cols matching Screenshot) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-50/50 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h2 className="font-display font-black text-base text-stone-900">
                অর্ডার সারাংশ
              </h2>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product?.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80'}
                        alt={item.product?.name || 'Item'}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-stone-900 truncate">
                          {item.product?.bengaliName || item.product?.name}
                        </p>
                        <p className="text-[11px] text-stone-500 font-medium">
                          × {item.quantity} ({item.selectedWeight})
                        </p>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-xs text-stone-900 shrink-0">
                      {formatBdt(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-4 border-t border-stone-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono font-bold text-stone-900">{formatBdt(order.subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-600 font-medium">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {order.deliveryFee === 0 ? <span className="text-emerald-700">ফ্রি</span> : formatBdt(order.deliveryFee)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>ছাড় (কুপন/পয়েন্ট):</span>
                    <span className="font-mono">-{formatBdt(order.discount)}</span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                  <span className="font-extrabold text-sm sm:text-base text-stone-900">
                    সর্বমোট প্রদেয়:
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-[#e11d48]">
                    {formatBdt(order.total)}
                  </span>
                </div>

                {/* Loyalty Earned Callout (exact green pill from Screenshot) */}
                <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 flex items-center gap-2 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>এই অর্ডারে আপনি পাচ্ছেন {Math.max(1, Math.round(order.total / 20))} লয়্যালটি পয়েন্ট!</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 print:hidden">
              <a
                href={`https://wa.me/8801842078717?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে অর্ডার কনফার্মেশন পাঠান</span>
              </a>

              <button
                onClick={onBackToStore}
                className="w-full py-3.5 rounded-2xl bg-[#183124] hover:bg-[#112319] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>আরও কেনাকাটা করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
