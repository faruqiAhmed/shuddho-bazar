import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { AdminTab, AdminOrder, AdminStat } from './types';
import { ADMIN_STATS } from './data/adminMockData';
import { getOrders, subscribeToOrders } from './services/orderService';
import { getProducts, subscribeToProducts } from './services/productService';

import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';

import { StatCard } from './components/dashboard/StatCard';
import { RevenueChart } from './components/dashboard/RevenueChart';
import { OrderStatusChart } from './components/dashboard/OrderStatusChart';
import { SalesByCategory } from './components/dashboard/SalesByCategory';
import { RecentOrders } from './components/dashboard/RecentOrders';
import { LowStockProducts } from './components/dashboard/LowStockProducts';
import { DeliveryPerformance } from './components/dashboard/DeliveryPerformance';

import { OrdersView } from './components/orders/OrdersView';
import { OrderDetailsModal } from './components/orders/OrderDetailsModal';
import { ProductsView } from './components/products/ProductsView';
import { CategoriesView } from './components/categories/CategoriesView';
import { InventoryView } from './components/inventory/InventoryView';
import { CustomersView } from './components/customers/CustomersView';
import { DeliveryView } from './components/delivery/DeliveryView';
import { PaymentsView } from './components/payments/PaymentsView';
import { PromotionsView } from './components/promotions/PromotionsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminLanguageProvider, useAdminLanguage } from './context/AdminLanguageContext';
import { playNewOrderSound } from '../utils/audioNotification';
import { getCurrentDateRange } from '../utils/dateUtils';
import { Bell, Check, ShoppingBag, X } from 'lucide-react';

interface AdminDashboardProps {
  onSwitchToStore: () => void;
}

