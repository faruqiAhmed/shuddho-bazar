import React from 'react';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { CustomerUser } from '../types';

interface MobileBottomNavProps {
  currentTab: string;
  cartCount: number;
  wishlistCount: number;
  currentUser: CustomerUser | null;
  onSelectTab: (tab: string) => void;
  onOpenCategories: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  onSelectTab,
  onOpenCategories,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
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

        {/* Account / Login */}
        <button
          onClick={currentUser ? onOpenProfile : onOpenAuth}
          className="flex flex-col items-center justify-center flex-1 py-1 text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          {currentUser ? (
            <div className="relative">
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                alt={currentUser.name} 
                className="w-5 h-5 rounded-full object-cover border border-emerald-600"
              />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white" />
            </div>
          ) : (
            <User className="w-5 h-5 text-stone-600" />
          )}
          <span className="text-[10px] font-semibold mt-0.5">
            {currentUser ? 'প্রোফাইল' : 'লগইন'}
          </span>
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
