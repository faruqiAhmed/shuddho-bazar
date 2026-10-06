import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Boxes, 
  Users, 
  Truck, 
  CreditCard, 
  Tag, 
  BarChart3, 
  Settings, 
  X, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AdminTab } from '../../types';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSwitchToStore: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  onSwitchToStore,
}) => {
  const { isBn, tr, formatNumber } = useAdminLanguage();

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', bengaliLabel: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, label: 'Orders', bengaliLabel: 'অর্ডার সমূহ', icon: ShoppingBag, badge: 12 },
    { id: 'products' as AdminTab, label: 'Products', bengaliLabel: 'পণ্য তালিকা', icon: Package },
    { id: 'categories' as AdminTab, label: 'Categories', bengaliLabel: 'ক্যাটাগরি', icon: Layers },
    { id: 'inventory' as AdminTab, label: 'Inventory', bengaliLabel: 'ইনভেন্টরি ও স্টক', icon: Boxes },
    { id: 'customers' as AdminTab, label: 'Customers', bengaliLabel: 'গ্রাহক তালিকা', icon: Users },
    { id: 'delivery' as AdminTab, label: 'Delivery', bengaliLabel: 'ডেলিভারি ট্র্যাকিং', icon: Truck },
    { id: 'payments' as AdminTab, label: 'Payments', bengaliLabel: 'পেমেন্ট ও হিসাব', icon: CreditCard },
    { id: 'promotions' as AdminTab, label: 'Promotions', bengaliLabel: 'প্রমোশন ও কুপন', icon: Tag },
    { id: 'reports' as AdminTab, label: 'Reports', bengaliLabel: 'রিপোর্ট ও অ্যানালিটিক্স', icon: BarChart3 },
    { id: 'settings' as AdminTab, label: 'Settings', bengaliLabel: 'সেটিংস', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-stone-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Top Brand Logo */}
          <div className="h-20 flex items-center justify-between px-5 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              {/* Organic Sprout Leaf Icon */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center text-white shadow-xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
                </svg>
              </div>

              <div>
                <h1 className="font-display font-extrabold text-lg text-stone-900 leading-none tracking-tight">
                  Shuddho <span className="text-emerald-700">Bazar</span>
                </h1>
                <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                  {tr('শুদ্ধ খাবার, সুস্থ জীবন', 'Pure Food, Healthy Life')}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#e8f5e9] text-[#166534] font-bold shadow-2xs'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#166534]' : 'text-stone-400'}`} />
                    <span>{isBn ? item.bengaliLabel : item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {formatNumber(item.badge)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-stone-100 space-y-2">
          {/* Quick Storefront View Button */}
          <button
            onClick={onSwitchToStore}
            className="w-full flex items-center justify-between px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-emerald-200/80"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{tr('গ্রাহক স্টোর দেখুন', 'View Storefront')}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          </button>

          {/* Fresh & Healthy Promo Card (exact from screenshot) */}
          <div className="p-3.5 bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7]/40 rounded-2xl border border-emerald-100 text-center relative overflow-hidden">
            <div className="w-12 h-12 mx-auto mb-1.5 flex items-center justify-center text-3xl">
              🥗
            </div>
            <p className="font-display font-extrabold text-xs text-emerald-950">
              {tr('তাজা ও স্বাস্থ্যকর', 'Fresh & Healthy')}
            </p>
            <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">
              {tr('সুস্থ খাবার, সুন্দর জীবন', 'Good Food, Better Life')}
            </p>
            <div className="w-3 h-3 text-emerald-600 mx-auto mt-1">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
              </svg>
            </div>
          </div>

          {/* Version text */}
          <p className="text-[10px] text-center text-stone-400 font-medium">
            Shuddho Bazar Admin Panel v1.0
          </p>
        </div>
      </aside>
    </>
  );
};
