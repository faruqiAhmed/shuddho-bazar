import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, WeightOption } from '../types';
import { formatBdt } from './BdtPrice';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onToggleWishlist: (product: Product) => void;
  onQuickOrder: (product: Product, selectedWeight: WeightOption) => void;
  onAddToCart: (product: Product, selectedWeight: WeightOption) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onToggleWishlist,
  onQuickOrder,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
            <div>
              <h3 className="font-display font-bold text-base leading-none">আপনার পছন্দের পণ্যসমূহ (Wishlist)</h3>
              <p className="text-[11px] text-emerald-200 mt-1">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'টি পণ্য সংরক্ষিত' : 'টি পণ্য সংরক্ষিত'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-900/60 text-white hover:bg-emerald-900 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-10 text-stone-500">
              <Heart className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <p className="font-bold text-sm text-stone-700">কোনো পছন্দের পণ্য যোগ করা হয়নি</p>
              <p className="text-xs text-stone-400 mt-1">পণ্য কার্ডের হার্ট আইকনে ক্লিক করে পছন্দের তালিকায় রাখুন।</p>
            </div>
          ) : (
            wishlistedProducts.map((p) => {
              const defaultOpt = p.weightOptions[0];
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                      {p.bengaliName}
                    </h4>
                    <p className="text-[11px] text-stone-500 truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-emerald-800">
                        {formatBdt(p.price)}
                      </span>
                      <span className="text-[10px] text-stone-400 line-through">
                        {formatBdt(p.originalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onQuickOrder(p, defaultOpt);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-black transition-colors cursor-pointer"
                    >
                      অর্ডার করুন
                    </button>
                    <button
                      onClick={() => onToggleWishlist(p)}
                      className="text-stone-400 hover:text-rose-600 p-1 flex items-center justify-center text-xs transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
