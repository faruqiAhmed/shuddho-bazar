import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { REVIEWS } from '../data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900">
            গ্রাহকদের বাস্তব অভিজ্ঞতা
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            হাজারো পরিবার প্রতিদিন আস্থা রাখছেন আমাদের খাঁটি পণ্যে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((rev) => (
            <div 
              key={rev.id}
              className="p-5 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col justify-between hover:border-emerald-600/40 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-stone-300" />
                </div>

                <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-1">
                      {rev.author}
                      {rev.verifiedBuyer && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Customer" />
                      )}
                    </h4>
                    <p className="text-[10px] text-stone-400">{rev.date}</p>
                  </div>
                </div>
                {rev.productName && (
                  <p className="text-[10px] text-emerald-800 font-semibold mt-1 truncate">
                    পণ্য: {rev.productName}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
