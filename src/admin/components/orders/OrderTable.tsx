import React from 'react';
import { Eye, Phone, MapPin, Truck, ChevronRight } from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderTableProps {
  orders: AdminOrder[];
  selectedOrders: string[];
  onToggleSelectOrder: (orderId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onViewOrder: (order: AdminOrder) => void;
  onQuickUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onCreateNewOrder?: () => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  selectedOrders,
  onToggleSelectOrder,
  onSelectAll,
  onViewOrder,
  onQuickUpdateStatus,
  onCreateNewOrder,
}) => {
  const isAllSelected = orders.length > 0 && selectedOrders.length === orders.length;

  const renderPaymentBadge = (method: AdminOrder['paymentMethod'], status?: AdminOrder['paymentStatus']) => {
    const isPaid = status === 'Paid';
    const statusText = status || (method === 'Cash on Delivery' ? 'COD - Unpaid' : 'Paid');
    return (
      <div className="flex flex-col items-start gap-1">
        <span className="font-bold text-stone-800 text-xs whitespace-nowrap">
          {method}
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap inline-block ${
            isPaid
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}
        >
          {statusText}
        </span>
      </div>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center bg-stone-50/50 rounded-2xl border border-dashed border-stone-300">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-2xl">
          📦
        </div>
        <h3 className="font-display font-bold text-stone-800 text-base">
          কোনো অর্ডার খুঁজে পাওয়া যায়নি
        </h3>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          বর্তমান ফিল্টারে কোনো অর্ডার নেই। ফিল্টার পরিবর্তন করুন অথবা সরাসরি নতুন অর্ডার যোগ করুন।
        </p>
        {onCreateNewOrder && (
          <button
            onClick={onCreateNewOrder}
            className="mt-4 px-4 py-2 bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            + নতুন অর্ডার তৈরি করুন
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto no-scrollbar rounded-2xl border border-stone-200/90 bg-white shadow-2xs">
      <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
        {/* Table Header with proper background & spacing */}
        <thead>
          <tr className="bg-stone-50/90 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
            <th className="py-3.5 px-4 w-12 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 border-stone-300 focus:ring-emerald-600 cursor-pointer align-middle"
              />
            </th>
            <th className="py-3.5 px-4 min-w-[130px]">Order ID</th>
            <th className="py-3.5 px-4 min-w-[210px]">Customer Details</th>
            <th className="py-3.5 px-4 min-w-[180px]">Items</th>
            <th className="py-3.5 px-4 min-w-[130px]">Amount</th>
            <th className="py-3.5 px-4 min-w-[130px]">Payment</th>
            <th className="py-3.5 px-4 min-w-[130px]">Status</th>
            <th className="py-3.5 px-4 min-w-[170px]">Date & Courier</th>
            <th className="py-3.5 px-4 min-w-[170px] text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body with generous cell padding */}
        <tbody className="divide-y divide-stone-100">
          {orders.map((order) => {
            const isSelected = selectedOrders.includes(order.id);
            return (
              <tr
                key={order.id}
                className={`transition-colors group hover:bg-stone-50/80 ${
                  isSelected ? 'bg-emerald-50/60' : ''
                }`}
              >
                {/* Select Checkbox */}
                <td className="py-4 px-4 text-center align-middle">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectOrder(order.id)}
                    className="w-4 h-4 rounded text-emerald-700 border-stone-300 focus:ring-emerald-600 cursor-pointer align-middle"
                  />
                </td>

                {/* Order ID */}
                <td className="py-4 px-4 align-middle">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="font-mono font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/80 text-xs transition-colors cursor-pointer whitespace-nowrap block w-fit"
                  >
                    {order.id}
                  </button>
                  {order.orderSource && (
                    <span className="text-[10px] text-stone-400 block mt-1 font-sans whitespace-nowrap">
                      via {order.orderSource}
                    </span>
                  )}
                </td>

                {/* Customer Details */}
                <td className="py-4 px-4 align-middle">
                  <div className="font-bold text-stone-900 text-sm leading-snug whitespace-nowrap">
                    {order.customerName}
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-500 font-mono text-xs mt-0.5 whitespace-nowrap">
                    <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{order.customerPhone}</span>
                  </div>
                  {order.customerAddress && (
                    <div className="text-[11px] text-stone-400 truncate max-w-[200px] mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
                      <span className="truncate">{order.customerAddress}</span>
                    </div>
                  )}
                </td>

                {/* Items */}
                <td className="py-4 px-4 align-middle">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2 shrink-0">
                      {order.itemsImages?.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="product"
                          className="inline-block h-8 w-8 rounded-lg ring-2 ring-white object-cover bg-stone-100 shadow-2xs"
                        />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-stone-800 text-xs block whitespace-nowrap">
                        {order.itemsCount} {order.itemsCount > 1 ? 'items' : 'item'}
                      </span>
                      {order.itemsDetails && order.itemsDetails[0] && (
                        <span className="text-[11px] text-stone-400 max-w-[140px] truncate block mt-0.5">
                          {order.itemsDetails[0].bengaliName || order.itemsDetails[0].name}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Amount */}
                <td className="py-4 px-4 align-middle whitespace-nowrap">
                  <div className="font-mono font-black text-stone-900 text-sm">
                    ৳ {order.amount.toLocaleString('en-IN')}
                  </div>
                  {order.deliveryFee !== undefined && (
                    <span className="text-[10px] text-stone-500 block font-medium mt-0.5">
                      {order.deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-bold">ফ্রি ডেলিভারি</span>
                      ) : (
                        `ডেলিভারি: ৳${order.deliveryFee}`
                      )}
                    </span>
                  )}
                </td>

                {/* Payment */}
                <td className="py-4 px-4 align-middle whitespace-nowrap">
                  {renderPaymentBadge(order.paymentMethod, order.paymentStatus)}
                </td>

                {/* Status */}
                <td className="py-4 px-4 align-middle whitespace-nowrap">
                  <OrderStatusBadge status={order.status} size="sm" />
                </td>

                {/* Date & Courier */}
                <td className="py-4 px-4 align-middle whitespace-nowrap text-stone-600 text-xs">
                  <div className="font-medium text-stone-700">{order.date}</div>
                  <div className="text-[11px] text-emerald-800 font-bold mt-0.5 flex items-center gap-1">
                    <Truck className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{order.deliveryRider || order.courierName || 'In-House'}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 align-middle text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-200 cursor-pointer shadow-2xs whitespace-nowrap"
                      title="View Order Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত</span>
                    </button>

                    {/* Quick status dropdown */}
                    <select
                      value={order.status}
                      onChange={(e) => onQuickUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold border border-stone-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700 whitespace-nowrap"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
