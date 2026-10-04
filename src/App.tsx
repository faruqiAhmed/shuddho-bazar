/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  MobileCategoryScroll 
} from './components/MobileCategoryScroll';
import { 
  MobileCategoryDrawer 
} from './components/MobileCategoryDrawer';
import { 
  MobileBottomNav 
} from './components/MobileBottomNav';
import { 
  HeroBanner 
} from './components/HeroBanner';
import { 
  FeaturedCategories 
} from './components/FeaturedCategories';
import { 
  FlashDeals 
} from './components/FlashDeals';
import { 
  ProductCard 
} from './components/ProductCard';
import { 
  ProductQuickViewModal 
} from './components/ProductQuickViewModal';
import { 
  CartDrawer 
} from './components/CartDrawer';
import { 
  CheckoutModal 
} from './components/CheckoutModal';
import { 
  OrderTrackingModal 
} from './components/OrderTrackingModal';
import { 
  WishlistModal 
} from './components/WishlistModal';
import { 
  AuthModal 
} from './components/AuthModal';
import { 
  UserProfilePage 
} from './components/UserProfilePage';
import { 
  PurityPromiseSection 
} from './components/PurityPromiseSection';
import { 
  TestimonialsSection 
} from './components/TestimonialsSection';
import { 
  Footer 
} from './components/Footer';
import { AdminDashboard } from './admin/AdminDashboard';

