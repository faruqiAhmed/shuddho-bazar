import { AdminProduct, AdminOrder, OrderStatus } from '../admin/types';
import { Product, Order } from '../types';

type ChangeListener = () => void;

const PRODUCTS_CACHE_KEY = 'shuddho_realtime_products_cache';
const ORDERS_CACHE_KEY = 'shuddho_realtime_orders_cache';

let liveProductsCache: AdminProduct[] = [];
let liveOrdersCache: AdminOrder[] = [];
const listeners = new Set<ChangeListener>();

// Broadcast channel for multi-tab instantaneous reflection
const channel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('shuddho_bazar_realtime') 
  : null;

if (channel) {
  channel.onmessage = (msg) => {
    if (msg.data?.type === 'PRODUCTS_UPDATED') {
      if (Array.isArray(msg.data.payload)) {
        liveProductsCache = msg.data.payload;
        notifyListeners();
      }
    } else if (msg.data?.type === 'ORDERS_UPDATED') {
      if (Array.isArray(msg.data.payload)) {
        liveOrdersCache = msg.data.payload;
        notifyListeners();
      }
    }
  };
}

function notifyListeners() {
  for (const listener of listeners) {
    try {
      listener();
    } catch (e) {
      console.error('Listener error:', e);
    }
  }
}

