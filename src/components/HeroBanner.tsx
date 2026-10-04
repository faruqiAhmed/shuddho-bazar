import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Award, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';

interface HeroBannerProps {
  onShopNow: (categoryId?: string) => void;
  onQuickOrderProduct: (product: Product) => void;
  featuredProducts: Product[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  onQuickOrderProduct,
  featuredProducts,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'সুন্দরবনের ১০০% খাঁটি খলিশা ফুলের মধু',
      englishTitle: '100% Raw Wild Mangrove Honey',
      tagline: 'মৌয়ালদের সরাসরি চাক ভাঙা ভেজালহীন মধু। চিনিমুক্ত ও অপ্রক্রিয়াজাত।',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
      badge: '১০০% প্রাকৃতিক ও খাঁটি',
      categoryId: 'honey',
      productId: 'p1',
      accentColor: 'from-amber-950/80 to-stone-900/90'
    },
    {
      title: 'কাঠের ঘানিতে ভাঙা খাঁটি সরিষার তেল',
      englishTitle: 'Traditional Wood Cold-Pressed Mustard Oil',
      tagline: 'ন্যাচারাল ঝাঁঝ ও পুষ্টিমান অটুট। কোনো কেমিক্যাল বা ব্লিচিং ছাড়া প্রস্তুত।',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
      badge: 'কাঠের ঘানি ফ্রেশ',
      categoryId: 'oils',
      productId: 'p2',
      accentColor: 'from-emerald-950/80 to-stone-900/90'
    },
    {
      title: 'হাতে মন্থন করা বিলোনা গাওয়া ঘি',
      englishTitle: 'Hand-Churned Pure Deshi Cow Ghee',
      tagline: 'দানা দানা টেক্সচার ও লোভনীয় ঘ্রাণ। ঘাসের খাঁটি গাভীর দুধের মাখন থেকে তৈরি।',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
      badge: 'A2 গাওয়া ঘি',
      categoryId: 'ghee',
      productId: 'p3',
      accentColor: 'from-amber-950/85 to-stone-950/80'
    }
  ];

  // Auto advance slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden">
      {/* Banner Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md min-h-[340px] sm:min-h-[440px] md:min-h-[480px] flex items-center">
          {/* Slide Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out transform scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          />

          {/* Deep Natural Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} via-stone-900/70 to-transparent`} />

          {/* Content Box */}
          <div className="relative z-10 p-5 sm:p-10 md:p-14 max-w-2xl text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-900" />
              <span>{slide.badge}</span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl md:text-5xl tracking-tight leading-tight sm:leading-1.15 drop-shadow-xs">
              {slide.title}
            </h1>

            <p className="text-amber-200 text-sm sm:text-base font-semibold mt-2">
              {slide.englishTitle}
            </p>

            <p className="text-stone-300 text-xs sm:text-sm md:text-base mt-2 max-w-lg leading-relaxed">
              {slide.tagline}
            </p>

            {/* Banner Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6 sm:mt-8">
              <button
                id="hero-order-now-btn"
                onClick={() => {
                  const prod = featuredProducts.find(p => p.id === slide.productId);
                  if (prod) {
                    onQuickOrderProduct(prod);
                  } else {
                    onShopNow(slide.categoryId);
                  }
                }}
                className="px-5 sm:px-7 py-2.5 sm:py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl text-xs sm:text-sm tracking-wide transition-all transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>অর্ডার করুন (Order Now)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onShopNow(slide.categoryId)}
                className="px-4 sm:px-6 py-2.5 sm:py-3.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold rounded-xl text-xs sm:text-sm backdrop-blur-xs transition-colors cursor-pointer"
              >
                সবগুলো দেখুন
              </button>
            </div>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-7 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Ghorer Bazar Style Trust Highlights Bar */}
        <div className="mt-3 sm:mt-5 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">১০০% খাঁটি পণ্য</p>
              <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">ল্যাব টেস্টেড ও রাসায়নিকমুক্ত</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">ক্যাশ অন ডেলিভারি</p>
              <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">পণ্য হাতে পেয়ে মূল্য পরিশোধ</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">রিটার্ন গ্যারান্টি</p>
              <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">ভেজাল প্রমাণে মানিব্যাক</p>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 flex items-center gap-3 shadow-2xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">সরাসরি কৃষক থেকে</p>
              <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">মাঠ ও জঙ্গল থেকে সতেজ সংগ্রহ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
