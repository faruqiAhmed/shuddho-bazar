import React, { useState, useEffect } from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { Product, WeightOption } from '../types';
import { ProductCard } from './ProductCard';

interface FlashDealsProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedWeight: WeightOption) => void;
  onQuickOrder: (product: Product, selectedWeight: WeightOption) => void;
  wishlist: string[];
  onToggleWishlist: (product: Product) => void;
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onQuickOrder,
  wishlist,
  onToggleWishlist,
}) => {
  const flashProducts = products.filter(p => p.isFlashDeal);

  // Countdown timer: 5 hours, 42 minutes, 19 seconds ticking
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
      {/* Flash Header Box */}
      <div className="bg-gradient-to-r from-rose-900 via-amber-950 to-emerald-950 text-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
            <Flame className="w-6 h-6 fill-amber-950 text-amber-950 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                সীমিত সময়ের অফার
              </span>
              <span className="text-xs text-amber-300 font-semibold">Special Discount</span>
            </div>
            <h2 className="font-display font-extrabold text-lg sm:text-2xl mt-0.5">
              হট ফ্ল্যাশ ডিল (Flash Deals)
            </h2>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs text-stone-300 font-medium mr-1">অফারের বাকি:</span>
          
          <div className="flex items-center gap-1.5 font-mono">
            <div className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 text-center min-w-9">
              <span className="text-base sm:text-lg font-bold text-amber-300">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="block text-[8px] uppercase tracking-tighter text-stone-400">Hours</span>
            </div>
            <span className="text-amber-400 font-bold">:</span>
            <div className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 text-center min-w-9">
              <span className="text-base sm:text-lg font-bold text-amber-300">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="block text-[8px] uppercase tracking-tighter text-stone-400">Min</span>
            </div>
            <span className="text-amber-400 font-bold">:</span>
            <div className="bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/20 text-center min-w-9">
              <span className="text-base sm:text-lg font-bold text-amber-300">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="block text-[8px] uppercase tracking-tighter text-stone-400">Sec</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Deals Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        {flashProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
            onQuickOrder={onQuickOrder}
            isWishlisted={wishlist.includes(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
};