const AdminDashboardInner: React.FC<AdminDashboardProps> = ({ onSwitchToStore }) => {
  const { tr, isBn } = useAdminLanguage();
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<AdminOrder | null>(null);

  const [orders, setOrders] = useState(() => getOrders());
  const [products, setProducts] = useState(() => getProducts());

  const [hasNewOrderAlert, setHasNewOrderAlert] = useState(false);
  const [newOrderToast, setNewOrderToast] = useState<{ id: string; name: string; amount: number; method: string } | null>(null);
  const prevOrdersCountRef = React.useRef(orders.length);

  useEffect(() => {
    const unsub1 = subscribeToOrders(() => {
      const updated = getOrders();
      if (updated.length > prevOrdersCountRef.current) {
        const latest = updated[0];
        playNewOrderSound();
        setHasNewOrderAlert(true);
        setNewOrderToast({
          id: latest.id,
          name: latest.customerName,
          amount: latest.amount,
          method: latest.paymentMethod
        });
        setTimeout(() => setNewOrderToast(null), 8000);
      }
      prevOrdersCountRef.current = updated.length;
      setOrders(updated);
    });
    const unsub2 = subscribeToProducts(() => setProducts(getProducts()));
    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  const handleClearDemoData = async () => {
    try {
      await fetch('/api/orders/clear-demo', { method: 'POST' });
    } catch {}
    localStorage.removeItem('shuddho_bazar_admin_orders');
    localStorage.removeItem('shuddho_orders');
    setOrders([]);
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.customerPhone || o.customerName)).size || 12;
  const totalProducts = products.length;

  const dynamicStats: AdminStat[] = [
    {
      title: 'Total Sales',
      value: `৳ ${totalSales.toLocaleString('en-IN')}`,
      change: '+15.2%',
      isPositive: true,
      comparisonPeriod: 'vs. last 7 days',
      iconType: 'sales',
      sparklineData: [15, 18, 22, 28, 26, 38, 34],
    },
    {
      title: 'Total Orders',
      value: `${totalOrders}`,
      change: '+18.3%',
      isPositive: true,
      comparisonPeriod: 'vs. last 7 days',
      iconType: 'orders',
      sparklineData: [10, 14, 18, 24, 22, 32, 36],
    },
    {
      title: 'Total Customers',
      value: `${uniqueCustomers}`,
      change: '+9.7%',
      isPositive: true,
      comparisonPeriod: 'vs. last 7 days',
      iconType: 'customers',
      sparklineData: [8, 11, 13, 16, 20, 25, 29],
    },
    {
      title: 'Total Products',
      value: `${totalProducts}`,
      change: '+4.5%',
      isPositive: true,
      comparisonPeriod: 'vs. last 7 days',
      iconType: 'products',
      sparklineData: [12, 14, 15, 18, 22, 24, 27],
    },
  ];

  const dateRange = getCurrentDateRange(isBn);

  return (
    <div className="min-h-screen bg-[#f8faf8] text-stone-900 flex font-sans antialiased">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSwitchToStore={onSwitchToStore}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onSwitchToStore={onSwitchToStore}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          orders={orders}
          onSelectOrder={(ord) => {
            setSelectedOrderForModal(ord);
            setHasNewOrderAlert(false);
          }}
          onClearDemoData={handleClearDemoData}
          hasNewOrderAlert={hasNewOrderAlert}
        />

        {/* Real-Time New Order Floating Toast Banner */}
        {newOrderToast && (
          <div className="fixed top-24 right-6 z-50 bg-[#183124] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3.5 animate-in slide-in-from-top-4 duration-300 max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[10px]">
                  🔔 নতুন অর্ডার এসেছে!
                </span>
                <button
                  onClick={() => setNewOrderToast(null)}
                  className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="font-bold text-white text-sm mt-0.5 truncate">
                {newOrderToast.id} • ৳{newOrderToast.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-stone-300 text-[11px] truncate mt-0.5">
                {newOrderToast.name} • {newOrderToast.method}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-7 md:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {currentTab === 'dashboard' && (
            <>
              {/* Welcome Header & Date Selector (exact from screenshot) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
                    {tr('স্বাগতম, মোঃ ওমর ফারুক!', 'Welcome back, Md Omar Faruq!')}
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
                    {tr(
                      'আজকের শুদ্ধ বাজার স্টোরের সার্বিক পরিস্থিতি ও তথ্য:',
                      "Here's what's happening with your Shuddho Bazar store today."
                    )}
                  </p>
                </div>

                {/* Date range picker button (exact from screenshot) */}
                <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-stone-200/90 rounded-xl text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 cursor-pointer">
                  <Calendar className="w-4 h-4 text-stone-500" />
                  <span>{dateRange}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>

              {/* Row 1: 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dynamicStats.map((stat, idx) => (
                  <StatCard key={idx} stat={stat} />
                ))}
              </div>

              {/* Row 2: 3 Analytics Cards (Revenue, Order Status, Sales by Category) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <RevenueChart />
                <OrderStatusChart />
                <SalesByCategory onViewAll={() => setCurrentTab('categories')} />
              </div>

              {/* Row 3: 3 Operational Cards (Recent Orders, Low Stock, Delivery Performance) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Recent Orders Table (occupies 6 cols on desktop) */}
                <div className="lg:col-span-6">
                  <RecentOrders
                    onViewAll={() => setCurrentTab('orders')}
                    onViewOrderDetails={(order) => {
                      setSelectedOrderForModal(order);
                      setCurrentTab('orders');
                    }}
                  />
                </div>

                {/* Low Stock Products (occupies 3 cols on desktop) */}
                <div className="lg:col-span-3">
                  <LowStockProducts
                    onViewAll={() => setCurrentTab('inventory')}
                    onRestockProduct={() => setCurrentTab('inventory')}
                  />
                </div>

                {/* Delivery Performance (occupies 3 cols on desktop) */}
                <div className="lg:col-span-3">
                  <DeliveryPerformance
                    onViewDetails={() => setCurrentTab('delivery')}
                  />
                </div>
              </div>

              {/* Footer Quote (exact from screenshot) */}
              <div className="pt-4 pb-2 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
                <span className="text-[11px] text-stone-400">
                  {tr(
                    'শুদ্ধ বাজার অ্যাডমিন প্যানেল v১.০ • নির্ভুল খাদ্যসেবা',
                    'Shuddho Bazar Admin Panel v1.0 • Built with precision'
                  )}
                </span>
                <span className="font-semibold text-emerald-800">
                  সুস্থ থাকুন | শুদ্ধ খাবার খান 🌿
                </span>
              </div>
            </>
          )}

          {currentTab === 'orders' && (
            <OrdersView
              initialSelectedOrder={selectedOrderForModal}
              onClearInitialOrder={() => setSelectedOrderForModal(null)}
            />
          )}
          {currentTab === 'products' && <ProductsView />}
          {currentTab === 'categories' && <CategoriesView />}
          {currentTab === 'inventory' && <InventoryView />}
          {currentTab === 'customers' && <CustomersView />}
          {currentTab === 'delivery' && <DeliveryView />}
          {currentTab === 'payments' && <PaymentsView />}
          {currentTab === 'promotions' && <PromotionsView />}
          {currentTab === 'reports' && <ReportsView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Shared Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
      />
    </div>
  );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  return (
    <AdminLanguageProvider>
      <AdminDashboardInner {...props} />
    </AdminLanguageProvider>
  );
};
