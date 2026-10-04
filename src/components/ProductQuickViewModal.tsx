import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Heart, 
  ShoppingCart, 
  Plus, 
  Minus,
  Sparkles,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Product, WeightOption } from '../types';
import { BdtPrice, formatBdt } from './BdtPrice';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedWeight: WeightOption, quantity: number) => void;
  onQuickOrder: (product: Product, selectedWeight: WeightOption, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onQuickOrder,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weightOptions[0] || {
      label: product.defaultWeight,
      weight: product.defaultWeight,
      price: product.price,
      originalPrice: product.originalPrice,
    }
  );
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'purity' | 'description'>('benefits');

  const handleDecrease = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrease = () => setQuantity((q) => Math.min(product.stockCount, q + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-stone-100 text-stone-700 flex items-center justify-center shadow-xs cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-xs">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-emerald-800 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.gallery.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedImage === img ? 'border-emerald-700 shadow-xs' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Sourcing Location Info */}
          <div className="mt-4 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-900">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold">উৎস: </span>
              <span>{product.origin}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="md:w-1/2 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between max-h-[70vh] md:max-h-[85vh]">
          <div>
            {/* Category & Ratings */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Bengali & English Titles */}
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-stone-900 mt-1 leading-tight">
              {product.bengaliName}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-stone-500 mt-0.5">
              {product.name}
            </p>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Weight Option Selection */}
            <div className="mt-4">
              <label className="text-xs font-bold text-stone-700 block mb-1.5">
                প্যাক সাইজ নির্বাচন করুন (Select Pack Weight):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.weightOptions.map((opt) => {
                  const isSelected = selectedWeight.weight === opt.weight;
                  return (
                    <button
                      key={opt.weight}
                      onClick={() => setSelectedWeight(opt)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                      }`}
                    >
                      <span className="block text-xs font-bold">{opt.weight}</span>
                      <span className="block text-xs text-emerald-700 font-extrabold mt-0.5">
                        {formatBdt(opt.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline justify-between gap-3 mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <BdtPrice
                price={selectedWeight.price * quantity}
                originalPrice={selectedWeight.originalPrice * quantity}
                size="2xl"
                highlightDiscount
              />
              <span className="text-xs text-emerald-800 font-bold ml-auto bg-emerald-100/70 px-2 py-0.5 rounded">
                ইন স্টক ({product.stockCount} টি এভেইলেবল)
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs font-bold text-stone-700">পরিমাণ (Quantity):</span>
              <div className="flex items-center border border-stone-200 rounded-xl bg-white shadow-2xs">
                <button
                  onClick={handleDecrease}
                  className="p-2 text-stone-600 hover:bg-stone-100 rounded-l-xl transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center font-bold text-sm text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-2 text-stone-600 hover:bg-stone-100 rounded-r-xl transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Informational Tabs: Benefits, Purity Points */}
            <div className="mt-4 pt-3 border-t border-stone-200">
              <div className="flex items-center gap-4 text-xs font-bold border-b border-stone-200 pb-1.5">
                <button
                  onClick={() => setActiveTab('benefits')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'benefits'
                      ? 'text-emerald-800 border-b-2 border-emerald-700'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  উপকারিতা (Benefits)
                </button>
                <button
                  onClick={() => setActiveTab('purity')}
                  className={`pb-1 cursor-pointer transition-colors ${
                    activeTab === 'purity'
                      ? 'text-emerald-800 border-b-2 border-emerald-700'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  খাঁটি হওয়ার নিশ্চয়তা
                </button>
              </div>

              <div className="mt-2.5 text-xs text-stone-600 space-y-1.5">
                {activeTab === 'benefits' && (
                  <ul className="space-y-1.5">
                    {product.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'purity' && (
                  <ul className="space-y-1.5">
                    {product.purityPoints.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Row: Direct Quick Order + Add to Cart + Wishlist */}
          <div className="mt-6 pt-3 border-t border-stone-200 flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'border-rose-300 bg-rose-50 text-rose-600'
                  : 'border-stone-200 hover:bg-stone-100 text-stone-600'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </button>

            {/* Quick Order 1-Click Button */}
            <button
              id="quickview-order-now-btn"
              onClick={() => {
                onQuickOrder(product, selectedWeight, quantity);
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>সরাসরি অর্ডার করুন</span>
            </button>

            {/* Add to Cart Button */}
            <button
              id="quickview-add-to-cart-btn"
              onClick={() => {
                onAddToCart(product, selectedWeight, quantity);
                onClose();
              }}
              className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-amber-300" />
              <span>কার্টে যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
