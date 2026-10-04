export interface WeightOption {
  label: string;
  weight: string;
  price: number;
  originalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  bengaliName: string;
  subtitle: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  gallery: string[];
  badge?: 'Best Seller' | '100% Pure' | 'Cold-Pressed' | 'Wood Pressed' | 'Wood Churned' | 'Hot Offer' | 'Organic' | 'Premium';
  weightOptions: WeightOption[];
  defaultWeight: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  purityPoints: string[];
  origin: string;
  unit: string;
  isFlashDeal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  bengaliName: string;
  slug: string;
  iconName: string;
  image: string;
  description: string;
  itemCount: number;
  badge?: string;
}

export interface CartItem {
  id: string; // unique item key: productId + weight
  product: Product;
  selectedWeight: string;
  unitPrice: number;
  originalUnitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  city: 'Inside City' | 'Outside City';
  deliveryNote?: string;
  paymentMethod: 'Cash on Delivery' | 'bKash / Mobile Banking' | 'Credit / Debit Card';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'Order Placed' | 'Purity Checked & Packed' | 'Handed to Courier' | 'Out for Delivery' | 'Delivered';
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  avatar?: string;
  productName?: string;
}
