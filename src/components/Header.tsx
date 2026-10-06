import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  PhoneCall, 
  Truck, 
  ShieldCheck, 
  Menu, 
  Clock, 
  X, 
  ChevronDown, 
  Layers,
  User
} from 'lucide-react';
import { Product, CustomerUser } from '../types';
import { formatBdt } from './BdtPrice';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  currentUser: CustomerUser | null;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenMenu: () => void;
  onOpenTrackOrder: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onOpenAllCategories?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  currentUser,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
  onOpenMenu,
  onOpenTrackOrder,
  searchQuery,
  setSearchQuery,
  products,
  onSelectProduct,
  selectedCategory,
  onSelectCategory,
  onOpenAllCategories,
  onOpenAdmin,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter products for quick live search suggestions
  const matchingProducts = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bengaliName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-[#e9e4dc]">
      {/* Top Announcement Bar */}
      <div className="bg-[#166534] text-emerald-50 text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span>৳১,৫০০ টাকার অর্ডারে ফ্রি ডেলিভারি! (Free delivery over ৳1,500)</span>
          </div>

          <div className="flex items-center">
            <button 
              id="header-track-order-btn"
              onClick={onOpenTrackOrder}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-emerald-100 font-medium hover:underline text-[11px] sm:text-xs"
            >
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span>Track Order (অর্ডার ট্র্যাক)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Search Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              id="header-mobile-menu-btn"
              onClick={onOpenMenu}
              className="p-2 -ml-1 text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-lg lg:hidden transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <a 
              href="#" 
              id="header-brand-logo"
              onClick={(e) => { e.preventDefault(); onSelectCategory('all'); }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tighter text-amber-300">
                  SB
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-lg sm:text-2xl text-stone-900 tracking-tight leading-none group-hover:text-emerald-800 transition-colors">
                    Shuddho<span className="text-emerald-700">Bazar</span>
                  </span>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                    Pure
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 tracking-wide">
                  ঘরের বাজার মতো খাঁটি পণ্য
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar with Autocomplete Dropdown */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6 relative">
            <div className="relative">
              <input
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="মধু, সরিষার তেল, ঘি বা ড্রাই ফ্রুটস খুঁজুন..."
                className="w-full pl-9 sm:pl-11 pr-8 py-2 sm:py-2.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs sm:text-sm text-stone-900 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Live Search Results Popup */}
            {isSearchFocused && matchingProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-stone-100 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="p-2 bg-stone-50/70 text-[11px] font-medium text-stone-500 flex justify-between items-center">
                  <span>Matching Products</span>
                  <span className="text-emerald-700 font-semibold">{matchingProducts.length} results</span>
                </div>
                {matchingProducts.map((p) => (
                  <div
                    key={p.id}
                    onMouseDown={() => {
                      onSelectProduct(p);
                      setIsSearchFocused(false);
                    }}
                    className="p-2.5 hover:bg-emerald-50/60 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-stone-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{p.bengaliName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-emerald-800">{formatBdt(p.price)}</p>
                      <p className="text-[10px] text-stone-400 line-through">{formatBdt(p.originalPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hotline & Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Quick Call Button (Desktop) */}
            <a
              href="tel:09612445566"
              id="header-hotline-call-btn"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200/80 rounded-full text-stone-800 hover:bg-amber-100/70 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
              <div className="text-left text-xs">
                <div className="text-[10px] text-stone-500 font-medium leading-none">সরাসরি কল করুন</div>
                <div className="font-bold text-stone-900 leading-tight">09612-445566</div>
              </div>
            </a>

            {/* User Account / Login Button */}
            {currentUser ? (
              <button
                id="header-user-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 transition-colors cursor-pointer"
                title="আমার একাউন্ট"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-600/30"
                />
                <span className="hidden sm:inline text-xs font-bold max-w-[90px] truncate">
                  {currentUser.name}
                </span>
              </button>
            ) : (
              <button
                id="header-user-login-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-bold border border-stone-200 transition-colors cursor-pointer"
                title="মোবাইল নম্বর ও ওটিপিতে লগইন"
              >
                <User className="w-4 h-4 text-emerald-700" />
                <span className="hidden sm:inline">লগইন</span>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 text-stone-600 hover:text-rose-600 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger (Only Icon, No Text) */}
            <button
              id="header-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 sm:p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
              aria-label="Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-amber-400 text-emerald-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-emerald-800 leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Category Bar */}
      <div className="hidden lg:block bg-[#f4f1ea] border-t border-[#e5dfd5]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>সকল পণ্য (All)</span>
            </button>
            <button
              onClick={() => onSelectCategory('honey')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'honey'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>🍯 খাঁটি মধু (Honey)</span>
            </button>
            <button
              onClick={() => onSelectCategory('oils')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'oils'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>🫒 ঘানির খাঁটি তেল (Oils)</span>
            </button>
            <button
              onClick={() => onSelectCategory('ghee')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'ghee'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>🧈 গাওয়া ঘি (Deshi Ghee)</span>
            </button>
            <button
              onClick={() => onSelectCategory('nuts')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'nuts'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>🥜 ড্রাই ফ্রুটস (Nuts)</span>
            </button>
            <button
              onClick={() => onSelectCategory('seeds')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'seeds'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>🌱 সুপারফুড ও বীজ (Seeds)</span>
            </button>
            <button
              onClick={() => onSelectCategory('spices')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'spices'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>🌶️ খাঁটি মশলা (Spices)</span>
            </button>
            <button
              onClick={() => onSelectCategory('dates')}
              className={`px-3.5 py-2.5 rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'dates'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-700 shadow-2xs'
                  : 'text-stone-700 hover:text-emerald-800 hover:bg-stone-200/50'
              }`}
            >
              <span>🌴 খেজুর ও গুড় (Dates & Gur)</span>
            </button>

            {onOpenAllCategories && (
              <button
                onClick={onOpenAllCategories}
                className="px-3 py-2 rounded-lg text-emerald-800 hover:text-emerald-950 font-extrabold hover:bg-emerald-100/70 transition-colors cursor-pointer flex items-center gap-1 text-[11px] ml-1 bg-emerald-50 border border-emerald-200/60"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>সব ক্যাটাগরি দেখুন</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
