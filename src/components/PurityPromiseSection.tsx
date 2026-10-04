import React from 'react';
import { 
  ShieldCheck, 
  Trees, 
  FlaskConical, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake 
} from 'lucide-react';

export const PurityPromiseSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-stone-50 to-[#f3efe8] py-10 sm:py-16 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>আমাদের বিশুদ্ধতার অঙ্গীকার</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-stone-900 tracking-tight">
            কেন শুধ্ব বাজার-এর পণ্য ১০০% খাঁটি?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            ঘরোয়া পুষ্টি ও সুস্থ জীবনের নিশ্চয়তায় আমরা কোনো ধরনের রাসায়নিক বা প্রিজারভেটিভ ব্যবহার করি না।
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Pillar 1 */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <Trees className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900 mb-1.5">
              সরাসরি উৎস থেকে সংগ্রহ
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              সুন্দরবনের গভীর ম্যানগ্রোভ ও প্রত্যন্ত গ্রামীণ খামার থেকে বিশ্বস্ত মৌয়াল ও কৃষকদের মাধ্যমে মধু ও বীজ সংগ্রহ।
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900 mb-1.5">
              ল্যাব টেস্টেড ও কেমিক্যালমুক্ত
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              প্রতিটি ব্যাচ সুনির্দিষ্টভাবে খাদ্য সুরক্ষা ল্যাবে টেস্ট করা হয়। কোনো কৃত্রিম রং, সুগন্ধি বা চিনি যুক্ত নেই।
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900 mb-1.5">
              কাঠের ঘানি ও প্রাচীন পদ্ধতি
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              সরিষার তেল কাঠের ঘানিতে ও গাওয়া ঘি কাঠের বিলোনা মন্থন করে প্রস্তুত করায় প্রাকৃতিক ঘ্রাণ ও পুষ্টিগুণ অটুট থাকে।
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-stone-900 mb-1.5">
              নিঃশর্ত রিটার্ন ও মানিব্যাক
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              পণ্যের বিশুদ্ধতায় কোনো ভেজাল প্রমাণিত হলে বিনা প্রশ্নে শতভাগ মূল্য ফেরত দেওয়ার পূর্ণ গ্যারান্টি।
            </p>
          </div>
        </div>

        {/* Banner with Video/Farmer Showcase */}
        <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              খাদ্য নিরাপত্তা সনদ
            </span>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-stone-900 mt-1">
              পরিবারের সুস্বাস্থ্যের জন্য বেছে নিন খাঁটি খাবার
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              বাজারের রাসায়নিক মিশ্রিত তেল ও ভেজাল মধুর ভিড়ে খাঁটি স্বাদ ফিরিয়ে আনাই আমাদের লক্ষ্য। নিরাপদ থাকুন, সুস্থ থাকুন।
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                বিএসটিআই মানসম্মত
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ফুড গ্রেড কাঁচের জার
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                সরাসরি হোম ডেলিভারি
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="block font-display font-extrabold text-2xl sm:text-3xl text-emerald-900">
                ৫০,০০০+
              </span>
              <span className="text-[11px] font-medium text-emerald-700 mt-0.5 block">
                সন্তুষ্ট গ্রাহক পরিবার
              </span>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="block font-display font-extrabold text-2xl sm:text-3xl text-amber-900">
                ১০০%
              </span>
              <span className="text-[11px] font-medium text-amber-800 mt-0.5 block">
                ন্যাচারাল পিউরিটি
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
