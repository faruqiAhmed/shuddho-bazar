import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  Phone, 
  MapPin, 
  User, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Banknote
} from 'lucide-react';
import { CartItem, Order, CustomerUser } from '../types';
import { formatBdt } from './BdtPrice';
import { createLiveOrder } from '../services/realtimeSync';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountAmount: number;
  currentUser?: CustomerUser | null;
  onOpenAuth?: () => void;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountAmount,
  currentUser,
  onOpenAuth,
  onOrderSuccess,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [cityArea, setCityArea] = useState<'Inside City' | 'Outside City'>(currentUser?.cityArea || 'Inside City');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash / Mobile Banking' | 'Credit / Debit Card'>('Cash on Delivery');
  
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; address?: string }>({});

  // Sync when user logs in or modal opens
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.cityArea) setCityArea(currentUser.cityArea);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeDelivery = subtotal >= 1500;
  const deliveryFee = isFreeDelivery ? 0 : (cityArea === 'Inside City' ? 70 : 130);
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string; address?: string } = {};

    if (!customerName.trim()) {
      errors.name = 'দয়া করে আপনার নাম লিখুন';
    }
    if (!phone.trim() || phone.length < 8) {
      errors.phone = 'সঠিক মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)';
    }
    if (!address.trim() || address.length < 8) {
      errors.address = 'বাসা/রোড/এলাকার সম্পূর্ণ ঠিকানা লিখুন';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Generate authentic order code
    const orderId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customerName,
      phone,
      address,
      city: cityArea,
      deliveryNote,
      paymentMethod,
      items: [...items],
      subtotal,
      deliveryFee,
      discount: discountAmount,
      total: finalTotal,
      status: 'Order Placed',
      estimatedDelivery: cityArea === 'Inside City' ? 'Within 24 Hours' : 'Within 48 Hours',
    };

    // Realtime sync: save to server and broadcast live to Admin & Store
    createLiveOrder({
      id: `#${orderId}`,
      customerName,
      customerPhone: phone,
      customerAddress: address,
      deliveryArea: cityArea,
      items,
      subtotal,
      deliveryFee,
      discount: discountAmount,
      amount: finalTotal,
      paymentMethod: paymentMethod === 'bKash / Mobile Banking' ? 'bKash' : paymentMethod,
      paymentStatus: paymentMethod === 'bKash / Mobile Banking' ? 'Paid' : 'Unpaid',
      status: 'Processing',
      notes: deliveryNote,
      orderSource: 'Website'
    }).catch(console.error);

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      onOrderSuccess(newOrder);
      onClearCart();
    }, 400);
  };

  const handleFinish = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={completedOrder ? handleFinish : onClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center font-bold text-amber-300">
              SB
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg leading-tight">
                {completedOrder ? 'অর্ডার সফল হয়েছে 🎉' : 'দ্রুত অর্ডার ফর্ম (Quick Checkout)'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {completedOrder ? 'Shuddho Bazar Order Receipt' : 'কোনো রেজিস্ট্রেশন ছাড়াই ১ মিনিটে অর্ডার সম্পন্ন করুন'}
              </p>
            </div>
          </div>
          <button
            onClick={completedOrder ? handleFinish : onClose}
            className="p-1.5 rounded-full bg-emerald-900/60 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {completedOrder ? (
            /* Order Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="font-display font-extrabold text-xl text-stone-900">
                  ধন্যবাদ, {completedOrder.customerName}!
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="font-bold text-stone-600">অর্ডার ট্র্যাকিং আইডি:</span>
                  <span className="font-mono font-black text-sm text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                    {completedOrder.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">গ্রাহকের ফোন:</span>
                  <span className="font-semibold text-stone-800">{completedOrder.phone}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">ডেলিভারির ঠিকানা:</span>
                  <span className="font-semibold text-stone-800 text-right max-w-[220px] truncate">{completedOrder.address}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">পেমেন্ট মেথড:</span>
                  <span className="font-semibold text-stone-800">{completedOrder.paymentMethod}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">আনুমানিক ডেলিভারি:</span>
                  <span className="font-bold text-emerald-700">{completedOrder.estimatedDelivery}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-stone-900 text-sm">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-emerald-800 font-black">{formatBdt(completedOrder.total)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-2">
                <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>আমাদের প্রতিনিধি আপনার নম্বরে কল দিয়ে অর্ডারটি নিশ্চিত করবেন এবং দ্রুত ডেলিভারির ব্যবস্থা করবেন।</span>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                কেনাকাটা চালিয়ে যান (Continue Shopping)
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Order Items Preview Pill */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                  অর্ডারের পণ্যসমূহ ({items.length} টি আইটেম):
                </div>
                <div className="space-y-1.5 max-h-28 overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-xs text-stone-700">
                      <span className="truncate max-w-[240px]">
                        {item.product.bengaliName} ({item.selectedWeight}) × {item.quantity}
                      </span>
                      <span className="font-bold text-stone-900">
                        {formatBdt(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Login / Profile Auto-fill Banner */}
              {currentUser ? (
                <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <img 
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
                      alt={currentUser.name} 
                      className="w-6 h-6 rounded-full object-cover border border-emerald-600/40 shrink-0" 
                    />
                    <div className="truncate">
                      <span className="text-emerald-950 font-bold">{currentUser.name}</span>
                      <span className="text-emerald-700 ml-1.5 font-medium text-[11px]">(+880 {currentUser.phone})</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full shrink-0">
                    লগইন আছেন ✓
                  </span>
                </div>
              ) : onOpenAuth ? (
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-950">
                  <span className="text-[11px]">আগের ঠিকানা দিয়ে দ্রুত অর্ডার করতে চান?</span>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>ওটিপিতে লগইন করুন</span>
                  </button>
                </div>
              ) : null}

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  আপনার পূর্ণ নাম (Full Name) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {formErrors.name && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  মোবাইল নম্বর (Phone Number) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    placeholder="017XXXXXXXX বা 018XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {formErrors.phone && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  সম্পূর্ণ ঠিকানা (Full Delivery Address) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (formErrors.address) setFormErrors({ ...formErrors, address: undefined });
                    }}
                    placeholder="বাড়ি নং, রোড নং, এলাকা ও থানার নাম..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
                {formErrors.address && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.address}</p>
                )}
              </div>

              {/* Delivery Area Radio */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  ডেলিভারি এরিয়া নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCityArea('Inside City')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      cityArea === 'Inside City'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>শহরের ভিতরে (Inside City)</span>
                      <span className="font-extrabold text-emerald-700">
                        {isFreeDelivery ? 'FREE' : '৳70'}
                      </span>
                    </div>
                    <span className="block text-[10px] text-stone-500 mt-0.5">২৪ ঘণ্টার মধ্যে হোম ডেলিভারি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCityArea('Outside City')}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer ${
                      cityArea === 'Outside City'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>শহরের বাইরে (Outside City)</span>
                      <span className="font-extrabold text-emerald-700">
                        {isFreeDelivery ? 'FREE' : '৳130'}
                      </span>
                    </div>
                    <span className="block text-[10px] text-stone-500 mt-0.5">৪৮ ঘণ্টার মধ্যে কুরিয়ার ডেলিভারি</span>
                  </button>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  পেমেন্ট পদ্ধতি (Payment Method):
                </label>
                <div className="space-y-1.5">
                  <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'Cash on Delivery' ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold' : 'border-stone-200 text-stone-700'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={() => setPaymentMethod('Cash on Delivery')}
                      className="text-emerald-700"
                    />
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <div className="text-xs">
                      <div>ক্যাশ অন ডেলিভারি (Cash on Delivery)</div>
                      <div className="text-[10px] text-stone-500 font-normal">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</div>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === 'bKash / Mobile Banking' ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold' : 'border-stone-200 text-stone-700'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bKash / Mobile Banking'}
                      onChange={() => setPaymentMethod('bKash / Mobile Banking')}
                      className="text-emerald-700"
                    />
                    <CreditCard className="w-4 h-4 text-rose-600" />
                    <div className="text-xs">
                      <div>বিকাশ / নগদ / রকেট (Mobile Banking)</div>
                      <div className="text-[10px] text-stone-500 font-normal">অর্ডার প্লেস করার পর পেমেন্ট লিংক দেওয়া হবে</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>সাবটোটাল:</span>
                  <span>{formatBdt(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>কুপন ডিসকাউন্ট:</span>
                    <span>-{formatBdt(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatBdt(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-black text-stone-900 text-sm pt-1.5 border-t border-stone-200">
                  <span>সর্বমোট প্রদেয় মূল্য:</span>
                  <span className="text-emerald-800 text-base font-extrabold">{formatBdt(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="checkout-confirm-order-btn"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-950" />
                    <span>অর্ডার নিশ্চিত করুন ({formatBdt(finalTotal)})</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
