import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Check, 
  Star, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Layers, 
  ExternalLink,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Clock,
  Heart
} from 'lucide-react';
import { AdminProduct } from '../../types';
import { PRODUCTS } from '../../../data/mockData';
import { updateProduct } from '../../services/productService';

interface ProductDetailsProps {
  product: AdminProduct;
  onBack: () => void;
  onEdit: (product: AdminProduct) => void;
  onDelete: (id: string, name: string) => void;
  onUpdate: (updated: AdminProduct) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  onEdit,
  onDelete,
  onUpdate,
}) => {
  // Find extended mock data if available
  const extendedMock = PRODUCTS.find((p) => p.id === product.id);

  const [activeImage, setActiveImage] = useState(
    product.image || extendedMock?.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'
  );
  
  const [stockAdjustment, setStockAdjustment] = useState<string>('');
  const [isStockSaved, setIsStockSaved] = useState(false);

  const galleryImages = [
    product.image,
    ...(extendedMock?.gallery || [])
  ].filter((url, index, self) => url && self.indexOf(url) === index);

  const profit = product.price - product.costPrice;
  const marginPercent = product.price > 0 ? Math.round((profit / product.price) * 100) : 0;
  const lifetimeRevenue = product.soldCount * product.price;

  // Quick adjust stock
  const handleAdjustStock = (delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    const updated = updateProduct(product.id, { stock: newStock });
    if (updated) {
      onUpdate(updated);
      setIsStockSaved(true);
      setTimeout(() => setIsStockSaved(false), 2000);
    }
  };

  const handleCustomStockSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(stockAdjustment);
    if (!isNaN(val)) {
      const updated = updateProduct(product.id, { stock: Math.max(0, val) });
      if (updated) {
        onUpdate(updated);
        setStockAdjustment('');
        setIsStockSaved(true);
        setTimeout(() => setIsStockSaved(false), 2000);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-emerald-800 transition-colors mb-2 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>পণ্য তালিকায় ফিরুন (Back to Products)</span>
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display font-black text-xl sm:text-2xl text-stone-900 tracking-tight">
              {product.bengaliName}
            </h1>
            <span className="font-mono text-xs font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
              {product.id}
            </span>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              product.stock <= 0
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : product.stock < 10
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {product.stock <= 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
            </span>
            {product.badge && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                ★ {product.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-1 font-medium">
            {product.name} • {product.category}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onEdit(product)}
            className="px-4 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer whitespace-nowrap"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>সম্পাদনা করুন (Edit)</span>
          </button>

          <button
            onClick={() => onDelete(product.id, product.bengaliName)}
            className="p-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-stone-200"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media & Product In-Depth Info (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Product Media Card */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 aspect-video sm:aspect-4/3 max-h-[380px] border border-stone-200/70">
              <img
                src={activeImage}
                alt={product.bengaliName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg">
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-2.5 py-1 bg-emerald-800 text-white text-[11px] font-bold rounded-lg shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImage === img
                        ? 'border-emerald-700 ring-2 ring-emerald-700/20'
                        : 'border-stone-200 hover:border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Product Descriptions */}
            <div className="pt-2 border-t border-stone-100 space-y-3">
              <div>
                <h3 className="font-display font-extrabold text-base text-stone-900">
                  পণ্যের বিবরণ ও বৈশিষ্ট্য (Description & Highlights)
                </h3>
                <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {extendedMock?.fullDescription || product.subtitle || 'শুদ্ধ বাজারের সকল পণ্য শতভাগ প্রাকৃতিক, কেমিক্যালমুক্ত এবং সরাসরি বিশ্বস্ত দেশীয় কৃষকদের থেকে সংগৃহীত।'}
                </p>
              </div>

              {/* Provenance / Origin badge */}
              {extendedMock?.origin && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-2.5 text-xs text-stone-700">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 block">উৎস ও সংগ্রহ এলাকা (Origin):</span>
                    <span>{extendedMock.origin}</span>
                  </div>
                </div>
              )}

              {/* Purity Guarantee Checklist */}
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
                <span className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>শুদ্ধ বাজার বিশুদ্ধতা প্রতিশ্রুতি (Purity Guarantee):</span>
                </span>
                <ul className="text-xs text-emerald-800 space-y-1 pl-6 list-disc">
                  {extendedMock?.purityPoints ? (
                    extendedMock.purityPoints.map((pt, i) => <li key={i}>{pt}</li>)
                  ) : (
                    <>
                      <li>কোনো কৃত্রিম সুগন্ধি, প্রিজারভেটিভ বা ভেজাল নেই</li>
                      <li>বিএসটিআই ও সরকারি খাদ্য নিরাপত্তা মানসম্পন্ন ল্যাব টেস্ট সনদপ্রাপ্ত</li>
                      <li>স্বচ্ছ কাঁচের বয়ামে স্বাস্থ্যসম্মত আধুনিক প্যাকিং</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Pack Variants / Weight Options Table */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
            <h3 className="font-display font-extrabold text-base text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>প্যাকেজিং সাইজ ও ভ্যারিয়েন্ট (Available Sizes)</span>
            </h3>

            <div className="overflow-x-auto no-scrollbar rounded-xl border border-stone-200">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 font-bold text-[11px] uppercase border-b border-stone-200">
                    <th className="py-2.5 px-3">সাইজ / ওজন</th>
                    <th className="py-2.5 px-3">বিক্রয় মূল্য</th>
                    <th className="py-2.5 px-3">পূর্বের মূল্য</th>
                    <th className="py-2.5 px-3">ছাড়</th>
                    <th className="py-2.5 px-3 text-right">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(product.weightOptions && product.weightOptions.length > 0 ? product.weightOptions : [{ weight: product.unit, price: product.price, originalPrice: product.originalPrice }]).map((opt, i) => {
                    const discount = opt.originalPrice && opt.originalPrice > opt.price
                      ? Math.round(((opt.originalPrice - opt.price) / opt.originalPrice) * 100)
                      : 0;
                    return (
                      <tr key={i} className="hover:bg-stone-50/60">
                        <td className="py-2.5 px-3 font-bold text-stone-900">{opt.weight}</td>
                        <td className="py-2.5 px-3 font-mono font-black text-emerald-800">৳ {opt.price.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 font-mono text-stone-400 line-through">
                          {opt.originalPrice ? `৳ ${opt.originalPrice.toLocaleString('en-IN')}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-700">{discount > 0 ? `${discount}% Off` : '-'}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                            Available
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Commercial Metrics & Inventory Management (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Pricing & Financials */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            <h3 className="font-display font-extrabold text-sm text-stone-900 border-b border-stone-100 pb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>মূল্য ও মুনাফা বিবরণী (Pricing)</span>
              </span>
              <span className="font-mono text-xs font-bold text-emerald-800">
                {product.unit}
              </span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">বিক্রয় মূল্য (Price)</span>
                <span className="font-display font-black text-lg text-stone-900 mt-0.5 block font-mono">
                  ৳ {product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-[10px] text-stone-400 line-through block mt-0.5">
                    মূল দর: ৳ {product.originalPrice}
                  </span>
                )}
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">উৎপাদন / ক্রয় খরচ</span>
                <span className="font-display font-black text-lg text-stone-900 mt-0.5 block font-mono">
                  ৳ {product.costPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  প্রতি এককে খরচ
                </span>
              </div>
            </div>

            {/* Profit margin card */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-emerald-700 font-semibold block uppercase">গ্রস প্রফিট মার্জিন</span>
                <span className="font-display font-black text-base text-emerald-900 mt-0.5 block font-mono">
                  ৳ {profit.toLocaleString('en-IN')} ({marginPercent}%)
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            {/* Sales performance */}
            <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block">মোট বিক্রয় সংখ্যা:</span>
                <span className="font-bold text-stone-900">{product.soldCount} বার অর্ডার হয়েছে</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">মোট অর্জিত আয়:</span>
                <span className="font-mono font-bold text-emerald-800">৳ {lifetimeRevenue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Inventory Stock Controller */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
              <h3 className="font-display font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-700" />
                <span>মজুত ইনভেন্টরি নিয়ন্ত্রণ (Stock)</span>
              </h3>
              {isStockSaved && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded animate-pulse">
                  ✓ সংরক্ষিত
                </span>
              )}
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-stone-500">বর্তমান অবশিষ্ট স্টক:</span>
                <span className="font-display font-black text-2xl text-stone-900 font-mono">
                  {product.stock} <span className="text-xs font-normal text-stone-500">{product.unit}</span>
                </span>
              </div>

              {/* Visual Stock Bar */}
              <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    product.stock < 10 ? 'bg-rose-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, (product.stock / 60) * 100)}%` }}
                />
              </div>
            </div>

            {/* Quick stock +/- increment buttons */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-stone-600 block mb-1.5">
                দ্রুত স্টক সমন্বয় করুন:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAdjustStock(5)}
                  className="py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustStock(10)}
                  className="py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                >
                  +10
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustStock(25)}
                  className="py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                >
                  +25
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustStock(-1)}
                  className="py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-all cursor-pointer text-center"
                >
                  -1
                </button>
              </div>
            </div>

            {/* Direct stock count input */}
            <form onSubmit={handleCustomStockSave} className="flex items-center gap-1.5 pt-1">
              <input
                type="number"
                value={stockAdjustment}
                onChange={(e) => setStockAdjustment(e.target.value)}
                placeholder="নতুন স্টক সংখ্যা..."
                className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                আপডেট
              </button>
            </form>
          </div>

          {/* Card 3: Ratings & Customer Feedback */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
            <h3 className="font-display font-extrabold text-sm text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>গ্রাহক রেটিং ও রিভিউ (Customer Feedback)</span>
            </h3>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-2xl text-stone-900">
                  {extendedMock?.rating || 4.9}
                </span>
                <div>
                  <div className="flex text-amber-400">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="text-sm">{s}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {extendedMock?.reviewCount || 240} জন সম্মানিত ক্রেতার রিভিউ
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200">
                98% Positive
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
