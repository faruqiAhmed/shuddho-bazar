import React from 'react';
import { CATEGORIES } from '../data/mockData';
import { 
  X, 
  ChevronRight, 
  PhoneCall, 
  ShieldCheck, 
  Truck, 
  Heart, 
  HelpCircle,
  Sparkles,
  Layers,
  Droplet,
  Wheat,
  Flame,
  Sun,
  User,
  LogIn
} from 'lucide-react';
import { CustomerUser } from '../types';

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  currentUser: CustomerUser | null;
  onSelectCategory: (categoryId: string) => void;
  onOpenTrackOrder: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const MobileCategoryDrawer: React.FC<MobileCategoryDrawerProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  currentUser,
  onSelectCategory,
  onOpenTrackOrder,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
}) => {
  if (!isOpen) return null;

  const renderCategoryIcon = (id: string) => {
    switch (id) {
      case 'all':
        return <Layers className="w-5 h-5 text-emerald-700" />;
      case 'honey':
        return <span className="text-xl">🍯</span>;
      case 'oils':
        return <Droplet className="w-5 h-5 text-amber-600" />;
      case 'ghee':
        return <span className="text-xl">🧈</span>;
      case 'nuts':
        return <span className="text-xl">🥜</span>;
      case 'seeds':
        return <Wheat className="w-5 h-5 text-emerald-600" />;
      case 'spices':
        return <Flame className="w-5 h-5 text-rose-600" />;
      case 'dates':
        return <Sun className="w-5 h-5 text-amber-700" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-amber-300">
              SB
            </div>
            <div>
              <h3 className="font-display font-bold text-base leading-none">Shuddho Bazar</h3>
              <p className="text-[11px] text-emerald-200 mt-1">ক্যাটাগরি নেভিগেশন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-900/60 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account / Login Bar in Drawer */}
        <div className="p-3 bg-stone-50 border-b border-stone-200">
          {currentUser ? (
            <button
              onClick={() => {
                onClose();
                onOpenProfile();
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-600/40 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-emerald-800 font-medium">+880 {currentUser.phone}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-amber-300" />
                <div className="text-left">
                  <p className="text-xs font-bold">লগইন / নতুন একাউন্ট</p>
                  <p className="text-[10px] text-emerald-200">মোবাইল ওটিপিতে তাৎক্ষণিক লগইন</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-200" />
            </button>
          )}
        </div>

        {/* Purity Banner Pill */}
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-center gap-2 text-xs text-amber-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>১০০% ভেজালমুক্ত, সরাসরি কৃষক ও মৌয়াল থেকে</span>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
            পণ্য বিভাগ (Categories)
          </div>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                    : 'hover:bg-stone-50 text-stone-700 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100'
                  }`}>
                    {renderCategoryIcon(cat.id)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm leading-tight">{cat.bengaliName}</p>
                    <p className="text-xs text-stone-400 font-normal">{cat.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {cat.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {cat.badge}
                    </span>
                  )}
                  <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                    {cat.itemCount}
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-100 mt-2 space-y-1">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
              দ্রুত লিঙ্ক (Quick Links)
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenTrackOrder();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <span>অর্ডার ট্র্যাক করুন (Track Order)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenWishlist();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span>পছন্দের তালিকা (Wishlist)</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer Hotline */}
        <div className="p-3 bg-stone-50 border-t border-stone-200">
          <a
            href="tel:09612445566"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs hover:bg-emerald-900 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <span>সরাসরি কল করুন: 09612-445566</span>
          </a>
          <p className="text-center text-[10px] text-stone-500 mt-2">
            সকাল ৯টা থেকে রাত ১০টা পর্যন্ত কাস্টমার সাপোর্ট
          </p>
        </div>
      </div>
    </div>
  );
};
