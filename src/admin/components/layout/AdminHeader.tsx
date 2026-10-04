import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  ChevronDown, 
  Menu, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Package
} from 'lucide-react';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onSwitchToStore: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onSwitchToStore,
  searchQuery,
  onSearchChange,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'বাংলা' | 'English'>('বাংলা');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar (exact from screenshot) */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, orders, customers..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/90 rounded-xl text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Switch to Storefront Button */}
        <button
          onClick={onSwitchToStore}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-emerald-200/70"
          title="Open Customer Storefront"
        >
          <span>স্টোর প্রিভিউ</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
        </button>

        {/* Notifications with Bell & Badge */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="font-bold text-xs text-stone-900">Notifications (3 নতুন)</span>
                <span className="text-[10px] text-emerald-700 font-semibold cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-stone-100 text-xs mt-1">
                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">নতুন অর্ডার #SB-10248</p>
                    <p className="text-stone-500 text-[11px]">রাফি আহমেদ - ৳১,২৪৫ (bKash)</p>
                    <span className="text-[10px] text-stone-400">২ মিনিট আগে</span>
                  </div>
                </div>

                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">লো স্টক অ্যালার্ট</p>
                    <p className="text-stone-500 text-[11px]">চাল (আটপৌরে) ৫ কেজি মাত্র ৩টি বাকি</p>
                    <span className="text-[10px] text-stone-400">১৫ মিনিট আগে</span>
                  </div>
                </div>

                <div className="py-2.5 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">ডেলিভারি সম্পন্ন</p>
                    <p className="text-stone-500 text-[11px]">অর্ডার #SB-10245 গ্রাহকের ঠিকানায় পৌঁছেছে</p>
                    <span className="text-[10px] text-stone-400">১ ঘণ্টা আগে</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Language Selector (exact from screenshot) */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-stone-500" />
            <span>{selectedLang}</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50 text-xs font-semibold">
              <button
                onClick={() => { setSelectedLang('বাংলা'); setIsLangOpen(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-stone-50 text-stone-800"
              >
                বাংলা
              </button>
              <button
                onClick={() => { setSelectedLang('English'); setIsLangOpen(false); }}
                className="w-full text-left px-3 py-1.5 hover:bg-stone-50 text-stone-800"
              >
                English
              </button>
            </div>
          )}
        </div>

        {/* User Profile (exact from screenshot) */}
        <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-stone-200">
          <div className="w-9 h-9 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs ring-2 ring-emerald-600/30 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" 
              alt="Md Omar Faruq" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image blocked
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-bold text-stone-700">OF</span>
          </div>

          <div className="hidden sm:block text-left">
            <p className="font-bold text-xs text-stone-900 leading-tight">
              Md Omar Faruq
            </p>
            <p className="text-[10px] text-stone-400 font-medium">
              Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
