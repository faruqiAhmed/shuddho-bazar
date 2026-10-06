export type AdminTab = 
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'customers'
  | 'delivery'
  | 'payments'
  | 'promotions'
  | 'reports'
  | 'settings';

export interface AdminStat {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  comparisonPeriod: string;
  iconType: 'sales' | 'orders' | 'customers' | 'products';
  sparklineData: number[];
}

export type OrderPaymentMethod = 'bKash' | 'Cash on Delivery' | 'Nagad' | 'Card' | 'Rocket';

export type OrderStatus = 'Delivered' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Cancelled' | 'Confirmed' | 'Pending';

export interface AdminOrderItem {
  id?: string;
  productId?: string;
  name: string;
  bengaliName?: string;
  image?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  weight: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  deliveryArea?: 'Inside City' | 'Outside City' | 'Sub-Dhaka' | string;
  itemsCount: number;
  itemsImages: string[];
  itemsDetails?: AdminOrderItem[];
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  amount: number;
  paymentMethod: OrderPaymentMethod;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partial';
  transactionId?: string;
  status: OrderStatus;
  date: string;
  deliveryRider?: string;
  courierName?: string;
  trackingNumber?: string;
  notes?: string;
  orderSource?: 'Website' | 'Phone Call' | 'WhatsApp' | 'Facebook' | 'Manual Admin';
}

export interface LowStockProduct {
  id: string;
  name: string;
  weight: string;
  stockLeft: number;
  image: string;
  category: string;
  reorderLevel: number;
}

export interface CategorySales {
  name: string;
  englishName: string;
  amount: number;
  percentage: number;
  color: string;
  iconEmoji: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  bengaliName: string;
  category: string;
  categoryId: string;
  price: number;
  originalPrice: number;
  costPrice: number;
  stock: number;
  unit: string;
  image: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  soldCount: number;
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  badge?: string;
  origin?: string;
  rating?: number;
  reviewCount?: number;
  weightOptions?: { label?: string; weight: string; price: number; originalPrice?: number }[];
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'Active' | 'VIP' | 'New';
}

export interface DeliveryRecord {
  orderId: string;
  customerName: string;
  address: string;
  area: 'Dhaka North' | 'Dhaka South' | 'Chittagong' | 'Sylhet';
  riderName: string;
  riderPhone: string;
  courier: 'In-House' | 'Steadfast' | 'RedX' | 'Pathao';
  status: 'Out for Delivery' | 'Delivered' | 'Assigned' | 'Delayed';
  estimatedTime: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: OrderPaymentMethod;
  status: 'Completed' | 'Pending' | 'Refunded';
  transactionId: string;
  date: string;
}

export interface PromoCoupon {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderValue: number;
  usageCount: number;
  maxUsage: number;
  validUntil: string;
  status: 'Active' | 'Expired';
}
