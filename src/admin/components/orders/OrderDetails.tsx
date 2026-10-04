import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Phone, 
  MapPin, 
  Mail, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  MessageSquare, 
  Copy, 
  Check, 
  Calendar, 
  CreditCard,
  Package
} from 'lucide-react';
import { AdminOrder, OrderStatus } from '../../types';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderDetailsProps {
  order: AdminOrder;
  onBack: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  order,
  onBack,
  onUpdateStatus,
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^\d+]/g, '');
  };

  const handlePrint = () => {
    window.print();
  };

  // Pipeline steps
  const steps: { key: OrderStatus; label: string; bengali: string }[] = [
    { key: 'Pending', label: 'Order Placed', bengali: 'অর্ডার গ্রহণ' },
    { key: 'Confirmed', label: 'Confirmed', bengali: 'নিশ্চিতকৃত' },
    { key: 'Processing', label: 'Packaging', bengali: 'প্যাকেজিং' },
    { key: 'Shipped', label: 'In Transit', bengali: 'শিপ্ড' },
    { key: 'Delivered', label: 'Delivered', bengali: 'ডেলিভার্ড' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 2;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  // Subtotal & delivery fee calculations
  const items = order.itemsDetails && order.itemsDetails.length > 0
    ? order.itemsDetails
    : [
        {
          name: 'সুন্দরবনের খাঁটি খলিশা মধু ও ঘানির তেল প্যাকেজ',
          bengaliName: 'সুন্দরবনের খাঁটি খলিশা মধু ও ঘানির তেল প্যাকেজ',
          quantity: order.itemsCount || 1,
          price: Math.round(order.amount / (order.itemsCount || 1)),
          weight: '1kg',
        }
      ];

  const subtotal = order.subtotal ?? items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const deliveryFee = order.deliveryFee ?? (order.amount > 1500 ? 0 : 70);
  const discount = order.discount ?? 0;
  const netTotal = order.amount;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-800 transition-colors mb-2.5 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>অর্ডার তালিকায় ফিরুন (Back to Orders)</span>
          </button>
          
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-black text-2xl text-stone-900 tracking-tight flex items-center gap-2">
              <span className="font-mono text-emerald-900 whitespace-nowrap">{order.id}</span>
            </h1>
            <OrderStatusBadge status={order.status} size="md" showBengali={true} />
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 whitespace-nowrap">
              {order.orderSource || 'Website Order'}
            </span>
          </div>
          
          <p className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span>অর্ডারের সময়: {order.date}</span>
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={`tel:${getCleanPhone(order.customerPhone)}`}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>সরাসরি কল (Call)</span>
          </a>

          <a
            href={`https://wa.me/${getCleanPhone(order.customerPhone).replace('+', '')}?text=${encodeURIComponent(
              `আসসালামু আলাইকুম ${order.customerName}। শুদ্ধ বাজার থেকে আপনার অর্ডার ${order.id} সম্পর্কিত তথ্য:`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs border border-[#25D366]/30 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>হোয়াটসঅ্যাপ (WhatsApp)</span>
          </a>

          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>চালান প্রিন্ট (Print Invoice)</span>
          </button>
        </div>
      </div>

      {/* Order Status Pipeline Tracker */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-sm text-stone-900">
              অর্ডার স্ট্যাটাস পাইপলাইন (Order Fulfillment Timeline)
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              বর্তমান স্ট্যাটাস দ্রুত পরিবর্তন করতে নিচের বাটনে ক্লিক করুন
            </p>
          </div>

          {/* Quick status button toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => onUpdateStatus(order.id, st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  order.status === st
                    ? 'bg-[#15803d] text-white shadow-2xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Progress Bar */}
        {order.status !== 'Cancelled' ? (
          <div className="pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
              {steps.map((st, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={st.key}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-500 shadow-2xs ring-1 ring-emerald-500'
                        : isCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        : 'bg-stone-50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-stone-300" />
                      )}
                    </div>
                    <span className="block font-bold text-xs whitespace-nowrap">{st.label}</span>
                    <span className="block text-[11px] opacity-80 whitespace-nowrap mt-0.5">{st.bengali}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 flex items-center gap-3 text-rose-800">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-xs whitespace-nowrap">এই অর্ডারটি বাতিল করা হয়েছে (Cancelled Order)</h4>
              <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                গ্রাহক অথবা অ্যাডমিন কর্তৃক অর্ডারটি বাতিল চিহ্নিত হয়েছে। পণ্য স্টকে ফেরত পাঠানো হয়েছে।
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Line Items & Financials (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Ordered Products Table */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  অর্ডারকৃত পণ্যের তালিকা (Ordered Products)
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  মোট {items.reduce((acc, i) => acc + i.quantity, 0)} টি পণ্য
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg whitespace-nowrap">
                {items.length} {items.length > 1 ? 'items' : 'item'}
              </span>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-stone-200/90 text-stone-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="pb-3">পণ্য (Product)</th>
                    <th className="pb-3 text-center">সাইজ / ওজন</th>
                    <th className="pb-3 text-right">একক মূল্য</th>
                    <th className="pb-3 text-center">পরিমাণ</th>
                    <th className="pb-3 text-right">মোট (Line Total)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.image ||
                              order.itemsImages[idx] ||
                              'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80'
                            }
                            alt={item.name}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-200 bg-stone-50 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-stone-900 text-xs sm:text-sm leading-snug whitespace-nowrap">
                              {item.bengaliName || item.name}
                            </div>
                            <div className="text-[11px] text-stone-400 mt-0.5 whitespace-nowrap">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-stone-100 text-stone-700 whitespace-nowrap">
                          {item.weight || '1kg'}
                        </span>
                      </td>

                      <td className="py-3.5 text-right font-mono font-semibold text-stone-700 whitespace-nowrap">
                        ৳ {item.price.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 text-center font-bold text-stone-900 font-mono whitespace-nowrap">
                        {item.quantity}
                      </td>

                      <td className="py-3.5 text-right font-mono font-black text-stone-900 text-sm whitespace-nowrap">
                        ৳ {(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row justify-between gap-4">
              <div className="text-xs text-stone-500 space-y-1 sm:max-w-xs">
                <span className="font-bold text-stone-700 block">শুদ্ধ বাজার বিশুদ্ধতার নিশ্চয়তা:</span>
                <p className="text-[11px] leading-relaxed">
                  সকল পণ্য বিএসটিআই ও ফুড ল্যাব প্রত্যয়িত। কোনো কৃত্রিম রং, প্রিজারভেটিভ বা ভেজাল নেই।
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span className="whitespace-nowrap">পণ্য সাব-টোটাল:</span>
                  <span className="font-mono font-bold text-stone-900 whitespace-nowrap">
                    ৳ {subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span className="whitespace-nowrap">ডেলিভারি চার্জ:</span>
                  <span className="font-mono font-bold text-stone-900 whitespace-nowrap">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">ফ্রি ডেলিভারি</span>
                    ) : (
                      `৳ ${deliveryFee}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span className="whitespace-nowrap">বিশেষ ছাড় / ডিসকাউন্ট:</span>
                    <span className="font-mono whitespace-nowrap">-৳ {discount}</span>
                  </div>
                )}

                <div className="pt-2 border-t-2 border-stone-200 flex justify-between items-baseline font-black text-stone-900 text-sm sm:text-base">
                  <span className="whitespace-nowrap">সর্বমোট বিল (Net Total):</span>
                  <span className="font-display text-lg text-emerald-800 whitespace-nowrap">
                    ৳ {netTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Delivery Notes Card if any */}
          {order.notes && (
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-900 flex items-center gap-1.5 whitespace-nowrap">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>গ্রাহকের বিশেষ নির্দেশনা (Customer Note):</span>
              </div>
              <p className="text-amber-800 text-xs pl-5 font-medium leading-relaxed">
                "{order.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Customer Info, Delivery, & Payment Cards (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="font-display font-bold text-sm text-stone-900">
                গ্রাহক বিবরণ (Customer)
              </h3>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-bold whitespace-nowrap">
                {order.orderSource || 'Regular'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="font-extrabold text-stone-900 text-sm leading-snug">
                {order.customerName}
              </div>

              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="font-mono font-bold">{order.customerPhone}</span>
                </div>
                <button
                  onClick={() => handleCopy(order.customerPhone, 'phone')}
                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                  title="Copy Phone"
                >
                  {copiedText === 'phone' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {order.customerEmail && (
                <div className="flex items-center gap-2 text-stone-600 whitespace-nowrap">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{order.customerEmail}</span>
                </div>
              )}

              {order.customerAddress && (
                <div className="flex items-start gap-2 text-stone-700 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{order.customerAddress}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Dispatch Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-1.5 whitespace-nowrap">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>ডেলিভারি ও ট্র্যাকিং</span>
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded whitespace-nowrap">
                {order.deliveryArea || 'Inside City'}
              </span>
            </div>

            <div className="space-y-2.5 text-stone-600">
              <div className="flex justify-between items-center">
                <span className="whitespace-nowrap">কুরিয়ার পার্টনার:</span>
                <span className="font-bold text-stone-900 whitespace-nowrap">
                  {order.courierName || 'In-House Express'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="whitespace-nowrap">কনসাইনমেন্ট ট্র্যাকিং:</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono font-bold text-emerald-800 whitespace-nowrap">
                    {order.trackingNumber || `TRK-${order.id.replace('#SB-', '')}99`}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        order.trackingNumber || `TRK-${order.id.replace('#SB-', '')}99`,
                        'tracking'
                      )
                    }
                    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {copiedText === 'tracking' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="whitespace-nowrap">নির্ধারিত রাইডার:</span>
                <span className="font-bold text-stone-900 whitespace-nowrap">
                  {order.deliveryRider || 'Karim Ahmed (Rider #08)'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="font-display font-bold text-sm text-stone-900 flex items-center gap-1.5 whitespace-nowrap">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>পেমেন্ট তথ্য (Payment)</span>
              </h3>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase whitespace-nowrap ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.paymentStatus || (order.paymentMethod === 'Cash on Delivery' ? 'COD - Unpaid' : 'Paid')}
              </span>
            </div>

            <div className="space-y-2 text-stone-600">
              <div className="flex justify-between items-center">
                <span className="whitespace-nowrap">পেমেন্ট পদ্ধতি:</span>
                <span className="font-bold text-stone-900 whitespace-nowrap">
                  {order.paymentMethod}
                </span>
              </div>

              {order.transactionId && (
                <div className="flex justify-between items-center">
                  <span className="whitespace-nowrap">TrxID:</span>
                  <span className="font-mono font-bold text-stone-900 whitespace-nowrap">
                    {order.transactionId}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-stone-100 font-bold text-stone-900">
                <span className="whitespace-nowrap">পরিশোধযোগ্য বিল:</span>
                <span className="font-mono text-emerald-800 text-sm whitespace-nowrap">
                  ৳ {netTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs print:hidden"
            onClick={() => setIsInvoiceModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-150 my-auto print:shadow-none print:m-0 print:w-full print:rounded-none">
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6 print:hidden">
              <span className="font-display font-extrabold text-base text-stone-900">
                অফিসিয়াল চালান ও প্যাকিং স্লিপ প্রিভিউ (Invoice Preview)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>এখনই প্রিন্ট করুন (Print Now)</span>
                </button>
                <button
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>

            {/* Printable Invoice Document */}
            <div className="border border-stone-300 rounded-2xl p-6 sm:p-8 space-y-6 text-stone-800 font-sans print:border-none print:p-0">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b-2 border-stone-800 pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-display font-black text-xl">
                      শু
                    </span>
                    <div>
                      <h2 className="font-display font-black text-2xl text-stone-900 tracking-tight">
                        শুদ্ধ বাজার
                      </h2>
                      <span className="text-[10px] text-emerald-800 tracking-widest font-black uppercase block">
                        Shuddho Bazar • Pure & Natural
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 mt-2 max-w-xs leading-relaxed">
                    হাউজ ১২, রোড ০৪, ধানমন্ডি, ঢাকা-১২০৫<br />
                    হটলাইন: +880 1700-112233 | support@shuddhobazar.com
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-stone-900 text-white text-xs font-black uppercase px-3 py-1 rounded-md mb-2 whitespace-nowrap">
                    ইনভয়েস / চালান
                  </div>
                  <div className="font-mono font-black text-stone-900 text-base whitespace-nowrap">
                    {order.id}
                  </div>
                  <div className="text-xs text-stone-500 mt-1 whitespace-nowrap">
                    তারিখ: {order.date}
                  </div>
                  <div className="text-xs font-bold text-emerald-800 mt-0.5 whitespace-nowrap">
                    পেমেন্ট: {order.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Bill To & Ship To */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-black text-stone-900 uppercase text-[10px] tracking-wider block mb-1 whitespace-nowrap">
                    গ্রাহকের বিবরণ (Customer Info):
                  </span>
                  <div className="font-bold text-stone-900 text-sm">
                    {order.customerName}
                  </div>
                  <div className="font-mono text-stone-700 mt-0.5">
                    {order.customerPhone}
                  </div>
                  {order.customerAddress && (
                    <div className="text-stone-600 mt-1 leading-relaxed">
                      {order.customerAddress}
                    </div>
                  )}
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-black text-stone-900 uppercase text-[10px] tracking-wider block mb-1 whitespace-nowrap">
                    ডেলিভারি বিবরণ (Shipment):
                  </span>
                  <div className="whitespace-nowrap">কুরিয়ার: <strong className="text-stone-900">{order.courierName || 'In-House Express'}</strong></div>
                  <div className="whitespace-nowrap">ট্র্যাকিং: <strong className="text-stone-900 font-mono">{order.trackingNumber || `TRK-${order.id.replace('#SB-', '')}99`}</strong></div>
                  <div className="whitespace-nowrap">রাইডার: <strong className="text-stone-900">{order.deliveryRider || 'Karim Ahmed'}</strong></div>
                  <div className="whitespace-nowrap">অঞ্চল: <strong className="text-stone-900">{order.deliveryArea || 'Inside City'}</strong></div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b-2 border-stone-800 text-stone-900 font-black">
                    <th className="py-2">নং</th>
                    <th className="py-2">পণ্যের বিবরণ</th>
                    <th className="py-2 text-center">ওজন</th>
                    <th className="py-2 text-right">দর (৳)</th>
                    <th className="py-2 text-center">পরিমাণ</th>
                    <th className="py-2 text-right">মোট (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 font-mono text-stone-500">{idx + 1}</td>
                      <td className="py-2.5 font-bold text-stone-900">
                        {item.bengaliName || item.name}
                      </td>
                      <td className="py-2.5 text-center">{item.weight}</td>
                      <td className="py-2.5 text-right font-mono">
                        {item.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 text-center font-mono font-bold">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 text-right font-mono font-black text-stone-900">
                        {(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span className="whitespace-nowrap">সাব-টোটাল:</span>
                    <span className="font-mono font-bold whitespace-nowrap">৳ {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="whitespace-nowrap">ডেলিভারি চার্জ:</span>
                    <span className="font-mono font-bold whitespace-nowrap">
                      {deliveryFee === 0 ? 'ফ্রি' : `৳ ${deliveryFee}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-800 font-bold">
                      <span className="whitespace-nowrap">ডিসকাউন্ট:</span>
                      <span className="font-mono whitespace-nowrap">-৳ {discount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t-2 border-stone-900 flex justify-between font-black text-stone-900 text-sm">
                    <span className="whitespace-nowrap">সর্বমোট বিল:</span>
                    <span className="font-display font-black text-base text-emerald-900 whitespace-nowrap">
                      ৳ {netTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature & Note Footer */}
              <div className="pt-8 border-t border-stone-200 flex justify-between items-end text-xs text-stone-500">
                <div>
                  <p className="font-bold text-emerald-800 whitespace-nowrap">সুস্থ থাকুন | শুদ্ধ খাবার খান 🌿</p>
                  <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                    পণ্য বুঝে পেয়ে ডেলিভারি ম্যানের সামনে চেক করুন। যেকোনো প্রয়োজনে কল দিন: +880 1700-112233
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-36 border-b border-stone-400 mb-1" />
                  <span className="text-[11px] font-bold text-stone-700 whitespace-nowrap">কর্তৃপক্ষের স্বাক্ষর</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
