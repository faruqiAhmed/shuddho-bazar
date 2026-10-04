import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  X,
  Package,
  FileText
} from 'lucide-react';
import { AdminOrder, OrderPaymentMethod, OrderStatus, AdminOrderItem } from '../../types';
import { PRODUCTS } from '../../../data/mockData';
import { createOrder } from '../../services/orderService';

interface CreateOrderPageProps {
  onBack: () => void;
  onOrderCreated: (order: AdminOrder, printNow?: boolean) => void;
}

export const CreateOrderPage: React.FC<CreateOrderPageProps> = ({
  onBack,
  onOrderCreated,
}) => {
  // Customer details state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'Inside City' | 'Outside City' | 'Sub-Dhaka'>('Inside City');
  const [orderSource, setOrderSource] = useState<'Phone Call' | 'WhatsApp' | 'Facebook' | 'Website' | 'Manual Admin'>('Phone Call');
  const [notes, setNotes] = useState('');

  // Items in the current order
  const [selectedItems, setSelectedItems] = useState<AdminOrderItem[]>([
    {
      id: 'item_1',
      productId: PRODUCTS[0].id,
      name: PRODUCTS[0].name,
      bengaliName: PRODUCTS[0].bengaliName,
      image: PRODUCTS[0].image,
      quantity: 1,
      price: PRODUCTS[0].weightOptions[0]?.price || PRODUCTS[0].price,
      weight: PRODUCTS[0].weightOptions[0]?.weight || '1kg',
    }
  ]);

  // Pricing adjustments
  const [deliveryFee, setDeliveryFee] = useState<number>(70);
  const [isManualDeliveryFee, setIsManualDeliveryFee] = useState(false);
  const [discount, setDiscount] = useState<number>(0);
  const [promoCode, setPromoCode] = useState<string>('');

  // Payment & status
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>('Cash on Delivery');
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Unpaid' | 'Partial'>('Unpaid');
  const [transactionId, setTransactionId] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('Processing');
  const [courierName, setCourierName] = useState('In-House Express');
  const [deliveryRider, setDeliveryRider] = useState('Rahim Mia (Rider #14)');

  // Product Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState('all');

  // Calculations
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Auto-adjust delivery fee when area changes if not manually overridden
  const effectiveDeliveryFee = isManualDeliveryFee 
    ? deliveryFee 
    : subtotal >= 1500 
    ? 0 
    : deliveryArea === 'Outside City' 
    ? 130 
    : deliveryArea === 'Sub-Dhaka' 
    ? 100 
    : 70;

  const totalAmount = Math.max(0, subtotal + effectiveDeliveryFee - discount);

  // Quick Demo Autofill Helper
  const handleAutofillDemo = () => {
    setCustomerName('মো. তানভীরুল ইসলাম (Md. Tanvirul Islam)');
    setCustomerPhone('+880 1712 998877');
    setCustomerEmail('tanvirul.islam@example.com');
    setCustomerAddress('House 34, Road 11, Sector 4, Uttara, Dhaka-1230');
    setDeliveryArea('Inside City');
    setOrderSource('Phone Call');
    setNotes('দয়া করে কাঁচের বয়াম সতর্কতার সাথে প্যাকিং করবেন। ডেলিভারির পূর্বে কল দিবেন।');
    setPaymentMethod('Cash on Delivery');
    setPaymentStatus('Unpaid');
    setOrderStatus('Processing');
    setCourierName('In-House Express');
    setDeliveryRider('Karim Ahmed (Rider #08)');
  };

  // Add product from catalog picker
  const handleSelectProductFromPicker = (prodId: string, weightIndex: number = 0) => {
    const product = PRODUCTS.find((p) => p.id === prodId);
    if (!product) return;

    const chosenOption = product.weightOptions[weightIndex] || {
      weight: product.unit || '1 Pack',
      price: product.price,
    };

    // Check if already in list with same weight
    const existingIndex = selectedItems.findIndex(
      (item) => item.productId === product.id && item.weight === chosenOption.weight
    );

    if (existingIndex >= 0) {
      const updated = [...selectedItems];
      updated[existingIndex].quantity += 1;
      setSelectedItems(updated);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          productId: product.id,
          name: product.name,
          bengaliName: product.bengaliName,
          image: product.image,
          quantity: 1,
          price: chosenOption.price,
          weight: chosenOption.weight,
        },
      ]);
    }

    setIsPickerOpen(false);
  };

  // Update item quantity
  const handleQuantityChange = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const updated = [...selectedItems];
    updated[index].quantity = newQty;
    setSelectedItems(updated);
  };

  // Update item weight option
  const handleWeightChange = (index: number, newWeight: string) => {
    const item = selectedItems[index];
    const originalProd = PRODUCTS.find((p) => p.id === item.productId);
    if (!originalProd) return;

    const opt = originalProd.weightOptions.find((w) => w.weight === newWeight);
    if (opt) {
      const updated = [...selectedItems];
      updated[index] = {
        ...updated[index],
        weight: opt.weight,
        price: opt.price,
      };
      setSelectedItems(updated);
    }
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    const updated = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updated);
  };

  // Apply promo
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SHUDDHO100') {
      setDiscount(100);
    } else if (promoCode.trim().toUpperCase() === 'PURE10') {
      setDiscount(Math.round(subtotal * 0.1));
    } else if (promoCode.trim().length > 0) {
      setDiscount(50);
    }
  };

  // Submit form
  const handleSubmit = (printNow: boolean = false) => {
    if (!customerName.trim()) {
      alert('অনুগ্রহ করে গ্রাহকের নাম প্রদান করুন (Please enter customer name)');
      return;
    }
    if (!customerPhone.trim()) {
      alert('অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন (Please enter customer phone)');
      return;
    }
    if (selectedItems.length === 0) {
      alert('কমপক্ষে একটি পণ্য সিলেক্ট করুন (Please add at least one product)');
      return;
    }

    const newOrderData: Partial<AdminOrder> = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || undefined,
      customerAddress: customerAddress.trim() || undefined,
      deliveryArea,
      orderSource,
      notes: notes.trim() || undefined,
      itemsCount: selectedItems.reduce((acc, i) => acc + i.quantity, 0),
      itemsImages: selectedItems.map((i) => i.image || '').filter(Boolean),
      itemsDetails: selectedItems,
      subtotal,
      deliveryFee: effectiveDeliveryFee,
      discount,
      amount: totalAmount,
      paymentMethod,
      paymentStatus: paymentStatus,
      transactionId: transactionId.trim() || undefined,
      status: orderStatus,
      courierName,
      deliveryRider,
    };

    const created = createOrder(newOrderData);
    onOrderCreated(created, printNow);
  };

  const filteredPickerProducts = PRODUCTS.filter((p) => {
    const matchesCategory = pickerCategory === 'all' || p.categoryId === pickerCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      p.bengaliName.toLowerCase().includes(pickerSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-800 transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>অর্ডার তালিকায় ফিরুন (Back to Orders)</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-black text-xl sm:text-2xl text-stone-900 tracking-tight">
              নতুন ম্যানুয়াল অর্ডার তৈরি (Add New Order)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Manual Dispatch
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            ফোন কল, হোয়াটসঅ্যাপ বা শোরুম ওয়াক-ইন গ্রাহকদের জন্য সরাসরি নতুন অর্ডার তৈরি করুন।
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>ডেমো তথ্য পূরণ (Demo Autofill)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
          >
            <Check className="w-4 h-4" />
            <span>অর্ডার সেভ করুন (Save Order)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>চালান প্রিন্ট ও সংরক্ষণ</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Customer Details */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-stone-900">
                    গ্রাহক তথ্য (Customer Information)
                  </h3>
                  <p className="text-[11px] text-stone-400">নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা</p>
                </div>
              </div>

              {/* Order Source Pill */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-[11px] text-stone-400">উৎস:</span>
                <select
                  value={orderSource}
                  onChange={(e) => setOrderSource(e.target.value as any)}
                  className="px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="Phone Call">📞 Phone Call</option>
                  <option value="WhatsApp">💬 WhatsApp</option>
                  <option value="Facebook">📘 Facebook</option>
                  <option value="Website">🌐 Website</option>
                  <option value="Manual Admin">🏪 Retail / Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  গ্রাহকের পূর্ণ নাম <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: মো. কামরুল হাসান"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-medium"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700 font-mono font-bold"
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  ইমেইল অ্যাড্রেস (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@gmail.com"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  ডেলিভারি অঞ্চল (Delivery Zone)
                </label>
                <select
                  value={deliveryArea}
                  onChange={(e) => {
                    const area = e.target.value as any;
                    setDeliveryArea(area);
                    if (!isManualDeliveryFee) {
                      setDeliveryFee(subtotal >= 1500 ? 0 : area === 'Outside City' ? 130 : area === 'Sub-Dhaka' ? 100 : 70);
                    }
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="Inside City">ঢাকা সিটির ভিতরে (Inside City - ৳70)</option>
                  <option value="Sub-Dhaka">উপশহর / সাভার / গাজীপুর (Sub-Dhaka - ৳100)</option>
                  <option value="Outside City">ঢাকা সিটির বাহিরে (Outside City - ৳130)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  বিস্তারিত ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, এলাকা/মহল্লা, থানা ও জেলা..."
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700 resize-none font-medium"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  বিশেষ ডেলিভারি নোট বা নির্দেশনা (Optional Note)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: ৩টার পরে ডেলিভারি দিন অথবা দারোয়ানের কাছে রাখুন"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Ordered Items / Product Selection */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-stone-900">
                    পণ্যসমূহ ও প্যাকেজ (Ordered Products & Sizes)
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    মোট {selectedItems.length} টি পণ্য অন্তর্ভুক্ত আছে
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>পণ্য যোগ করুন (Add Product)</span>
              </button>
            </div>

            {/* Selected items table */}
            <div className="divide-y divide-stone-100">
              {selectedItems.map((item, idx) => {
                const originalProd = PRODUCTS.find((p) => p.id === item.productId);
                return (
                  <div key={item.id || idx} className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate max-w-[260px]">
                          {item.bengaliName || item.name}
                        </h4>
                        <p className="text-[11px] text-stone-400 truncate max-w-[260px]">
                          {item.name}
                        </p>
                        
                        {/* Weight selector */}
                        {originalProd && originalProd.weightOptions.length > 1 ? (
                          <div className="mt-1 flex items-center gap-1 text-[11px]">
                            <span className="text-stone-400">সাইজ:</span>
                            <select
                              value={item.weight}
                              onChange={(e) => handleWeightChange(idx, e.target.value)}
                              className="px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded font-semibold text-stone-700 text-[11px] cursor-pointer"
                            >
                              {originalProd.weightOptions.map((opt) => (
                                <option key={opt.weight} value={opt.weight}>
                                  {opt.weight} (৳ {opt.price})
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="inline-block mt-0.5 text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-bold">
                            {item.weight}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price, Quantity, Line Total, Remove */}
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-[11px] text-stone-400">দর (Unit)</div>
                        <div className="font-bold text-stone-800 text-xs">
                          ৳ {item.price.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs font-mono font-bold text-stone-900 bg-white min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200 font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <div className="text-[10px] text-stone-400 uppercase font-semibold">মোট</div>
                        <div className="font-black text-emerald-800 text-sm">
                          ৳ {(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {selectedItems.length === 0 && (
                <div className="py-8 text-center text-stone-400 text-xs">
                  কোনো পণ্য যোগ করা হয়নি। উপরে "পণ্য যোগ করুন" বাটনে ক্লিক করে পণ্য নির্বাচন করুন।
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Shipping & Courier Assignment */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-stone-900">
                  ডেলিভারি কুরিয়ার ও রাইডার (Courier & Rider Dispatch)
                </h3>
                <p className="text-[11px] text-stone-400">ডেলিভারি পার্টনার ও দায়িত্বশীল রাইডার নির্বাচন</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  কুরিয়ার সার্ভিস
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="In-House Express">In-House Express (নিজস্ব রাইডার - ঢাকা)</option>
                  <option value="Steadfast Courier">Steadfast Courier (সমগ্র বাংলাদেশ)</option>
                  <option value="Pathao Courier">Pathao Courier (ইন্টারসিটি ও এক্সপ্রেস)</option>
                  <option value="RedX Logistics">RedX Logistics</option>
                  <option value="Paperfly">Paperfly</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  নির্ধারিত রাইডার / কন্ট্যাক্ট
                </label>
                <input
                  type="text"
                  value={deliveryRider}
                  onChange={(e) => setDeliveryRider(e.target.value)}
                  placeholder="যেমন: Rahim Mia (Rider #14) - 01711..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Financials (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Summary Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-5">
            <h3 className="font-display font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>অর্ডার সারসংক্ষেপ</span>
              <span className="font-mono text-xs font-bold text-emerald-800">
                #SB-AUTO
              </span>
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex justify-between items-center">
                <span>পণ্য সাব-টোটাল ({selectedItems.reduce((a, b) => a + b.quantity, 0)} items):</span>
                <span className="font-bold text-stone-900 font-mono text-sm">
                  ৳ {subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Delivery Fee Input with Manual Override */}
              <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                <div>
                  <span className="block font-medium">ডেলিভারি চার্জ:</span>
                  <span className="text-[10px] text-stone-400">
                    {subtotal >= 1500 ? '৳1500+ ফ্রি ডেলিভারি' : deliveryArea}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-stone-800">৳</span>
                  <input
                    type="number"
                    value={effectiveDeliveryFee}
                    onChange={(e) => {
                      setIsManualDeliveryFee(true);
                      setDeliveryFee(Number(e.target.value) || 0);
                    }}
                    className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded font-mono font-bold text-xs text-right text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Discount / Coupon */}
              <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                <div>
                  <span className="block font-medium text-emerald-700 font-bold">ছাড় / ডিসকাউন্ট:</span>
                  <span className="text-[10px] text-stone-400">কুপন বা বিশেষ ছাড়</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-emerald-700">-৳</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded font-mono font-bold text-xs text-right text-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Coupon Quick Apply */}
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="text"
                  placeholder="কুপন কোড (যেমন: PURE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold cursor-pointer"
                >
                  প্রয়োগ
                </button>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t-2 border-stone-200 flex justify-between items-baseline">
                <span className="font-black text-stone-900 text-sm sm:text-base">
                  সর্বমোট বিল (Net Total):
                </span>
                <span className="font-display font-black text-xl text-[#15803d]">
                  ৳ {totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Payment & Order Status Card Details */}
            <div className="pt-4 border-t border-stone-100 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  পেমেন্ট পদ্ধতি (Payment Method)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Cash on Delivery', 'bKash', 'Nagad', 'Card'] as OrderPaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method);
                        if (method === 'Cash on Delivery') {
                          setPaymentStatus('Unpaid');
                        } else {
                          setPaymentStatus('Paid');
                        }
                      }}
                      className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    পেমেন্ট স্ট্যাটাস
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 cursor-pointer"
                  >
                    <option value="Unpaid">Unpaid (বাকি / ক্যাশ অন)</option>
                    <option value="Paid">Paid (পরিশোধিত)</option>
                    <option value="Partial">Partial (আংশিক)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    প্রাথমিক স্ট্যাটাস
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-800 cursor-pointer"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Transaction ID if bKash/Nagad */}
              {paymentMethod !== 'Cash on Delivery' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    ট্রানজেকশন আইডি (TrxID)
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="যেমন: BK9A23DF81"
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700 uppercase"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="w-full py-3 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>অর্ডার সম্পূর্ণ করুন (Create Order)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="w-full py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>তৈরি করুন এবং চালান প্রিন্ট করুন</span>
              </button>

              <button
                type="button"
                onClick={onBack}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
              >
                বাতিল করুন (Cancel)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsPickerOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#15803d] text-white flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-base sm:text-lg">
                  শুদ্ধ বাজার পণ্য তালিকা থেকে নির্বাচন করুন
                </h3>
                <p className="text-xs text-emerald-100">
                  অর্ডার তালিকায় যুক্ত করতে পণ্যের ওজনের উপর ক্লিক করুন
                </p>
              </div>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="p-1.5 rounded-full bg-emerald-900/50 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="পণ্যের নাম দিয়ে খুঁজুন (মধু, ঘি, তেল, চিয়া সিড)..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={pickerCategory}
                onChange={(e) => setPickerCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-700 cursor-pointer w-full sm:w-auto"
              >
                <option value="all">সকল ক্যাটাগরি</option>
                <option value="honey">খাঁটি মধু</option>
                <option value="oils">ঘানির খাঁটি তেল</option>
                <option value="ghee">গাওয়া ঘি</option>
                <option value="nuts">ড্রাই ফ্রুটস ও বাদাম</option>
                <option value="seeds">অর্গানিক বীজ</option>
              </select>
            </div>

            {/* Products List Scroll */}
            <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-stone-100">
              {filteredPickerProducts.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-xs">
                  কোনো পণ্য খুঁজে পাওয়া যায়নি
                </div>
              ) : (
                filteredPickerProducts.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                          {p.bengaliName}
                        </h4>
                        <p className="text-[11px] text-stone-400">{p.name}</p>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          {p.category}
                        </span>
                      </div>
                    </div>

                    {/* Weight Options Buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {p.weightOptions.map((opt, wIdx) => (
                        <button
                          key={opt.weight}
                          type="button"
                          onClick={() => handleSelectProductFromPicker(p.id, wIdx)}
                          className="px-2.5 py-1.5 bg-stone-50 hover:bg-emerald-700 hover:text-white border border-stone-200 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group"
                        >
                          <span className="block text-[11px] text-stone-600 group-hover:text-emerald-100">
                            {opt.weight}
                          </span>
                          <span className="block text-emerald-800 font-extrabold group-hover:text-white">
                            ৳ {opt.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
