import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Package
} from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../types';
import { 
  getOrders, 
  updateOrderStatus, 
  deleteOrder,
} from '../../services/orderService';
import { OrderTable } from './OrderTable';
import { OrderDetails } from './OrderDetails';
import { CreateOrderPage } from './CreateOrderPage';

interface OrdersViewProps {
  initialSelectedOrder?: AdminOrder | null;
  onClearInitialOrder?: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  initialSelectedOrder,
  onClearInitialOrder,
}) => {
  // Navigation view mode inside Orders
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'details'>(
    initialSelectedOrder ? 'details' : 'list'
  );

  const [orders, setOrders] = useState<AdminOrder[]>(() => getOrders());
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(
    initialSelectedOrder || null
  );

  const [statusFilter, setStatusFilter] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync if initialSelectedOrder changes from outside
  useEffect(() => {
    if (initialSelectedOrder) {
      setSelectedOrder(initialSelectedOrder);
      setViewMode('details');
    }
  }, [initialSelectedOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(getOrders());
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`অর্ডার ${orderId} এর স্ট্যাটাস '${newStatus}' এ পরিবর্তন করা হয়েছে`);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে ${orderId} নম্বর অর্ডারটি ডিলিট করতে চান?`)) {
      const ok = deleteOrder(orderId);
      if (ok) {
        setOrders(getOrders());
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(null);
          setViewMode('list');
        }
        showToast(`অর্ডার ${orderId} সফলভাবে মুছে ফেলা হয়েছে`);
      }
    }
  };

  const handleOrderCreated = (newOrder: AdminOrder, printNow: boolean = false) => {
    setOrders(getOrders());
    setSelectedOrder(newOrder);
    setViewMode('details');
    showToast(`নতুন অর্ডার ${newOrder.id} সফলভাবে তৈরি হয়েছে!`);
    if (printNow) {
      setTimeout(() => {
        window.print();
      }, 300);
    }
  };

  // Toggle order checkbox selection
  const handleToggleSelectOrder = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Select/Deselect all
  const handleSelectAll = (select: boolean) => {
    if (select) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  // Bulk status update
  const handleBulkStatusChange = (newStatus: OrderStatus) => {
    if (selectedOrderIds.length === 0) return;
    selectedOrderIds.forEach((id) => updateOrderStatus(id, newStatus));
    setOrders(getOrders());
    showToast(`${selectedOrderIds.length} টি অর্ডারের স্ট্যাটাস '${newStatus}' এ হালনাগাদ করা হয়েছে`);
    setSelectedOrderIds([]);
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesQuery = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      (o.deliveryRider && o.deliveryRider.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  // Calculate order statistics
  const stats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === 'Delivered').length,
    processing: orders.filter((o) => o.status === 'Processing').length,
    shipped: orders.filter((o) => o.status === 'Shipped').length,
    cancelled: orders.filter((o) => o.status === 'Cancelled').length,
    totalSales: orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.amount : 0), 0),
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Address', 'Items Count', 'Total (BDT)', 'Payment Method', 'Status', 'Date', 'Courier'];
    const rows = filteredOrders.map(o => [
      `"${o.id}"`,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.customerAddress || ''}"`,
      o.itemsCount,
      o.amount,
      `"${o.paymentMethod}"`,
      `"${o.status}"`,
      `"${o.date}"`,
      `"${o.courierName || o.deliveryRider || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shuddho_bazar_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('অর্ডার ডাটা CSV ফরম্যাটে এক্সপোর্ট করা হয়েছে');
  };

  // Render Add Order Page
  if (viewMode === 'create') {
    return (
      <CreateOrderPage
        onBack={() => setViewMode('list')}
        onOrderCreated={handleOrderCreated}
      />
    );
  }

  // Render Dedicated Order Details Page
  if (viewMode === 'details' && selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => {
          setSelectedOrder(null);
          setViewMode('list');
          onClearInitialOrder?.();
        }}
        onUpdateStatus={handleUpdateStatus}
        onOrderUpdated={(updated) => {
          setOrders(getOrders());
          setSelectedOrder(updated);
          showToast(`অর্ডার ${updated.id} সফলভাবে আপডেট করা হয়েছে!`);
        }}
      />
    );
  }

  // Default: Orders List View
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 leading-tight">
              অর্ডার ব্যবস্থাপনা (Orders Management)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              {stats.total} Orders
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
            অনলাইন ও অফলাইন সকল অর্ডার ট্র্যাকিং, ডেলিভারি কুরিয়ারে হস্তান্তর ও চালান প্রিন্টিং।
          </p>
        </div>

        {/* Action Buttons: Add Order + Export */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => setViewMode('create')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন অর্ডার তৈরি (Add Order)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>এক্সপোর্ট (CSV)</span>
          </button>
        </div>
      </div>

      {/* Order Status Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider whitespace-nowrap">
              সর্বমোট অর্ডার
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-0.5 block">
              {stats.total}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5 whitespace-nowrap">
              মোট ৳ {stats.totalSales.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-lg">
            📦
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 block uppercase tracking-wider whitespace-nowrap">
              প্রসেসিং
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-0.5 block">
              {stats.processing}
            </span>
            <span className="text-[11px] text-stone-400 font-medium block mt-0.5 whitespace-nowrap">
              প্যাকিং ও যাচাই
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-600 block uppercase tracking-wider whitespace-nowrap">
              অন দ্য ওয়ে (Shipped)
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-0.5 block">
              {stats.shipped}
            </span>
            <span className="text-[11px] text-stone-400 font-medium block mt-0.5 whitespace-nowrap">
              কুরিয়ারে হস্তান্তরকৃত
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 block uppercase tracking-wider whitespace-nowrap">
              ডেলিভার্ড
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-0.5 block">
              {stats.delivered}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5 whitespace-nowrap">
              সফলভাবে সরবরাহকৃত
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
        {/* Bulk Actions Banner (appears when items selected) */}
        {selectedOrderIds.length > 0 && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="font-bold text-emerald-900 whitespace-nowrap">
              {selectedOrderIds.length} টি অর্ডার সিলেক্ট করা হয়েছে
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-stone-500 font-medium whitespace-nowrap">বাল্ক স্ট্যাটাস পরিবর্তন:</span>
              <button
                onClick={() => handleBulkStatusChange('Shipped')}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold cursor-pointer whitespace-nowrap"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => handleBulkStatusChange('Delivered')}
                className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold cursor-pointer whitespace-nowrap"
              >
                Mark as Delivered
              </button>
              <button
                onClick={() => setSelectedOrderIds([])}
                className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-bold cursor-pointer whitespace-nowrap"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            {(['All', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as const).map((st) => {
              const count = st === 'All' ? orders.length : orders.filter(o => o.status === st).length;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === st
                      ? 'bg-[#15803d] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{st}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold leading-none ${
                      statusFilter === st ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অর্ডার আইডি, নাম বা ফোন দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Order Table Component */}
        <OrderTable
          orders={filteredOrders}
          selectedOrders={selectedOrderIds}
          onToggleSelectOrder={handleToggleSelectOrder}
          onSelectAll={handleSelectAll}
          onViewOrder={(order) => {
            setSelectedOrder(order);
            setViewMode('details');
          }}
          onQuickUpdateStatus={handleUpdateStatus}
          onDeleteOrder={handleDeleteOrder}
          onCreateNewOrder={() => setViewMode('create')}
        />
      </div>
    </div>
  );
};
