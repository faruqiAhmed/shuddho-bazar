import React, { useState } from 'react';
import { X, Search, CheckCircle2, Truck, Package, Clock, ShieldCheck } from 'lucide-react';
import { SAMPLE_ORDERS } from '../data/mockData';
import { Order } from '../types';
import { formatBdt } from './BdtPrice';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
}) => {
  const [trackingId, setTrackingId] = useState('SB-9241');
  const [trackedResult, setTrackedResult] = useState<any>(SAMPLE_ORDERS['SB-9241']);
  const [hasSearched, setHasSearched] = useState(true);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingId.trim().toUpperCase();
    setHasSearched(true);

    // Check recent created orders first
    const matchedRecent = recentOrders.find(o => o.id.toUpperCase() === query);
    if (matchedRecent) {
      setTrackedResult({
        status: matchedRecent.status,
        date: matchedRecent.date,
        items: matchedRecent.items.map(i => `${i.product.bengaliName} (${i.quantity})`).join(', '),
        total: matchedRecent.total,
        steps: [
          { name: 'Order Confirmed', time: 'Just now', completed: true },
          { name: 'Purity Checked & Glass Packed', time: 'In progress', completed: true, current: true },
          { name: 'Handed to Fast Courier', time: 'Pending', completed: false },
          { name: 'Out for Delivery by Rider', time: 'Pending', completed: false },
          { name: 'Delivered to Doorstep', time: matchedRecent.estimatedDelivery, completed: false }
        ]
      });
      return;
    }

    if (SAMPLE_ORDERS[query]) {
      setTrackedResult(SAMPLE_ORDERS[query]);
    } else {
      setTrackedResult(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-display font-bold text-base leading-none">লাইভ অর্ডার ট্র্যাকিং</h3>
              <p className="text-[11px] text-emerald-200 mt-0.5">আপনার পার্সেলের বর্তমান অবস্থান জানুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-900/60 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Tracking Input Form */}
          <form onSubmit={handleTrack} className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">
              অর্ডার ট্র্যাকিং আইডি প্রদান করুন:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="যেমন: SB-9241"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm uppercase font-mono font-bold border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                ট্র্যাক করুন
              </button>
            </div>

            {/* Demo ID helper pills */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 pt-1">
              <span>ট্রাই করুন ডেমো আইডি:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingId('SB-9241');
                  setTrackedResult(SAMPLE_ORDERS['SB-9241']);
                }}
                className="px-2 py-0.5 bg-stone-100 hover:bg-emerald-50 rounded-md text-emerald-800 font-mono font-bold border border-stone-200 cursor-pointer"
              >
                SB-9241
              </button>
              <button
                type="button"
                onClick={() => {
                  setTrackingId('SB-8812');
                  setTrackedResult(SAMPLE_ORDERS['SB-8812']);
                }}
                className="px-2 py-0.5 bg-stone-100 hover:bg-emerald-50 rounded-md text-emerald-800 font-mono font-bold border border-stone-200 cursor-pointer"
              >
                SB-8812
              </button>
            </div>
          </form>

          {/* Result View */}
          {hasSearched && (
            trackedResult ? (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-500 block uppercase font-bold">বর্তমান স্ট্যাটাস</span>
                    <span className="text-sm font-extrabold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                      {trackedResult.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-500 block uppercase font-bold">মোট বিল</span>
                    <span className="text-sm font-black text-stone-900">{formatBdt(trackedResult.total)}</span>
                  </div>
                </div>

                <div className="text-xs text-stone-600">
                  <span className="font-bold text-stone-700">পণ্যসমূহ: </span>
                  <span>{trackedResult.items}</span>
                </div>

                {/* Vertical Progress Timeline */}
                <div className="space-y-4 pt-1">
                  {trackedResult.steps.map((step: any, idx: number) => {
                    const isLast = idx === trackedResult.steps.length - 1;
                    return (
                      <div key={idx} className="relative flex items-start gap-3">
                        {/* Connecting Line */}
                        {!isLast && (
                          <div 
                            className={`absolute left-3.5 top-6 bottom-0 w-0.5 -mb-4 ${
                              step.completed ? 'bg-emerald-600' : 'bg-stone-200'
                            }`}
                          />
                        )}

                        {/* Step Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          step.completed 
                            ? 'bg-emerald-700 text-white shadow-xs' 
                            : 'bg-stone-200 text-stone-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex justify-between items-baseline">
                            <h5 className={`text-xs font-bold ${
                              step.completed ? 'text-stone-900' : 'text-stone-400'
                            }`}>
                              {step.name}
                            </h5>
                            <span className="text-[10px] text-stone-400 font-medium">
                              {step.time}
                            </span>
                          </div>
                          {step.current && (
                            <span className="inline-block mt-0.5 text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                              বর্তমান পর্যায়
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                কোনো অর্ডার খুঁজে পাওয়া যায়নি। আইডি সঠিকভাবে চেক করুন।
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
