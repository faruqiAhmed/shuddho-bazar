import React from 'react';
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Heart,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (categoryId: string) => void;
  onOpenTrackOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenTrackOrder,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-24 lg:pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-stone-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-medium">কাস্টমার কেয়ার হটলাইন</div>
              <div className="text-lg font-display font-extrabold text-white">09612-445566</div>
              <div className="text-[11px] text-stone-500">সকাল ৯টা – রাত ১০টা (সপ্তাহের ৭ দিন)</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-medium">দ্রুত হোম ডেলিভারি</div>
              <div className="text-base font-display font-bold text-white">সমগ্র দেশে ক্যাশ অন ডেলিভারি</div>
              <div className="text-[11px] text-stone-500">শহরের ভিতরে ২৪ ঘণ্টা, বাইরে ৪৮ ঘণ্টা</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-medium">১০০% বিশুদ্ধতার অঙ্গীকার</div>
              <div className="text-base font-display font-bold text-white">শতভাগ মানিব্যাক গ্যারান্টি</div>
              <div className="text-[11px] text-stone-500">ভেজাল বা কৃত্রিম কেমিক্যাল প্রমাণিত হলে</div>
            </div>
          </div>
        </div>

        {/* 4 Columns Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          {/* Col 1: About Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-black text-sm">
                SB
              </div>
              <span className="font-display font-extrabold text-xl text-white tracking-tight">
                Shuddho<span className="text-emerald-500">Bazar</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              ঘরের বাজার ধাঁচে বিশুদ্ধ প্রাকৃতিক খাদ্য ও গ্রোসারি ই-কমার্স। আমরা সরাসরি খামারি ও সুন্দরবনের মৌয়ালদের থেকে শতভাগ প্রাকৃতিক, কেমিক্যালমুক্ত পণ্য আপনার দোড়গোড়ায় পৌঁছে দেই।
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-emerald-800 hover:text-white flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
              জনপ্রিয় ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onSelectCategory('honey')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  সুন্দরবনের খাঁটি খলিশা মধু
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('oils')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  কাঠের ঘানিতে ভাঙা সরিষার তেল
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('ghee')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  হাতে মন্থন করা গাওয়া ঘি
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('nuts')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  রয়্যাল মিক্সড ড্রাই ফ্রুটস ও বাদাম
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('seeds')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  অর্গানিক চিয়া সিড ও কালোজিরা
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('dates')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  প্রিমিয়াম মরিয়ম খেজুর ও নলেন গুড়
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
              গ্রাহক সেবা ও নীতি
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onOpenTrackOrder}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-emerald-400 font-semibold"
                >
                  অর্ডার ট্র্যাক করুন (Live Tracking)
                </button>
              </li>
              <li>
                <a href="#purity" className="hover:text-emerald-400 transition-colors">
                  বিশুদ্ধতা ও ল্যাব টেস্ট রিপোর্ট
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  রিটার্ন ও রিফান্ড পলিসি
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  ডেলিভারি সংক্রান্ত নিয়মাবলী
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  গোপনীয়তা নীতি (Privacy Policy)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Warehouse */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
              যোগাযোগ ও অফিস
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>হাউস ৪২, রোড ৭, সেক্টর ৪, উত্তরা / মিরপুর-১০, ঢাকা – ১২৩০</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@shuddhobazar.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>অর্ডার গ্রহণ: ২৪ ঘণ্টা অনলাইন</span>
              </div>
            </div>

            {/* Payment Icons Pill */}
            <div className="mt-4 pt-3 border-t border-stone-800">
              <span className="text-[10px] text-stone-400 block mb-1.5 uppercase font-bold">
                নিরাপদ পেমেন্ট পার্টনারস
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-stone-300">
                <span className="bg-stone-800 px-2 py-1 rounded">ক্যাশ অন ডেলিভারি</span>
                <span className="bg-stone-800 px-2 py-1 rounded text-rose-400">bKash</span>
                <span className="bg-stone-800 px-2 py-1 rounded text-amber-400">Nagad</span>
                <span className="bg-stone-800 px-2 py-1 rounded">Visa/Mastercard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500 text-center sm:text-left">
          <p>© 2026 Shuddho Bazar Ltd. All rights reserved. Inspired by natural artisan pantry tradition.</p>
          <p className="flex items-center justify-center gap-1">
            <span>বিশুদ্ধ ও স্বাস্থ্যকর খাবার সুস্থ জীবনের ভিত্তি</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