import { PRODUCTS, CATEGORIES } from './data/mockData';
import { Product, CartItem, WeightOption, Order, CustomerUser } from './types';
import { getCurrentUser, logoutUser, updateProfile } from './services/authService';
import { 
  Filter, 
  ArrowUpDown, 
  ShoppingBag, 
  MessageCircle, 
  PhoneCall, 
  Check, 
  Sparkles,
  Layers,
  Search,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // View mode: 'store' by default, or 'admin', or 'profile' (dedicated profile page)
  const [viewMode, setViewMode] = useState<'admin' | 'store' | 'profile'>('store');

  // Customer Authentication state
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedTrackOrderId, setSelectedTrackOrderId] = useState<string>('DF-10086');

  // Category & Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Cart state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shuddho_cart');
      return saved ? JSON.parse(saved) : [
        // Preload one high-converting item for instant preview richness
        {
          id: 'p1_1kg',
          product: PRODUCTS[0],
          selectedWeight: '1kg',
          unitPrice: 1250,
          originalUnitPrice: 1450,
          quantity: 1,
        }
      ];
    } catch {
      return [];
    }
  });

  // Wishlist state with localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shuddho_wishlist');
      return saved ? JSON.parse(saved) : ['p1', 'p3'];
    } catch {
      return ['p1', 'p3'];
    }
  });

  // Promo code state
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Recent placed orders
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Sync cart with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shuddho_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shuddho_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Recalculate discount if promo applied
  useEffect(() => {
    if (appliedPromo === 'SHUDDHO10') {
      const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
      setDiscountAmount(subtotal * 0.1);
    } else {
      setDiscountAmount(0);
    }
  }, [cart, appliedPromo]);

  // Wishlist toggle handler
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        showToast(`'${product.bengaliName}' পছন্দের তালিকা থেকে বাদ দেওয়া হয়েছে`);
        return prev.filter(id => id !== product.id);
      } else {
        showToast(`'${product.bengaliName}' পছন্দের তালিকায় যুক্ত হয়েছে`);
        return [...prev, product.id];
      }
    });
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, selectedWeight: WeightOption, quantity = 1) => {
    const itemKey = `${product.id}_${selectedWeight.weight}`;
    setCart((prev) => {
      const existing = prev.find(item => item.id === itemKey);
      if (existing) {
        return prev.map(item =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            product,
            selectedWeight: selectedWeight.weight,
            unitPrice: selectedWeight.price,
            originalUnitPrice: selectedWeight.originalPrice,
            quantity,
          }
        ];
      }
    });
    showToast(`'${product.bengaliName} (${selectedWeight.weight})' কার্টে যোগ হয়েছে!`);
  };

  // Direct 1-Click Quick Order (Ghorer Bazar signature flow)
  const handleQuickOrder = (product: Product, selectedWeight: WeightOption, quantity = 1) => {
    const itemKey = `${product.id}_${selectedWeight.weight}`;
    setCart((prev) => {
      const existing = prev.find(item => item.id === itemKey);
      if (existing) {
        return prev.map(item =>
          item.id === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            product,
            selectedWeight: selectedWeight.weight,
            unitPrice: selectedWeight.price,
            originalUnitPrice: selectedWeight.originalPrice,
            quantity,
          }
        ];
      }
    });
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const handleApplyPromo = (code: string): boolean => {
    if (code === 'SHUDDHO10') {
      setAppliedPromo('SHUDDHO10');
      showToast('১০% ডিসকাউন্ট সফলভাবে প্রয়োগ হয়েছে!');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountAmount(0);
    showToast('কুপন সরানো হয়েছে');
  };

  const handleOrderSuccess = (order: Order) => {
    setRecentOrders(prev => [order, ...prev]);
    if (currentUser) {
      const updatedUser = updateProfile(currentUser.id, {
        totalOrders: (currentUser.totalOrders || 0) + 1,
        loyaltyPoints: (currentUser.loyaltyPoints || 0) + Math.round(order.total / 10),
      });
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    }
  };

  const handleLoginSuccess = (user: CustomerUser) => {
    setCurrentUser(user);
    showToast(`স্বাগতম, ${user.name}!`);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    showToast('সফলভাবে লগআউট হয়েছে');
  };

  const handleTrackOrderFromProfile = (orderId: string) => {
    setSelectedTrackOrderId(orderId);
    setIsOrderTrackingOpen(true);
  };

  const handleClearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setDiscountAmount(0);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;

      // Search query
      const matchesSearch = searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bengaliName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const currentCategoryObj = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (viewMode === 'admin') {
    return <AdminDashboard onSwitchToStore={() => setViewMode('store')} />;
  }

  if (viewMode === 'profile' && currentUser) {
    return (
      <>
        <UserProfilePage
          user={currentUser}
          onBackToStore={() => setViewMode('store')}
          onOpenAdmin={() => setViewMode('admin')}
          onLogout={() => {
            handleLogout();
            setViewMode('store');
          }}
          onLiveTrack={(trackId) => {
            setSelectedTrackOrderId(trackId);
            setIsOrderTrackingOpen(true);
          }}
          onReorder={(order) => {
            showToast(`${order.id} অর্ডারের পণ্যগুলো কার্টে যোগ করা হয়েছে!`);
            setViewMode('store');
            setIsCartOpen(true);
          }}
        />
        <OrderTrackingModal
          isOpen={isOrderTrackingOpen}
          onClose={() => setIsOrderTrackingOpen(false)}
          recentOrders={recentOrders}
          initialTrackingId={selectedTrackOrderId}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c241b] flex flex-col font-sans pb-16 lg:pb-0">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setViewMode('profile')}
        onOpenMenu={() => setIsCategoryDrawerOpen(true)}
        onOpenTrackOrder={() => setIsOrderTrackingOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={PRODUCTS}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setViewMode('admin')}
      />

      {/* Mobile Horizontal Category Scroller (Explicitly designed for mobile category intuition) */}
      <MobileCategoryScroll
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => {
          setSelectedCategory(id);
        }}
      />

      {/* Hero Banner Section (Only on 'All' or when not actively searching) */}
      {selectedCategory === 'all' && searchQuery.trim() === '' && (
        <>
          <HeroBanner
            onShopNow={(catId) => {
              if (catId) setSelectedCategory(catId);
              const el = document.getElementById('product-catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onQuickOrderProduct={(p) => handleQuickOrder(p, p.weightOptions[0])}
            featuredProducts={PRODUCTS}
          />

          {/* Featured Categories (Visual Category Cards with Icons & Names Matching Reference Screenshot) */}
          <FeaturedCategories
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => {
              setSelectedCategory(id);
            }}
          />

          {/* Flash Deals / Hot Offers */}
          <FlashDeals
            products={PRODUCTS}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p, w) => handleAddToCart(p, w)}
            onQuickOrder={(p, w) => handleQuickOrder(p, w)}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        </>
      )}

      {/* Main Product Catalog Section */}
      <main id="product-catalog-section" className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 flex-1 w-full">
        {/* Category Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 sm:mb-6 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-stone-900 tracking-tight">
                {searchQuery.trim() !== '' ? `Search Results for "${searchQuery}"` : currentCategoryObj.bengaliName}
              </h2>
              <span className="text-xs sm:text-sm font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} টি পণ্য
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {searchQuery.trim() !== '' ? 'আপনার কাঙ্খিত খাঁটি পণ্যের ফলাফল' : currentCategoryObj.description}
            </p>
          </div>

          {/* Filter & Sort Bar */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 shadow-2xs text-xs font-semibold text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <label htmlFor="sort-select" className="sr-only">সাজান</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer text-stone-800 font-bold pr-1"
              >
                <option value="featured">জনপ্রিয় অনুযায়ী (Featured)</option>
                <option value="price-low">মূল্য: কম থেকে বেশি</option>
                <option value="price-high">মূল্য: বেশি থেকে কম</option>
                <option value="rating">সর্বোচ্চ রেটিং</option>
              </select>
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                সব পণ্য রিসেট
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-stone-800">কোনো পণ্য পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              আপনার অনুসন্ধানকৃত শব্দের সাথে মিল পাওয়া যায়নি। দয়া করে অন্য কোনো নাম লিখে খুঁজুন বা ক্যাটাগরি পরিবর্তন করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              সকল পণ্য দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
                onAddToCart={(p, w) => handleAddToCart(p, w)}
                onQuickOrder={(p, w) => handleQuickOrder(p, w)}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </main>

      {/* Purity Promise Section (Ghorer Bazar Signature Trust Element) */}
      <PurityPromiseSection />

      {/* Customer Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer
        onSelectCategory={(id) => {
          setSelectedCategory(id);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenTrackOrder={() => setIsOrderTrackingOpen(true)}
      />

      {/* Mobile Sticky Bottom Navigation (Intuitive Mobile Experience) */}
      <MobileBottomNav
        currentTab={selectedCategory === 'all' ? 'home' : 'categories'}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onSelectTab={(tab) => {
          if (tab === 'home') setSelectedCategory('all');
        }}
        onOpenCategories={() => setIsCategoryDrawerOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setViewMode('profile')}
      />

      {/* Floating Admin Switcher Button (Bottom Left) */}
      <button
        onClick={() => setViewMode('admin')}
        className="fixed bottom-20 lg:bottom-6 left-4 z-40 px-3.5 py-2.5 bg-stone-900/90 hover:bg-stone-950 text-white rounded-2xl text-xs font-bold shadow-xl border border-white/20 backdrop-blur-xs flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>🔒 অ্যাডমিন ড্যাশবোর্ড (Admin Panel)</span>
      </button>

      {/* Floating Call & WhatsApp Quick Contact Button */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 flex flex-col gap-2">
        <a
          href="https://wa.me/8801700000000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Modals & Drawers */}
      <MobileCategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        selectedCategory={selectedCategory}
        currentUser={currentUser}
        onSelectCategory={(id) => setSelectedCategory(id)}
        onOpenTrackOrder={() => setIsOrderTrackingOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setViewMode('profile')}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, w, q) => handleAddToCart(p, w, q)}
        onQuickOrder={(p, w, q) => handleQuickOrder(p, w, q)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        discountAmount={discountAmount}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountAmount={discountAmount}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOrderSuccess={handleOrderSuccess}
        onClearCart={handleClearCart}
      />

      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        recentOrders={recentOrders}
        initialTrackingId={selectedTrackOrderId}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={PRODUCTS}
        onToggleWishlist={handleToggleWishlist}
        onQuickOrder={(p, w) => handleQuickOrder(p, w)}
        onAddToCart={(p, w) => handleAddToCart(p, w)}
      />

      {/* Phone OTP Login & Verification Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