// Convert AdminProduct to Customer Product shape
export function adminProductToStoreProduct(ap: AdminProduct): Product {
  const stockCount = ap.stock ?? 30;
  return {
    id: ap.id,
    name: ap.name,
    bengaliName: ap.bengaliName || ap.name,
    subtitle: ap.subtitle || '100% Pure Natural Pantry Item',
    category: ap.category || 'Pure Pantry',
    categoryId: ap.categoryId || 'pantry',
    price: ap.price,
    originalPrice: ap.originalPrice || Math.round(ap.price * 1.15),
    rating: 4.9,
    reviewCount: 120,
    inStock: stockCount > 0,
    stockCount: stockCount,
    image: ap.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    gallery: [ap.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'],
    badge: (ap.badge as any) || (stockCount < 10 ? 'Hot Offer' : '100% Pure'),
    weightOptions: (ap.weightOptions && ap.weightOptions.length > 0)
      ? ap.weightOptions.map((w: any) => ({
          label: w.label || w.weight || ap.unit || '1 Pack',
          weight: w.weight || ap.unit || '1 Pack',
          price: Number(w.price) || ap.price,
          originalPrice: Number(w.originalPrice) || ap.originalPrice || Math.round(ap.price * 1.15)
        }))
      : [{
          label: ap.unit || '1 Pack',
          weight: ap.unit || '1 Pack',
          price: ap.price,
          originalPrice: ap.originalPrice || Math.round(ap.price * 1.15)
        }],
    defaultWeight: ap.unit || '1 Pack',
    shortDescription: ap.description || ap.subtitle || '',
    fullDescription: ap.description || ap.subtitle || '100% authentic pure organic item.',
    benefits: ['100% রাসায়নিক ও ভেজালমুক্ত', 'প্রাকৃতিক পুষ্টিগুণ সমৃদ্ধ', 'ল্যাব-পরীক্ষিত গুণমান'],
    purityPoints: ['সরাসরি বিশ্বস্ত উৎস থেকে সংগৃহীত', 'সঠিক প্যাকেজিং ও সিলমোহরযুক্ত'],
    origin: 'বাংলাদেশ',
    unit: ap.unit || 'Pack',
    isFlashDeal: ap.badge === 'Hot Offer' || ap.stock < 10
  };
}

// Convert AdminOrder to Customer Order shape
export function adminOrderToStoreOrder(ao: AdminOrder): Order {
  const items = (ao.itemsDetails || []).map((it, idx) => ({
    id: `${it.productId || it.name}_${idx}`,
    product: {
      id: it.productId || `p_${idx}`,
      name: it.name,
      bengaliName: it.bengaliName || it.name,
      subtitle: '',
      category: 'Pure Pantry',
      categoryId: 'pantry',
      price: it.price,
      originalPrice: it.originalPrice || it.price,
      rating: 5,
      reviewCount: 1,
      inStock: true,
      stockCount: 50,
      image: it.image || ao.itemsImages[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80',
      gallery: [],
      weightOptions: [],
      defaultWeight: it.weight,
      shortDescription: '',
      fullDescription: '',
      benefits: [],
      purityPoints: [],
      origin: 'Bangladesh',
      unit: it.weight
    },
    selectedWeight: it.weight,
    unitPrice: it.price,
    originalUnitPrice: it.originalPrice || it.price,
    quantity: it.quantity
  }));

  let storeStatus: Order['status'] = 'Order Placed';
  if (ao.status === 'Processing') storeStatus = 'Purity Checked & Packed';
  else if (ao.status === 'Shipped') storeStatus = 'Handed to Courier';
  else if (ao.status === 'Out for Delivery') storeStatus = 'Out for Delivery';
  else if (ao.status === 'Delivered') storeStatus = 'Delivered';

  return {
    id: ao.id,
    date: ao.date,
    customerName: ao.customerName,
    phone: ao.customerPhone,
    address: ao.customerAddress || '',
    city: (ao.deliveryArea === 'Outside City' ? 'Outside City' : 'Inside City') as any,
    deliveryNote: ao.notes,
    paymentMethod: ao.paymentMethod || 'Cash on Delivery',
    items,
    subtotal: ao.subtotal || ao.amount,
    deliveryFee: ao.deliveryFee || 0,
    discount: ao.discount || 0,
    total: ao.amount,
    status: storeStatus,
    estimatedDelivery: ao.deliveryArea === 'Outside City' ? 'Within 48 Hours' : 'Within 24 Hours'
  };
}

// Server EventSource for Live Updates
let eventSource: EventSource | null = null;

function setupEventSource() {
  if (typeof window === 'undefined') return;
  if (eventSource) return;

  try {
    eventSource = new EventSource('/api/events');

    eventSource.addEventListener('product:created', (e) => {
      try {
        const payload = JSON.parse(e.data).payload;
        liveProductsCache = [payload, ...liveProductsCache.filter(p => p.id !== payload.id)];
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
        notifyListeners();
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.addEventListener('product:updated', (e) => {
      try {
        const payload = JSON.parse(e.data).payload;
        liveProductsCache = liveProductsCache.map(p => p.id === payload.id ? { ...p, ...payload } : p);
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
        notifyListeners();
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.addEventListener('product:deleted', (e) => {
      try {
        const { id } = JSON.parse(e.data).payload;
        liveProductsCache = liveProductsCache.filter(p => p.id !== id);
        localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
        notifyListeners();
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.addEventListener('products:sync', (e) => {
      try {
        const payload = JSON.parse(e.data).payload;
        if (Array.isArray(payload)) {
          liveProductsCache = payload;
          localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
          notifyListeners();
        }
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.addEventListener('order:created', (e) => {
      try {
        const payload = JSON.parse(e.data).payload;
        liveOrdersCache = [payload, ...liveOrdersCache.filter(o => o.id !== payload.id)];
        localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
        notifyListeners();
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.addEventListener('order:updated', (e) => {
      try {
        const payload = JSON.parse(e.data).payload;
        liveOrdersCache = liveOrdersCache.map(o => o.id === payload.id ? { ...o, ...payload } : o);
        localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
        notifyListeners();
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.addEventListener('order:deleted', (e) => {
      try {
        const { id } = JSON.parse(e.data).payload;
        liveOrdersCache = liveOrdersCache.filter(o => o.id !== id);
        localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
        notifyListeners();
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.addEventListener('orders:sync', (e) => {
      try {
        const payload = JSON.parse(e.data).payload;
        if (Array.isArray(payload)) {
          liveOrdersCache = payload;
          localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
          notifyListeners();
        }
      } catch (err) {
        console.error(err);
      }
    });

    eventSource.onerror = () => {
      // Auto-reconnection is handled natively by EventSource
    };
  } catch (err) {
    console.error('Failed to setup SSE:', err);
  }
}

// Initial fetch from API
export async function initializeRealtime() {
  setupEventSource();

  try {
    const [prodRes, ordRes] = await Promise.all([
      fetch('/api/products').then(r => r.json()).catch(() => null),
      fetch('/api/orders').then(r => r.json()).catch(() => null)
    ]);

    if (prodRes?.success && Array.isArray(prodRes.data)) {
      liveProductsCache = prodRes.data;
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
    } else {
      const saved = localStorage.getItem(PRODUCTS_CACHE_KEY);
      if (saved) liveProductsCache = JSON.parse(saved);
    }

    if (ordRes?.success && Array.isArray(ordRes.data)) {
      liveOrdersCache = ordRes.data;
      localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
    } else {
      const saved = localStorage.getItem(ORDERS_CACHE_KEY);
      if (saved) liveOrdersCache = JSON.parse(saved);
    }

    notifyListeners();
  } catch (e) {
    console.error('Error during initial fetch:', e);
  }
}

// Subscribe component to live updates
export function subscribeToRealtime(listener: ChangeListener): () => void {
  listeners.add(listener);
  if (liveProductsCache.length === 0 || liveOrdersCache.length === 0) {
    initializeRealtime();
  }
  return () => {
    listeners.delete(listener);
  };
}

// Products API
export function getLiveProducts(): AdminProduct[] {
  if (liveProductsCache.length === 0 && typeof window !== 'undefined') {
    const saved = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (saved) {
      try {
        liveProductsCache = JSON.parse(saved);
      } catch {}
    }
  }
  return liveProductsCache;
}

export function getLiveStoreProducts(): Product[] {
  return getLiveProducts().map(adminProductToStoreProduct);
}

export async function createLiveProduct(data: Partial<AdminProduct>): Promise<AdminProduct> {
  const newProduct: AdminProduct = {
    id: data.id || `p_${Date.now()}`,
    name: data.name || 'New Organic Product',
    bengaliName: data.bengaliName || data.name || 'নতুন পণ্য',
    subtitle: data.subtitle || '100% Pure Natural Pantry Item',
    category: data.category || 'Pure Pantry',
    categoryId: data.categoryId || 'pantry',
    price: Number(data.price) || 500,
    originalPrice: Number(data.originalPrice) || Math.round((Number(data.price) || 500) * 1.15),
    costPrice: Number(data.costPrice) || Math.round((Number(data.price) || 500) * 0.72),
    stock: Number(data.stock ?? 30),
    unit: data.unit || 'Pack',
    image: data.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    status: (Number(data.stock ?? 30) <= 0) ? 'Out of Stock' : (Number(data.stock ?? 30) < 10) ? 'Low Stock' : 'In Stock',
    soldCount: 0,
    badge: data.badge || 'Organic',
    shortDescription: data.description || data.subtitle || '',
    description: data.description || '',
    rating: 5.0,
    reviewCount: 0,
    origin: data.origin || 'বাংলাদেশ',
    weightOptions: data.weightOptions && data.weightOptions.length > 0
      ? data.weightOptions
      : [{ label: data.unit || '1 Pack', weight: data.unit || '1 Pack', price: Number(data.price) || 500, originalPrice: Number(data.originalPrice) || Math.round((Number(data.price) || 500) * 1.15) }]
  };

  // Immediate optimistic update
  liveProductsCache = [newProduct, ...liveProductsCache.filter(p => p.id !== newProduct.id)];
  localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
  notifyListeners();

  if (channel) {
    channel.postMessage({ type: 'PRODUCTS_UPDATED', payload: liveProductsCache });
  }

  // Sync with backend API
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    const result = await res.json();
    if (result.success && result.data) {
      liveProductsCache = [result.data, ...liveProductsCache.filter(p => p.id !== result.data.id && p.id !== newProduct.id)];
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
      notifyListeners();
      return result.data;
    }
  } catch (err) {
    console.error('Failed to sync new product with server:', err);
  }

  return newProduct;
}

export async function updateLiveProduct(id: string, updates: Partial<AdminProduct>): Promise<AdminProduct | null> {
  const index = liveProductsCache.findIndex(p => p.id === id);
  if (index === -1) return null;

  const current = liveProductsCache[index];
  const stock = updates.stock !== undefined ? Number(updates.stock) : current.stock;
  const status = stock <= 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : (updates.status || current.status);

  const updated: AdminProduct = {
    ...current,
    ...updates,
    stock,
    status
  };

  // Immediate optimistic update
  liveProductsCache = liveProductsCache.map(p => p.id === id ? updated : p);
  localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
  notifyListeners();

  if (channel) {
    channel.postMessage({ type: 'PRODUCTS_UPDATED', payload: liveProductsCache });
  }

  // Server sync
  try {
    await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  } catch (err) {
    console.error('Failed to sync product update with server:', err);
  }

  return updated;
}

export async function deleteLiveProduct(id: string): Promise<boolean> {
  liveProductsCache = liveProductsCache.filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
  notifyListeners();

  if (channel) {
    channel.postMessage({ type: 'PRODUCTS_UPDATED', payload: liveProductsCache });
  }

  try {
    await fetch(`/api/products/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to sync product deletion with server:', err);
  }

  return true;
}

// Orders API
export function getLiveOrders(): AdminOrder[] {
  if (liveOrdersCache.length === 0 && typeof window !== 'undefined') {
    const saved = localStorage.getItem(ORDERS_CACHE_KEY);
    if (saved) {
      try {
        liveOrdersCache = JSON.parse(saved);
      } catch {}
    }
  }
  return liveOrdersCache;
}

export async function createLiveOrder(orderData: any): Promise<AdminOrder> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = orderData.id 
    ? (orderData.id.startsWith('#') ? orderData.id : `#${orderData.id}`)
    : `#SB-${randomSuffix}`;

  const items = orderData.items || [];
  const itemsDetails = items.map((it: any) => ({
    name: it.product?.name || it.name || 'Organic Item',
    bengaliName: it.product?.bengaliName || it.bengaliName || it.name,
    quantity: Number(it.quantity) || 1,
    price: Number(it.unitPrice || it.price) || 0,
    weight: it.selectedWeight || it.weight || '1kg'
  }));

  const itemsImages = items.map((it: any) => it.product?.image || it.image).filter(Boolean);
  if (itemsImages.length === 0) {
    itemsImages.push('https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80');
  }

  const subtotal = Number(orderData.subtotal) || items.reduce((acc: number, it: any) => acc + (it.unitPrice || it.price || 0) * (it.quantity || 1), 0);
  const deliveryFee = Number(orderData.deliveryFee) || (subtotal >= 1500 ? 0 : 70);
  const discount = Number(orderData.discount) || 0;
  const amount = Number(orderData.amount || orderData.total) || (subtotal + deliveryFee - discount);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
    ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const newOrder: AdminOrder = {
    id: orderId,
    customerName: orderData.customerName || 'Customer',
    customerPhone: orderData.customerPhone || orderData.phone || '',
    customerEmail: orderData.customerEmail || orderData.email || '',
    customerAddress: orderData.customerAddress || orderData.address || '',
    deliveryArea: orderData.deliveryArea || orderData.city || 'Inside City',
    itemsCount: items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0) || 1,
    itemsImages,
    itemsDetails,
    subtotal,
    deliveryFee,
    discount,
    amount,
    paymentMethod: (orderData.paymentMethod || 'Cash on Delivery') as any,
    paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid'),
    transactionId: orderData.transactionId || (orderData.paymentMethod !== 'Cash on Delivery' ? `${(orderData.paymentMethod || 'TX').slice(0, 2).toUpperCase()}${Date.now().toString().slice(-6)}` : undefined),
    status: orderData.status || 'Processing',
    date: dateFormatted,
    orderSource: orderData.orderSource || 'Website',
    notes: orderData.notes || orderData.deliveryNote || ''
  };

  // Immediate optimistic update
  liveOrdersCache = [newOrder, ...liveOrdersCache.filter(o => o.id !== newOrder.id)];
  localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));

  // Deduct inventory locally
  for (const item of items) {
    const prodId = item.product?.id || item.productId || item.id?.split('_')[0];
    const pIdx = liveProductsCache.findIndex(p => p.id === prodId);
    if (pIdx !== -1) {
      const qty = Number(item.quantity) || 1;
      const newStock = Math.max(0, liveProductsCache[pIdx].stock - qty);
      liveProductsCache[pIdx] = {
        ...liveProductsCache[pIdx],
        stock: newStock,
        soldCount: (liveProductsCache[pIdx].soldCount || 0) + qty,
        status: newStock <= 0 ? 'Out of Stock' : newStock < 10 ? 'Low Stock' : 'In Stock'
      };
    }
  }
  localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(liveProductsCache));
  notifyListeners();

  if (channel) {
    channel.postMessage({ type: 'ORDERS_UPDATED', payload: liveOrdersCache });
    channel.postMessage({ type: 'PRODUCTS_UPDATED', payload: liveProductsCache });
  }

  // Server sync
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    const result = await res.json();
    if (result.success && result.data) {
      liveOrdersCache = [result.data, ...liveOrdersCache.filter(o => o.id !== result.data.id && o.id !== newOrder.id)];
      localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
      notifyListeners();
      return result.data;
    }
  } catch (err) {
    console.error('Failed to sync order with server:', err);
  }

  return newOrder;
}

export async function updateLiveOrderStatus(id: string, status: OrderStatus, extraData?: Partial<AdminOrder>): Promise<AdminOrder | null> {
  const index = liveOrdersCache.findIndex(o => 
    o.id.toLowerCase() === id.toLowerCase() || 
    o.id.replace('#', '').toLowerCase() === id.replace('#', '').toLowerCase()
  );
  if (index === -1) return null;

  const current = liveOrdersCache[index];
  const updated: AdminOrder = {
    ...current,
    status,
    ...extraData
  };

  liveOrdersCache = liveOrdersCache.map(o => (o.id === current.id ? updated : o));
  localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
  notifyListeners();

  if (channel) {
    channel.postMessage({ type: 'ORDERS_UPDATED', payload: liveOrdersCache });
  }

  try {
    await fetch(`/api/orders/${encodeURIComponent(current.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
  } catch (err) {
    console.error('Failed to sync order update with server:', err);
  }

  return updated;
}

export async function deleteLiveOrder(id: string): Promise<boolean> {
  liveOrdersCache = liveOrdersCache.filter(o => 
    o.id.toLowerCase() !== id.toLowerCase() && 
    o.id.replace('#', '').toLowerCase() !== id.replace('#', '').toLowerCase()
  );
  localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(liveOrdersCache));
  notifyListeners();

  if (channel) {
    channel.postMessage({ type: 'ORDERS_UPDATED', payload: liveOrdersCache });
  }

  try {
    await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to sync order delete with server:', err);
  }

  return true;
}
