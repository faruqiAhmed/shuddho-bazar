import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { CartItem } from '../types';
import { formatBdt } from './BdtPrice';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  discountAmount: number;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  discountAmount,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const freeShippingThreshold = 1500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (!success) {
      setPromoError('ইনভ্যালিড কুপন কোড! ট্রাই করুন SHUDDHO10');
    } else {
      setPromoError(null);
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-display font-bold text-base leading-none">আপনার শপিং কার্ট</h3>
              <p className="text-[11px] text-emerald-200 mt-1">
                {items.length} {items.length === 1 ? 'টি পণ্য' : 'টি পণ্য সংরক্ষিত'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-900/60 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-3 bg-stone-50 border-b border-stone-200">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1.5 text-stone-700">
              <Truck className="w-4 h-4 text-emerald-700" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-bold">অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন 🎉</span>
              ) : (
                <span>ফ্রি ডেলিভারির জন্য আর <strong>{formatBdt(remainingForFreeShipping)}</strong> যোগ করুন</span>
              )}
            </span>
            <span className="text-stone-500">{Math.round(shippingProgress)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Item List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <p className="font-display font-bold text-stone-800 text-base">আপনার কার্ট খালি আছে</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                আমাদের ১০০% খাঁটি সুন্দরবনের মধু, সরিষার তেল ও গাওয়া ঘি এক্সপ্লোর করুন।
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                পণ্য কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-2xl border border-stone-200/70 shadow-2xs"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                    {item.product.bengaliName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] bg-stone-200/80 text-stone-700 px-1.5 py-0.5 rounded font-semibold">
                      {item.selectedWeight}
                    </span>
                    <span className="text-xs font-bold text-emerald-800">
                      {formatBdt(item.unitPrice * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity Increment/Decrement */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 text-stone-600 hover:bg-stone-100 rounded-l-lg transition-colors cursor-pointer"
                        aria-label="Minus"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 text-stone-600 hover:bg-stone-100 rounded-r-lg transition-colors cursor-pointer"
                        aria-label="Plus"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200 space-y-3">
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-bold">{appliedPromo} কুপন যুক্ত হয়েছে (-{formatBdt(discountAmount)})</span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-stone-500 hover:text-rose-600 font-bold text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="কুপন কোড (Try SHUDDHO10)"
                    className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{promoError}</p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>পণ্যের মোট মূল্য (Subtotal)</span>
                <span className="font-semibold text-stone-900">{formatBdt(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>ডিসকাউন্ট (Promo Discount)</span>
                  <span className="font-semibold">-{formatBdt(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>হোম ডেলিভারি চার্জ</span>
                <span>
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    <span>চেকআউটে নির্ধারিত হবে</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                <span>সর্বমোট (Estimated Total)</span>
                <span className="text-emerald-800 text-base font-extrabold">
                  {formatBdt(Math.max(0, subtotal - discountAmount))}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="cart-drawer-checkout-btn"
              onClick={() => {
                onProceedToCheckout();
                onClose();
              }}
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান (Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
