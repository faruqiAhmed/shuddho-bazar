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
  Package,
  Trash2,
  Check,
  ShoppingBag
} from 'lucide-react';
import { AdminOrder } from '../../types';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  onSwitchToStore: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  orders?: AdminOrder[];
  onSelectOrder?: (order: AdminOrder) => void;
  onClearDemoData?: () => void;
  hasNewOrderAlert?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  onSwitchToStore,
  searchQuery,
  onSearchChange,
  orders = [],
  onSelectOrder,
  onClearDemoData,
  hasNewOrderAlert = false,
}) => {
  const { language, setLanguage, tr, t } = useAdminLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Dynamic recent orders as real notifications
  const recentOrderNotifications = orders.slice(0, 5);
  const unreadCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length;

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={tr('পণ্য, অর্ডার, গ্রাহক বা লেনদেন খুঁজুন...', 'Search products, orders, customers...')}
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
          <span>{tr('স্টোর প্রিভিউ', 'Store Preview')}</span>
          <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
        </button>

        {/* Notifications with Bell & Badge */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {hasNewOrderAlert && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-rose-600 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                <span className="font-bold text-xs text-stone-900">
                  {tr(`নতুন অর্ডার নোটিফিকেশন (${unreadCount}টি অপেক্ষমাণ)`, `Order Notifications (${unreadCount} Pending)`)}
                </span>
                {onClearDemoData && (
                  <button
                    onClick={() => {
                      onClearDemoData();
                      setIsNotificationOpen(false);
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                    title="পুরনো ডেমো অর্ডার মুছে ফেলুন"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{tr('ডেমো ডেটা ক্লিয়ার', 'Clear Demo')}</span>
                  </button>
                )}
              </div>

              <div className="divide-y divide-stone-100 text-xs mt-1 max-h-80 overflow-y-auto">
                {recentOrderNotifications.length === 0 ? (
                  <div className="py-6 text-center text-stone-400">
                    <p className="text-xs">{tr('কোনো নতুন নোটিফিকেশন নেই', 'No new notifications')}</p>
                  </div>
                ) : (
                  recentOrderNotifications.map((ord) => (
                    <div 
                      key={ord.id}
                      onClick={() => {
                        if (onSelectOrder) onSelectOrder(ord);
                        setIsNotificationOpen(false);
                      }}
                      className="py-2.5 px-2 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer flex items-start gap-2.5"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-stone-900 truncate">
                            {tr('নতুন অর্ডার', 'New Order')} {ord.id}
                          </p>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                            ord.paymentMethod === 'Nagad' 
                              ? 'bg-orange-100 text-orange-800'
                              : ord.paymentMethod === 'bKash'
                              ? 'bg-pink-100 text-pink-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ord.paymentMethod}
                          </span>
                        </div>
                        <p className="text-stone-600 text-[11px] mt-0.5 truncate">
                          {ord.customerName} • ৳{ord.amount}
                        </p>
                        <span className="text-[10px] text-stone-400 block mt-0.5">
                          {ord.date}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer bg-white shadow-2xs"
            title="ভাষা পরিবর্তন / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-bold">{language === 'bn' ? 'বাংলা' : 'English'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50 animate-in fade-in duration-150">
              <button
                onClick={() => {
                  setLanguage('bn');
                  setIsLangOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                  language === 'bn' ? 'text-emerald-700 bg-emerald-50/50' : 'text-stone-700'
                }`}
              >
                <span>বাংলা</span>
                {language === 'bn' && <Check className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  setIsLangOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                  language === 'en' ? 'text-emerald-700 bg-emerald-50/50' : 'text-stone-700'
                }`}
              >
                <span>English</span>
                {language === 'en' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* User Admin Avatar Profile */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-stone-200">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#14281e] text-amber-300 font-extrabold flex items-center justify-center text-sm shadow-2xs border border-emerald-950/20">
            DF
          </div>
          <div className="hidden sm:block text-left">
            <div className="font-bold text-xs text-stone-900 leading-tight">
              মো. ওমর ফারুক
            </div>
            <div className="text-[10px] text-emerald-800 font-bold leading-tight">
              {tr('প্রধান প্রশাসক', 'Super Admin')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
