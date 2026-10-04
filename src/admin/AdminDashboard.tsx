import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { AdminTab, AdminOrder } from './types';
import { ADMIN_STATS } from './data/adminMockData';

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

interface AdminDashboardProps {
  onSwitchToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSwitchToStore }) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<AdminOrder | null>(null);
  const [dateRange, setDateRange] = useState('Sep 21, 2025 - Sep 27, 2025');

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
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-7 md:p-8 space-y-6 max-w-[1600px] w-full mx-auto">
          {currentTab === 'dashboard' && (
            <>
              {/* Welcome Header & Date Selector (exact from screenshot) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
                    Welcome back, Md Omar Faruq!
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
                    Here's what's happening with your Shuddho Bazar store today.
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
                {ADMIN_STATS.map((stat, idx) => (
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
                  Shuddho Bazar Admin Panel v1.0 • Built with precision
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
