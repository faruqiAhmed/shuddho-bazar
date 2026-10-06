import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { AdminOrder } from '../../types';
import { getOrders, subscribeToOrders } from '../../services/orderService';
import { useAdminLanguage } from '../../context/AdminLanguageContext';

interface RecentOrdersProps {
  onViewAll?: () => void;
  onViewOrderDetails?: (order: AdminOrder) => void;
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({
  onViewAll,
  onViewOrderDetails,
}) => {
  const { tr, formatPrice, formatNumber } = useAdminLanguage();
  const [orders, setOrders] = useState<AdminOrder[]>(() => getOrders());

  useEffect(() => {
    const unsub = subscribeToOrders(() => {
      setOrders(getOrders());
    });
    return unsub;
  }, []);
  // Render payment method badge
  const renderPaymentBadge = (method: AdminOrder['paymentMethod']) => {
    switch (method) {
      case 'bKash':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fdf2f8] text-[#db2777] border border-pink-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#db2777] mr-1" />
            bKash
          </span>
        );
      case 'Cash on Delivery':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#eff6ff] text-[#2563eb] border border-blue-200">
            Cash on Delivery
          </span>
        );
      case 'Nagad':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fff7ed] text-[#ea580c] border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mr-1" />
            Nagad
          </span>
        );
      case 'Card':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f5f3ff] text-[#7c3aed] border border-purple-200">
            Card
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
            {method}
          </span>
        );
    }
  };

  // Render status badge
  const renderStatusBadge = (status: AdminOrder['status']) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#15803d]">
            {tr('ডেলিভার্ড', 'Delivered')}
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#d97706]">
            {tr('প্রসেসিং', 'Processing')}
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dbeafe] text-[#2563eb]">
            {tr('শিপ্ড', 'Shipped')}
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fee2e2] text-[#dc2626]">
            {tr('বাতিল', 'Cancelled')}
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-stone-900 leading-tight">
              {tr('সাম্প্রতিক অর্ডারসমূহ', 'Recent Orders')}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {tr('সর্বশেষ গ্রাহক অর্ডার ও স্থিতি', 'Latest customer orders and fulfillment status')}
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            {tr('সব দেখুন', 'View All')}
          </button>
        )}
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto no-scrollbar -mx-5 px-5">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-stone-100 text-stone-400 font-semibold text-[11px]">
              <th className="py-3 px-3 font-semibold">{tr('অর্ডার আইডি', 'Order ID')}</th>
              <th className="py-3 px-3 font-semibold">{tr('গ্রাহক', 'Customer')}</th>
              <th className="py-3 px-3 font-semibold">{tr('আইটেম', 'Items')}</th>
              <th className="py-3 px-3 font-semibold">{tr('মূল্য', 'Amount')}</th>
              <th className="py-3 px-3 font-semibold">{tr('পেমেন্ট', 'Payment')}</th>
              <th className="py-3 px-3 font-semibold">{tr('স্ট্যাটাস', 'Status')}</th>
              <th className="py-3 px-3 font-semibold">{tr('তারিখ', 'Date')}</th>
              <th className="py-3 px-3 font-semibold text-right">{tr('অ্যাকশন', 'Action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.slice(0, 6).map((order) => (
              <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                {/* Order ID */}
                <td className="py-3.5 px-3 font-bold text-stone-900">
                  {order.id}
                </td>

                {/* Customer */}
                <td className="py-3.5 px-3">
                  <div className="font-bold text-stone-800">
                    {order.customerName}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                    {order.customerPhone}
                  </div>
                </td>

                {/* Items preview thumb */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 shrink-0">
                      {order.itemsImages.slice(0, 2).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="item"
                          className="w-7 h-7 rounded-lg object-cover border border-white shadow-2xs"
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-600 font-semibold">
                      {order.itemsCount} items
                    </span>
                  </div>
                </td>

                {/* Amount */}
                <td className="py-3.5 px-3 font-black text-stone-900">
                  ৳ {order.amount.toLocaleString('en-IN')}
                </td>

                {/* Payment */}
                <td className="py-3.5 px-3">
                  {renderPaymentBadge(order.paymentMethod)}
                </td>

                {/* Status */}
                <td className="py-3.5 px-3">
                  {renderStatusBadge(order.status)}
                </td>

                {/* Date */}
                <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                  {order.date}
                </td>

                {/* Action button (exact from screenshot) */}
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => onViewOrderDetails?.(order)}
                    className="px-2.5 py-1 bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200/90 hover:border-emerald-300 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    {tr('বিস্তারিত', 'View')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
