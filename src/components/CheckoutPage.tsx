import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  ArrowLeft, 
  Check, 
  Edit3,
  CreditCard,
  ShoppingBag,
  HelpCircle,
  X
} from 'lucide-react';
import { CartItem, Order, CustomerUser } from '../types';
import { formatBdt } from './BdtPrice';
import { createLiveOrder } from '../services/realtimeSync';

interface CheckoutPageProps {
  items: CartItem[];
  currentUser: CustomerUser | null;
  discountAmount: number;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
  onBackToStore: () => void;
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currentUser,
  discountAmount,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  onBackToStore,
  onOrderSuccess,
  onClearCart,
}) => {
  // Saved addresses
  const [selectedAddressType, setSelectedAddressType] = useState<'home' | 'office'>('home');

  // Customer form inputs
  const [customerName, setCustomerName] = useState(
    currentUser?.name || 'মো. ওমর ফারুক'
  );
  const [phone, setPhone] = useState(
    currentUser?.phone || '01842078717'
  );
  const [address, setAddress] = useState(
    currentUser?.address || 'বাড়ি নং ৪২, রোড নং ৭, সেক্টর ৪, উত্তরা'
  );

  // Delivery Area: Inside Dhaka (৳60) vs Outside Dhaka (৳120)
  const [deliveryArea, setDeliveryArea] = useState<'Inside City' | 'Outside City'>('Inside City');

  // Payment Methods: bKash (Online), Nagad, Card, Cash on Delivery
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Card' | 'Cash on Delivery'>('bKash');

  // Loyalty points redemption
  const maxLoyaltyPoints = currentUser?.loyaltyPoints || 240;
  const [loyaltyPointsToRedeem, setLoyaltyPointsToRedeem] = useState<number>(0);

  // Coupon code input
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Form errors
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Switch address preset
  const handleSelectAddress = (type: 'home' | 'office') => {
    setSelectedAddressType(type);
    if (type === 'home') {
      setAddress('বাড়ি নং ৪২, রোড নং ৭, সেক্টর ৪, উত্তরা');
      setDeliveryArea('Inside City');
    } else {
      setAddress('কনকর্ড টাওয়ার, লেভেল ৫, গুলশান-২, ঢাকা');
      setDeliveryArea('Inside City');
    }
  };

  // Price calculations
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const isFreeDelivery = subtotal >= 1500;
  const deliveryFee = isFreeDelivery ? 0 : (deliveryArea === 'Inside City' ? 60 : 120);
  const loyaltyDiscount = loyaltyPointsToRedeem;
  const totalDiscount = discountAmount + loyaltyDiscount;
  const finalTotal = Math.max(0, subtotal + deliveryFee - totalDiscount);
  const pointsToEarn = Math.max(1, Math.round(finalTotal / 20));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = onApplyPromo(couponInput.trim().toUpperCase());
    if (ok) {
      setCouponError(null);
      setCouponInput('');
    } else {
      setCouponError('কুপন কোডটি সঠিক নয় বা মেয়াদোত্তীর্ণ');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string; address?: string } = {};

    if (!customerName.trim()) {
      errors.name = 'দয়া করে আপনার পূর্ণ নাম লিখুন';
    }
    if (!phone.trim() || phone.length < 8) {
      errors.phone = 'সঠিক মোবাইল নম্বর প্রদান করুন';
    }
    if (!address.trim() || address.length < 6) {
      errors.address = 'সম্পূর্ণ ঠিকানা লিখুন';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const orderId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
        ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      customerName,
      phone,
      address,
      city: deliveryArea,
      paymentMethod: paymentMethod,
      items: [...items],
      subtotal,
      deliveryFee,
      discount: totalDiscount,
      total: finalTotal,
      status: 'Order Placed',
      estimatedDelivery: deliveryArea === 'Inside City' ? '২৪ ঘণ্টার মধ্যে ডেলিভারি' : '২-৩ দিনে হোম ডেলিভারি',
    };

    // Save order in real time to backend and notify all connected clients
    try {
      await createLiveOrder({
        id: `#${orderId}`,
        customerName,
        customerPhone: phone,
        customerAddress: address,
        deliveryArea,
        items,
        subtotal,
        deliveryFee,
        discount: totalDiscount,
        amount: finalTotal,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid',
        status: 'Processing',
        orderSource: 'Website',
        notes: `Loyalty Points Used: ${loyaltyPointsToRedeem}`
      });
    } catch (err) {
      console.error('Failed to save order to server:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
      onClearCart();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-stone-900 py-4 sm:py-8 px-3 sm:px-6">
      {/* Centered Large Card Container matching user's exact design */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
        {/* Header matching Screenshot: DF badge, Title, Subtitle, Close X */}
        <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#183124] text-amber-300 font-extrabold flex items-center justify-center text-sm shadow-xs border border-emerald-950/20">
              DF
            </div>
            <div>
              <h1 className="font-display font-black text-lg sm:text-xl text-stone-900 leading-tight">
                চেকআউট ও ডেলিভারি তথ্য
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                নিরাপদ ও দ্রুত হোম ডেলিভারি কনফার্মেশন
              </p>
            </div>
          </div>

          <button
            onClick={onBackToStore}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Back to store"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
          {/* Left Column: Form Details (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {/* Saved Address Selector */}
            <div className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200/60 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700">সংরক্ষিত ঠিকানা থেকে বেছে নিন:</span>
                <button
                  type="button"
                  onClick={() => handleSelectAddress(selectedAddressType === 'home' ? 'office' : 'home')}
                  className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>এডিট / পরিচালনা</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAddress('home')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedAddressType === 'home'
                      ? 'bg-[#183124] text-white shadow-xs'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Home (ঢাকা)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectAddress('office')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedAddressType === 'office'
                      ? 'bg-[#183124] text-white shadow-xs'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Office (ঢাকা)</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} id="checkout-form" className="space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  পূর্ণ নাম *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="আপনার পূর্ণ নাম লিখুন"
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-xs sm:text-sm font-medium text-stone-900 bg-white focus:outline-none focus:ring-1 ${
                      formErrors.name ? 'border-rose-400 ring-rose-200' : 'border-stone-200 focus:border-emerald-700 focus:ring-emerald-700'
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-[11px] text-rose-500 font-semibold">{formErrors.name}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  মোবাইল নম্বর *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    placeholder="০১XXXXXXXXX"
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-xs sm:text-sm font-medium text-stone-900 bg-white font-mono focus:outline-none focus:ring-1 ${
                      formErrors.phone ? 'border-rose-400 ring-rose-200' : 'border-stone-200 focus:border-emerald-700 focus:ring-emerald-700'
                    }`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-[11px] text-rose-500 font-semibold">{formErrors.phone}</p>
                )}
              </div>

              {/* Full Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  সম্পূর্ণ ঠিকানা *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (formErrors.address) setFormErrors({ ...formErrors, address: undefined });
                    }}
                    placeholder="বাসা নং, রোড নং, এলাকা..."
                    className={`w-full pl-10 pr-3.5 py-3 rounded-xl border text-xs sm:text-sm font-medium text-stone-900 bg-white resize-none focus:outline-none focus:ring-1 ${
                      formErrors.address ? 'border-rose-400 ring-rose-200' : 'border-stone-200 focus:border-emerald-700 focus:ring-emerald-700'
                    }`}
                  />
                </div>
                {formErrors.address && (
                  <p className="text-[11px] text-rose-500 font-semibold">{formErrors.address}</p>
                )}
              </div>

              {/* Delivery Area Selector (2 Cards matching Screenshot) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  ডেলিভারি এলাকা / শহর *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Inside Dhaka (৳60) */}
                  <div
                    onClick={() => setDeliveryArea('Inside City')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliveryArea === 'Inside City'
                        ? 'border-emerald-600 bg-emerald-50/40 text-stone-900 shadow-2xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs sm:text-sm">ঢাকা শহর</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">২৪ ঘণ্টায় ডেলিভারি</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 font-mono">
                      ৳৬০
                    </span>
                  </div>

                  {/* Outside Dhaka (৳120) */}
                  <div
                    onClick={() => setDeliveryArea('Outside City')}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      deliveryArea === 'Outside City'
                        ? 'border-emerald-600 bg-emerald-50/40 text-stone-900 shadow-2xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs sm:text-sm">ঢাকার বাইরে</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">২-৩ দিনে হোম ডেলিভারি</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 font-mono">
                      ৳১২০
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector (4 Options 2x2 grid matching Screenshot) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  পেমেন্ট পদ্ধতি নির্বাচন করুন *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* bKash (Pink highlight) */}
                  <div
                    onClick={() => setPaymentMethod('bKash')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'bKash'
                        ? 'border-pink-500 bg-pink-50/30'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'bKash' ? 'border-pink-600' : 'border-stone-300'
                      }`}>
                        {paymentMethod === 'bKash' && (
                          <div className="w-2 h-2 rounded-full bg-pink-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-stone-900">বিকাশ</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-pink-100 text-pink-700">
                            অনলাইন
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">ইনস্ট্যান্ট পে</p>
                      </div>
                    </div>
                  </div>

                  {/* Nagad */}
                  <div
                    onClick={() => setPaymentMethod('Nagad')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'Nagad'
                        ? 'border-orange-500 bg-orange-50/30'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'Nagad' ? 'border-orange-600' : 'border-stone-300'
                      }`}>
                        {paymentMethod === 'Nagad' && (
                          <div className="w-2 h-2 rounded-full bg-orange-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900">নগদ</span>
                        <p className="text-[11px] text-stone-500">ওয়ালেট পেমেন্ট</p>
                      </div>
                    </div>
                  </div>

                  {/* Card / Internet */}
                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'Card'
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'Card' ? 'border-emerald-600' : 'border-stone-300'
                      }`}>
                        {paymentMethod === 'Card' && (
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900">কার্ড / ইন্টারনেট</span>
                        <p className="text-[11px] text-stone-500">ভিসা / মাস্টারকার্ড</p>
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'Cash on Delivery' ? 'border-emerald-600' : 'border-stone-300'
                      }`}>
                        {paymentMethod === 'Cash on Delivery' && (
                          <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-stone-900">ক্যাশ অন ডেলিভারি</span>
                        <p className="text-[11px] text-stone-500">পণ্য পেয়ে টাকা</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loyalty Points Slider Box (exact from Screenshot) */}
              <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>লয়্যালটি পয়েন্ট রিডিম করুন</span>
                  </div>
                  <span className="font-bold text-amber-900 font-mono">
                    ব্যালেন্স: {maxLoyaltyPoints} পয়েন্ট
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max={maxLoyaltyPoints}
                    value={loyaltyPointsToRedeem}
                    onChange={(e) => setLoyaltyPointsToRedeem(Number(e.target.value))}
                    className="flex-1 accent-amber-600 cursor-pointer"
                  />
                  <span className="font-black font-mono text-xs text-amber-950 w-12 text-right">
                    -৳{loyaltyPointsToRedeem}
                  </span>
                </div>

                <p className="text-[10px] text-amber-800 font-medium">
                  * ১ পয়েন্ট = ১ টাকা সরাসরি ছাড়। প্রতি অর্ডারে নতুন পয়েন্ট অর্জিত হবে।
                </p>
              </div>

              {/* Coupon / Discount Code (exact from Screenshot) */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-stone-800">
                  কুপন বা ডিসকাউন্ট কোড
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="DESHI10 বা FREESHIP"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-mono font-medium text-stone-900 uppercase focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    প্রয়োগ করুন
                  </button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-semibold">{couponError}</p>
                )}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="font-bold">কুপন '{appliedPromo}' প্রযোজ্য হয়েছে (৳{discountAmount} ছাড়)</span>
                    <button
                      type="button"
                      onClick={onRemovePromo}
                      className="text-stone-500 hover:text-stone-800 underline font-semibold text-[11px]"
                    >
                      মুছুন
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary (5 Cols matching Screenshot) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-50/50 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <h2 className="font-display font-black text-base text-stone-900">
                অর্ডার সারাংশ
              </h2>

              {/* Cart Items List */}
              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-xs text-stone-400 py-4 text-center">কার্টে কোনো পণ্য নেই</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.product?.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80'}
                          alt={item.product?.name || 'Product'}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-stone-900 truncate">
                            {item.product?.bengaliName || item.product?.name}
                          </p>
                          <p className="text-[11px] text-stone-500 font-medium">
                            × {item.quantity} ({item.selectedWeight})
                          </p>
                        </div>
                      </div>
                      <span className="font-bold font-mono text-xs text-stone-900 shrink-0">
                        {formatBdt(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-stone-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between text-stone-600 font-medium">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono font-bold text-stone-900">{formatBdt(subtotal)}</span>
                </div>

                <div className="flex justify-between text-stone-600 font-medium">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono font-bold text-stone-900">
                    {deliveryFee === 0 ? <span className="text-emerald-700">ফ্রি</span> : formatBdt(deliveryFee)}
                  </span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>ছাড় (কুপন + পয়েন্ট):</span>
                    <span className="font-mono">-{formatBdt(totalDiscount)}</span>
                  </div>
                )}

                {/* Grand Total Highlight */}
                <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                  <span className="font-extrabold text-sm sm:text-base text-stone-900">
                    সর্বমোট প্রদেয়:
                  </span>
                  <span className="font-mono font-black text-xl sm:text-2xl text-[#e11d48]">
                    {formatBdt(finalTotal)}
                  </span>
                </div>

                {/* Loyalty Earned Callout (exact green pill from Screenshot) */}
                <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl text-emerald-800 flex items-center gap-2 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>এই অর্ডারে আপনি পাচ্ছেন {pointsToEarn} লয়্যালটি পয়েন্ট!</span>
                </div>
              </div>
            </div>

            {/* Bottom Giant CTA Button (exact from Screenshot) */}
            <div className="pt-4">
              <button
                type="submit"
                form="checkout-form"
                disabled={items.length === 0 || isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#183124] hover:bg-[#112319] disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                    <span>
                      {paymentMethod === 'Cash on Delivery'
                        ? 'অর্ডার নিশ্চিত করুন'
                        : 'পেমেন্ট গেটওয়েতে এগিয়ে যান'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
