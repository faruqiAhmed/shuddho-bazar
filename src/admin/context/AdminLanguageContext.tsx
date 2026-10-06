import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentDateRange } from '../../utils/dateUtils';

export type AdminLanguage = 'bn' | 'en';

interface AdminLanguageContextType {
  language: AdminLanguage;
  setLanguage: (lang: AdminLanguage) => void;
  isBn: boolean;
  tr: (bnText: string, enText: string) => string;
  t: (key: string, fallback?: string) => string;
  formatNumber: (val: number | string) => string;
  formatPrice: (amount: number) => string;
}

const STORAGE_KEY = 'shuddho_admin_language';

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export const toBengaliDigits = (num: number | string): string => {
  return String(num).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)] ?? d);
};

const DICTIONARY: Record<string, { bn: string; en: string }> = {
  // Navigation
  dashboard: { bn: 'ড্যাশবোর্ড', en: 'Dashboard' },
  orders: { bn: 'অর্ডার সমূহ', en: 'Orders' },
  products: { bn: 'পণ্য তালিকা', en: 'Products' },
  categories: { bn: 'ক্যাটাগরি', en: 'Categories' },
  inventory: { bn: 'ইনভেন্টরি ও স্টক', en: 'Inventory' },
  customers: { bn: 'গ্রাহক তালিকা', en: 'Customers' },
  delivery: { bn: 'ডেলিভারি ট্র্যাকিং', en: 'Delivery' },
  payments: { bn: 'পেমেন্ট ও হিসাব', en: 'Payments' },
  promotions: { bn: 'প্রমোশন ও কুপন', en: 'Promotions' },
  reports: { bn: 'রিপোর্ট ও অ্যানালিটিক্স', en: 'Reports' },
  settings: { bn: 'সেটিংস', en: 'Settings' },

  // Header & Controls
  searchPlaceholder: { bn: 'পণ্য, অর্ডার বা গ্রাহক খুঁজুন...', en: 'Search products, orders, customers...' },
  storePreview: { bn: 'স্টোর প্রিভিউ', en: 'Store Preview' },
  viewStore: { bn: 'গ্রাহক স্টোর দেখুন', en: 'View Store' },
  notifications: { bn: 'নোটিফিকেশন', en: 'Notifications' },
  markAllRead: { bn: 'সব পঠিত হিসেবে চিহ্নিত করুন', en: 'Mark all as read' },
  adminRole: { bn: 'অ্যাডমিন', en: 'Admin' },

  // Welcome & Dashboard Overview
  welcomeTitle: { bn: 'স্বাগতম, মোঃ ওমর ফারুক!', en: 'Welcome back, Md Omar Faruq!' },
  welcomeSubtitle: { bn: 'আজকের শুদ্ধ বাজার স্টোরের সার্বিক পরিস্থিতি ও তথ্য:', en: "Here's what's happening with your Shuddho Bazar store today." },
  dateRange: { bn: getCurrentDateRange(true), en: getCurrentDateRange(false) },

  // Stats
  totalSales: { bn: 'মোট বিক্রয়', en: 'Total Sales' },
  totalOrders: { bn: 'মোট অর্ডার', en: 'Total Orders' },
  totalCustomers: { bn: 'মোট গ্রাহক', en: 'Total Customers' },
  totalProducts: { bn: 'মোট পণ্য সংখ্যা', en: 'Total Products' },
  vsLast7Days: { bn: 'বিগত ৭ দিনের তুলনায়', en: 'vs. last 7 days' },

  // Charts
  revenueOverview: { bn: 'আয়ের সারসংক্ষেপ', en: 'Revenue Overview' },
  revenueSubtitle: { bn: 'বিগত নির্দিষ্ট সময়ের মোট বিক্রয় রেভিনিউ', en: 'Total sales revenue for the selected timeframe' },
  orderStatus: { bn: 'অর্ডার স্ট্যাটাস', en: 'Order Status Breakdown' },
  salesByCategory: { bn: 'ক্যাটাগরি ভিত্তিক বিক্রয়', en: 'Sales by Category' },
  viewAll: { bn: 'সব দেখুন', en: 'View All' },

  // Operational Lists
  recentOrders: { bn: 'সাম্প্রতিক অর্ডারসমূহ', en: 'Recent Orders' },
  recentOrdersSubtitle: { bn: 'সর্বশেষ গ্রাহক অর্ডার ও স্থিতি', en: 'Latest customer orders and fulfillment status' },
  lowStockAlert: { bn: 'লো স্টক অ্যালার্ট', en: 'Low Stock Alert' },
  lowStockSubtitle: { bn: 'দ্রুত রি-স্টক প্রয়োজন এমন পণ্যসমূহ', en: 'Products running low on inventory' },
  deliveryPerformance: { bn: 'ডেলিভারি পারফরম্যান্স', en: 'Delivery Performance' },
  deliverySubtitle: { bn: 'চলতি সপ্তাহের লজিস্টিকস ও কুরিয়ার রিপোর্ট', en: 'Weekly logistics & courier completion rate' },

  // Action Buttons
  addOrder: { bn: 'নতুন অর্ডার তৈরি করুন', en: 'Create New Order' },
  addProduct: { bn: 'নতুন পণ্য যোগ করুন', en: 'Add New Product' },
  filter: { bn: 'ফিল্টার', en: 'Filter' },
  exportCsv: { bn: 'CSV এক্সপোর্ট', en: 'Export CSV' },
  save: { bn: 'সংরক্ষণ করুন', en: 'Save Changes' },
  cancel: { bn: 'বাতিল', en: 'Cancel' },
  edit: { bn: 'সম্পাদনা', en: 'Edit' },
  delete: { bn: 'মুছে ফেলুন', en: 'Delete' },
  back: { bn: 'ফিরে যান', en: 'Back' },
};

const AdminLanguageContext = createContext<AdminLanguageContextType | undefined>(undefined);

export const AdminLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AdminLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'bn' || saved === 'en') {
        return saved;
      }
    } catch (e) {
      // Local storage unavailable
    }
    return 'bn';
  });

  const setLanguage = (lang: AdminLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
  };

  const isBn = language === 'bn';

  const tr = (bnText: string, enText: string): string => {
    return isBn ? bnText : enText;
  };

  const t = (key: string, fallback?: string): string => {
    const entry = DICTIONARY[key];
    if (entry) {
      return isBn ? entry.bn : entry.en;
    }
    return fallback || key;
  };

  const formatNumber = (val: number | string): string => {
    if (isBn) {
      return toBengaliDigits(val);
    }
    return String(val);
  };

  const formatPrice = (amount: number): string => {
    if (isBn) {
      return `৳ ${toBengaliDigits(amount.toLocaleString('en-IN'))}`;
    }
    return `৳ ${amount.toLocaleString('en-IN')}`;
  };

  return (
    <AdminLanguageContext.Provider
      value={{
        language,
        setLanguage,
        isBn,
        tr,
        t,
        formatNumber,
        formatPrice,
      }}
    >
      {children}
    </AdminLanguageContext.Provider>
  );
};

export const useAdminLanguage = (): AdminLanguageContextType => {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error('useAdminLanguage must be used within an AdminLanguageProvider');
  }
  return context;
};
