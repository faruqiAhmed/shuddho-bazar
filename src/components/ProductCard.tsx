import React, { useState } from 'react';
import { Heart, ShoppingCart, Check } from 'lucide-react';
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
  const [selectedWeight] = useState<WeightOption>(
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
      {/* Product Image */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.bengaliName || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Discount Badge if any */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-600 text-white shadow-2xs">
              -{product.discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-2 right-2 z-10">
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
        </div>
      </div>

      {/* Product Content Details: ONLY PRODUCT NAME AND PRICE */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h3 className="font-display font-bold text-sm sm:text-base text-stone-900 line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
            {product.bengaliName || product.name}
          </h3>

          {/* Product Price */}
          <div className="mt-2.5">
            <BdtPrice 
              price={selectedWeight.price} 
              originalPrice={selectedWeight.originalPrice}
              size="lg"
            />
          </div>
        </div>

        {/* Order & Cart Actions */}
        <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center gap-2">
          <button
            id={`quick-order-btn-${product.id}`}
            onClick={handleQuickOrder}
            className="flex-1 py-2 sm:py-2.5 bg-[#183124] hover:bg-[#112319] text-white font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>অর্ডার করুন</span>
          </button>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
              isAddedRecently
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
            title="কার্টে যোগ করুন"
          >
            {isAddedRecently ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4 text-emerald-800" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
