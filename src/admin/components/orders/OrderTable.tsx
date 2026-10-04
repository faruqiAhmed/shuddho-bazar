import React, { useState, useEffect } from 'react';
import { Eye, Phone, MapPin, Trash2 } from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../types';
import { AdminPagination } from '../common/AdminPagination';

interface OrderTableProps {
  orders: AdminOrder[];
  selectedOrders: string[];
  onToggleSelectOrder: (orderId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onViewOrder: (order: AdminOrder) => void;
  onQuickUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder?: (orderId: string) => void;
  onCreateNewOrder?: () => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  selectedOrders,
  onToggleSelectOrder,
  onSelectAll,
  onViewOrder,
  onQuickUpdateStatus,
  onDeleteOrder,
  onCreateNewOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 if orders list or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);

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
            <th className="py-3.5 px-4 min-w-[170px] font-bold text-slate-400 uppercase tracking-widest text-[11px]">
              QUICK STATUS
            </th>
            <th className="py-3.5 px-4 min-w-[110px] text-center font-bold text-slate-400 uppercase tracking-widest text-[11px]">
              ACTIONS
            </th>
          </tr>
        </thead>

        {/* Table Body with generous cell padding */}
        <tbody className="divide-y divide-stone-100">
          {paginatedOrders.map((order) => {
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

                {/* Order ID & Date */}
                <td className="py-4 px-4 align-middle">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="font-mono font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/80 text-xs transition-colors cursor-pointer whitespace-nowrap block w-fit"
                  >
                    {order.id}
                  </button>
                  <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1.5 whitespace-nowrap">
                    <span>{order.date}</span>
                    {order.orderSource && <span>• via {order.orderSource}</span>}
                  </div>
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

                {/* Quick Status */}
                <td className="py-4 px-4 align-middle whitespace-nowrap">
                  <select
                    value={order.status}
                    onChange={(e) => onQuickUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="w-full max-w-[155px] py-1.5 px-3 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl border border-stone-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700 shadow-2xs transition-colors"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-3.5">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="অর্ডারের বিবরণ দেখুন (View Details)"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.8} />
                    </button>

                    <button
                      onClick={() => onDeleteOrder?.(order.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="অর্ডার ডিলিট করুন (Delete Order)"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <AdminPagination
        currentPage={currentPage}
        totalItems={orders.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemLabel="অর্ডার"
      />
    </div>
  );
};
