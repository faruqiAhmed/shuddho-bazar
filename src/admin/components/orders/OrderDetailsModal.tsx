import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Truck, ShieldCheck, Phone, MapPin, Printer } from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../types';

interface OrderDetailsModalProps {
  order: AdminOrder | null;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
}) => {
  if (!order) return null;

  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);

  const handleStatusChange = (status: OrderStatus) => {
    setCurrentStatus(status);
    onUpdateStatus?.(order.id, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#15803d] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg text-amber-300">
                {order.id}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-emerald-100 mt-0.5 font-medium">
              Order Date: {order.date}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-900/60 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Customer Info Box */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>গ্রাহক বিবরণ (Customer Details)</span>
              <span className="text-emerald-700 font-bold">{order.paymentMethod}</span>
            </div>
            <div className="font-semibold text-stone-800 text-sm">
              {order.customerName}
            </div>
            <div className="flex items-center gap-1.5 text-stone-600">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>{order.customerPhone}</span>
            </div>
            {order.customerAddress && (
              <div className="flex items-start gap-1.5 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <span>{order.customerAddress}</span>
              </div>
            )}
            {order.deliveryRider && (
              <div className="flex items-center gap-1.5 text-stone-600 pt-1 border-t border-stone-200">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-emerald-800">
                  রাইডার: {order.deliveryRider}
                </span>
              </div>
            )}
          </div>

          {/* Status Changer */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              অর্ডার স্ট্যাটাস আপডেট করুন:
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    currentStatus === st
                      ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Order Items Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-stone-700 mb-2">
              অর্ডারের আইটেমসমূহ ({order.itemsCount} টি):
            </h4>
            <div className="space-y-2">
              {order.itemsDetails && order.itemsDetails.length > 0 ? (
                order.itemsDetails.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-stone-50 rounded-xl border border-stone-200/80">
                    <div>
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-[10px] text-stone-500 font-medium">
                        সাইজ: {item.weight} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-black text-stone-900">
                      ৳ {(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
                  {order.itemsCount} x খাঁটি শোধিত পণ্য (প্যাকেজ ডিল)
                </div>
              )}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between text-stone-600">
              <span className="whitespace-nowrap">সাবটোটাল</span>
              <span className="font-semibold text-stone-900 font-mono whitespace-nowrap">
                ৳ {Math.max(0, order.amount - (order.amount > 1500 ? 0 : 70)).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span className="whitespace-nowrap">হোম ডেলিভারি চার্জ</span>
              <span className="font-semibold text-stone-900 whitespace-nowrap">
                {order.amount > 1500 ? 'ফ্রি ডেলিভারি' : '৳ 70'}
              </span>
            </div>
            <div className="flex justify-between text-stone-900 font-black text-sm pt-1 border-t border-emerald-200">
              <span className="whitespace-nowrap">সর্বমোট মূল্য</span>
              <span className="text-emerald-800 text-base font-mono whitespace-nowrap">
                ৳ {order.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Print slip & Close */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>চালান প্রিন্ট (Print Slip)</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              সম্পন্ন করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
