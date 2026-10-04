import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Truck, 
  CreditCard, 
  DollarSign, 
  Package, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { AdminOrder, OrderStatus, OrderPaymentMethod, AdminOrderItem } from '../../types';
import { PRODUCTS } from '../../../data/mockData';

interface OrderEditModalProps {
  isOpen: boolean;
  order: AdminOrder | null;
  onClose: () => void;
  onSave: (updatedOrder: AdminOrder) => void;
}

export const OrderEditModal: React.FC<OrderEditModalProps> = ({
  isOpen,
  order,
  onClose,
  onSave,
}) => {
  if (!isOpen || !order) return null;

  // Form State
  const [customerName, setCustomerName] = useState(order.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(order.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(order.customerEmail || '');
  const [customerAddress, setCustomerAddress] = useState(order.customerAddress || '');
  const [deliveryArea, setDeliveryArea] = useState<'Inside City' | 'Outside City'>(
    (order.deliveryArea as 'Inside City' | 'Outside City') || 'Inside City'
  );

  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [deliveryRider, setDeliveryRider] = useState(order.deliveryRider || '');
  const [courierName, setCourierName] = useState(order.courierName || '');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');

  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>(
    order.paymentMethod as OrderPaymentMethod || 'Cash on Delivery'
  );
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Unpaid'>(
    order.paymentStatus || 'Unpaid'
  );
  const [transactionId, setTransactionId] = useState(order.transactionId || '');

  const [items, setItems] = useState<AdminOrderItem[]>(() => {
    if (order.itemsDetails && order.itemsDetails.length > 0) {
      return [...order.itemsDetails];
    }
    return [
      {
        id: 'item_1',
        productId: 'prod_1',
        name: 'সুন্দরবনের খলিশা মধু',
        bengaliName: 'সুন্দরবনের খলিশা মধু',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80',
        quantity: order.itemsCount || 1,
        price: Math.round(order.amount / (order.itemsCount || 1)),
        weight: '1kg',
      }
    ];
  });

  const [deliveryFee, setDeliveryFee] = useState<number>(order.deliveryFee ?? 70);
  const [discount, setDiscount] = useState<number>(order.discount ?? 0);
  const [notes, setNotes] = useState(order.notes || '');

  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state whenever order prop changes
  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName || '');
      setCustomerPhone(order.customerPhone || '');
      setCustomerEmail(order.customerEmail || '');
      setCustomerAddress(order.customerAddress || '');
      setDeliveryArea((order.deliveryArea as 'Inside City' | 'Outside City') || 'Inside City');
      setStatus(order.status);
      setDeliveryRider(order.deliveryRider || '');
      setCourierName(order.courierName || '');
      setTrackingNumber(order.trackingNumber || '');
      setPaymentMethod((order.paymentMethod as OrderPaymentMethod) || 'Cash on Delivery');
      setPaymentStatus(order.paymentStatus || 'Unpaid');
      setTransactionId(order.transactionId || '');
      setDeliveryFee(order.deliveryFee ?? 70);
      setDiscount(order.discount ?? 0);
      setNotes(order.notes || '');

      if (order.itemsDetails && order.itemsDetails.length > 0) {
        setItems([...order.itemsDetails]);
      }
    }
  }, [order]);

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal + Number(deliveryFee || 0) - Number(discount || 0));

  // Quantity helpers
  const handleUpdateQuantity = (idx: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((item, i) => {
          if (i === idx) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as AdminOrderItem[]
    );
  };

  const handleRemoveItem = (idx: number) => {
    if (items.length <= 1) {
      setErrorMsg('কমপক্ষে একটি পণ্য অর্ডারে থাকতে হবে!');
      return;
    }
    setErrorMsg(null);
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddProduct = () => {
    if (!selectedProductToAdd) return;
    const prod = PRODUCTS.find((p) => p.id === selectedProductToAdd);
    if (!prod) return;

    // Check if already in items
    const existingIdx = items.findIndex((i) => i.productId === prod.id);
    if (existingIdx >= 0) {
      handleUpdateQuantity(existingIdx, 1);
    } else {
      const newItem: AdminOrderItem = {
        id: `item_${Date.now()}`,
        productId: prod.id,
        name: prod.name,
        bengaliName: prod.bengaliName,
        image: prod.image,
        quantity: 1,
        price: prod.weightOptions?.[0]?.price || prod.price,
        weight: prod.weightOptions?.[0]?.weight || '১ কেজি',
      };
      setItems((prev) => [...prev, newItem]);
    }
    setSelectedProductToAdd('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('গ্রাহকের নাম এবং ফোন নম্বর আবশ্যক!');
      return;
    }
    if (items.length === 0) {
      setErrorMsg('কমপক্ষে একটি পণ্য যুক্ত করুন');
      return;
    }

    const updatedOrder: AdminOrder = {
      ...order,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerAddress: customerAddress.trim(),
      deliveryArea,
      status,
      deliveryRider: deliveryRider.trim(),
      courierName: courierName.trim() || 'In-House Express',
      trackingNumber: trackingNumber.trim(),
      paymentMethod,
      paymentStatus,
      transactionId: transactionId.trim(),
      itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
      itemsImages: items.map((i) => i.image).filter(Boolean) as string[],
      itemsDetails: items,
      subtotal,
      deliveryFee: Number(deliveryFee || 0),
      discount: Number(discount || 0),
      amount: grandTotal,
      notes: notes.trim(),
    };

    onSave(updatedOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Package className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg text-stone-900">
                  অর্ডার সম্পাদনা (Edit Order)
                </h2>
                <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                  {order.id}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                গ্রাহকের তথ্য, পণ্য ও মূল্য তালিকা এবং ডেলিভারি স্ট্যাটাস পরিবর্তন করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-xs">
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-display font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-900">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>গ্রাহকের তথ্য (Customer Information)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  গ্রাহকের পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  placeholder="উদাঃ মোঃ রাফি আহমেদ"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  ফোন নম্বর *
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  placeholder="+880 1XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  ডেলিভারি এরিয়া
                </label>
                <select
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value as 'Inside City' | 'Outside City')}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
                >
                  <option value="Inside City">ঢাকা সিটির ভিতরে (৳৭০)</option>
                  <option value="Outside City">ঢাকা সিটির বাইরে / সমগ্র বাংলাদেশ (৳১৩০)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-semibold mb-1">
                  সম্পূর্ণ ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  rows={2}
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  placeholder="বাড়ি, রোড নম্বর, এলাকা, থানা ও জেলা..."
                />
              </div>
            </div>
          </div>

          {/* Section 2: Order Status & Logistics */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-display font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-900">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              <span>স্ট্যাটাস ও লজিস্টিকস (Status & Delivery)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  অর্ডার স্ট্যাটাস
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-bold focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
                >
                  <option value="Processing">Processing (প্রসেসিং)</option>
                  <option value="Confirmed">Confirmed (কনফার্মড)</option>
                  <option value="Shipped">Shipped (শিপ্ড)</option>
                  <option value="Out for Delivery">Out for Delivery (ডেলিভারিতে)</option>
                  <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                  <option value="Cancelled">Cancelled (বাতিল)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  ডেলিভারি রাইডার / কুরিয়ার
                </label>
                <input
                  type="text"
                  value={deliveryRider || courierName}
                  onChange={(e) => {
                    setDeliveryRider(e.target.value);
                    setCourierName(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                  placeholder="উদাঃ Steadfast / Rahim Mia"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  কুরিয়ার ট্র্যাকিং নম্বর
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  placeholder="উদাঃ TRK-1024899"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Details */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-display font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-900">
              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
              <span>পেমেন্ট তথ্য (Payment Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  পেমেন্ট মাধ্যম
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as OrderPaymentMethod)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
                >
                  <option value="Cash on Delivery">Cash on Delivery (ক্যাশ অন ডেলিভারি)</option>
                  <option value="bKash">bKash (বিকাশ)</option>
                  <option value="Nagad">Nagad (নগদ)</option>
                  <option value="Card">Card / Online Payment</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  পেমেন্ট স্ট্যাটাস
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Unpaid')}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-bold focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
                >
                  <option value="Unpaid">Unpaid (অপরিশোধিত)</option>
                  <option value="Paid">Paid (পরিশোধিত)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  ট্রানজেকশন আইডি (bKash/Nagad)
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none font-mono"
                  placeholder="উদাঃ BK9A23DF81"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Order Items List */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-900">
                <Package className="w-3.5 h-3.5 text-emerald-700" />
                <span>অর্ডারের পণ্যসমূহ ({items.length} টি আইটেম)</span>
              </h3>
            </div>

            {/* Quick Add Product Dropdown */}
            <div className="flex items-center gap-2 pt-1 pb-2">
              <select
                value={selectedProductToAdd}
                onChange={(e) => setSelectedProductToAdd(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none cursor-pointer"
              >
                <option value="">+ ক্যাটালগ থেকে নতুন পণ্য যোগ করুন...</option>
                {PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.bengaliName} (৳{p.price})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddProduct}
                disabled={!selectedProductToAdd}
                className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>যোগ করুন</span>
              </button>
            </div>

            {/* Items Table */}
            <div className="divide-y divide-stone-200 bg-white rounded-xl border border-stone-200 overflow-hidden">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 truncate">
                        {item.bengaliName || item.name}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        ৳ {item.price.toLocaleString('en-IN')} {item.weight && `• ${item.weight}`}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="inline-flex items-center border border-stone-200 rounded-lg bg-stone-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, -1)}
                        className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-stone-900 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(idx, 1)}
                        className="p-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="font-mono font-bold text-stone-900 w-16 text-right">
                      ৳ {(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="আইটেম মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Totals, Discounts & Delivery Fee */}
          <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <h3 className="font-display font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-900">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span>মূল্য ও হিসাব (Totals & Discounts)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  পণ্য সাবটোটাল
                </label>
                <div className="px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl font-mono font-bold text-stone-800">
                  ৳ {subtotal.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  ডেলিভারি চার্জ (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-mono font-bold focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  ডিসকাউন্ট / ছাড় (৳)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 font-mono font-bold focus:ring-1 focus:ring-emerald-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-center justify-between mt-2">
              <span className="font-bold text-emerald-900 text-xs">
                সর্বমোট প্রদেয় বিল (Grand Total):
              </span>
              <span className="font-mono font-black text-lg text-emerald-900">
                ৳ {grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Section 6: Order Notes */}
          <div>
            <label className="block text-stone-600 font-semibold mb-1">
              অর্ডার নোট বা বিশেষ নির্দেশনা (Order Notes)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:ring-1 focus:ring-emerald-700 focus:outline-none text-xs"
              placeholder="কুরিয়ার বা ডেলিভারি বয়কে বিশেষ নির্দেশনা দিন..."
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            বাতিল (Cancel)
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>পরিবর্তন সংরক্ষণ করুন (Save Order Changes)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
