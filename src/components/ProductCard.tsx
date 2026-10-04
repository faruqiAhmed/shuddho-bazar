import React, { useState } from 'react';
import { Heart, Eye, ShoppingCart, Check, Star, ShieldCheck } from 'lucide-react';
import { Product, WeightOption } from '../types';
import { BdtPrice } from './BdtPrice';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedWeight: WeightOption) => void;
  onQuickOrder: (product: Product, selectedWeight: WeightOption) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onQuickOrder,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedWeight, setSelectedWeight] = useState<WeightOption>(
    product.weightOptions[0] || {
      label: product.defaultWeight,
      weight: product.defaultWeight,
      price: product.price,
      originalPrice: product.originalPrice,
    }
  );
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedWeight);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1200);
  };

  const handleQuickOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickOrder(product, selectedWeight);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onQuickView(product)}
      className="group relative bg-white rounded-2xl border border-stone-200/80 hover:border-emerald-600/50 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-emerald-800 text-white shadow-2xs">
              {product.badge}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-600 text-white shadow-2xs w-fit">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Top Right Actions (Wishlist & Quick View) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-600 shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-600 hover:text-rose-600 shadow-2xs'
            }`}
            title="Add to Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-stone-700 flex items-center justify-center shadow-2xs backdrop-blur-xs transition-colors cursor-pointer hidden sm:flex"
            title="Quick Details"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Origin Pill (Bottom left of photo) */}
        <div className="absolute bottom-2 left-2 bg-stone-900/70 backdrop-blur-xs text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="truncate max-w-[140px]">{product.origin}</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[10px] sm:text-[11px] font-medium text-emerald-700 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Bengali Title */}
          <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {product.bengaliName}
          </h3>

          {/* English Title */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-medium">
            {product.name}
          </p>

          {/* Weight Variant Selector Buttons */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            {product.weightOptions.map((opt) => {
              const isSelected = selectedWeight.weight === opt.weight;
              return (
                <button
                  key={opt.weight}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedWeight(opt);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {opt.weight}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pricing & Order Actions */}
        <div className="mt-3.5 pt-2.5 border-t border-stone-100">
          {/* Price with BDT Icon / Symbol */}
          <div className="flex items-baseline justify-between gap-1 mb-2.5">
            <BdtPrice 
              price={selectedWeight.price} 
              originalPrice={selectedWeight.originalPrice}
              size="lg"
            />
            <span className="text-[10px] text-emerald-700 font-medium shrink-0">
              খাঁটি নিশ্চয়তা
            </span>
          </div>

          {/* Dual Action Buttons (Ghorer Bazar Hallmark: 1-Click "Order Now" + "Add to Cart") */}
          <div className="grid grid-cols-2 gap-1.5">
            {/* Direct 1-Click Order Button */}
            <button
              id={`quick-order-btn-${product.id}`}
              onClick={handleQuickOrder}
              className="w-full py-2 sm:py-2.5 px-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-xs rounded-xl shadow-2xs transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <span>অর্ডার করুন</span>
            </button>

            {/* Add to Cart Button */}
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={handleAddToCart}
              className={`w-full py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                isAddedRecently
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>যোগ হয়েছে</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-emerald-700" />
                  <span>কার্ট</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
