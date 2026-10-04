import React from 'react';
import { Home, LayoutGrid, Search, Heart, ShoppingBag } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  cartCount: number;
  wishlistCount: number;
  onSelectTab: (tab: string) => void;
  onOpenCategories: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onFocusSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  onSelectTab,
  onOpenCategories,
  onOpenCart,
  onOpenWishlist,
  onFocusSearch,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center flex-1 py-1 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">হোম</span>
        </button>

        {/* Categories */}
        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center flex-1 py-1 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">ক্যাটাগরি</span>
        </button>

        {/* Search */}
        <button
          onClick={onFocusSearch}
          className="flex flex-col items-center justify-center flex-1 py-1 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">অনুসন্ধান</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center flex-1 py-1 text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0.5 right-4 min-w-3.5 h-3.5 px-0.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-semibold mt-0.5">পছন্দ</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center flex-1 py-1 text-emerald-800 transition-transform active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-emerald-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-amber-400 text-emerald-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-800 mt-0.5">কার্ট</span>
        </button>
      </div>
    </nav>
  );
};
