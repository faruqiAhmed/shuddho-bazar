import { AdminOrder, OrderStatus } from '../types';
import { RECENT_ORDERS_DATA } from '../data/adminMockData';

const ORDERS_STORAGE_KEY = 'shuddho_bazar_admin_orders';

// Initial enriched orders list
const INITIAL_ORDERS: AdminOrder[] = [
  ...RECENT_ORDERS_DATA.map((o) => ({
    ...o,
    subtotal: o.amount - (o.amount > 1500 ? 0 : 70),
    deliveryFee: o.amount > 1500 ? 0 : 70,
    discount: 0,
    paymentStatus: o.status === 'Delivered' ? ('Paid' as const) : o.paymentMethod === 'Cash on Delivery' ? ('Unpaid' as const) : ('Paid' as const),
    orderSource: 'Website' as const,
    deliveryArea: 'Inside City',
    courierName: o.deliveryRider?.includes('Steadfast') ? 'Steadfast Courier' : 'In-House Delivery',
    trackingNumber: 'TRK-' + o.id.replace('#SB-', '') + '99',
    notes: 'Please verify packaging seal before dispatch.'
  })),
  {
    id: '#SB-10243',
    customerName: 'ফারহানা করিম',
    customerPhone: '+880 1711 002233',
    customerEmail: 'farhana.karim@gmail.com',
    customerAddress: 'House 12, Road 4, Gulshan-1, Dhaka-1212',
    deliveryArea: 'Inside City',
    itemsCount: 2,
    itemsImages: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80'],
    itemsDetails: [
      { name: 'সুন্দরবনের খাঁটি খলিশা মধু', bengaliName: 'সুন্দরবনের খাঁটি খলিশা মধু', quantity: 1, price: 1250, weight: '1kg' },
      { name: 'কাঠের ঘানির সরিষার তেল', bengaliName: 'কাঠের ঘানির সরিষার তেল', quantity: 2, price: 350, weight: '1L' }
    ],
    subtotal: 1950,
    deliveryFee: 0,
    discount: 0,
    amount: 1950,
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    transactionId: 'BK9A23DF81',
    status: 'Delivered',
    date: 'Sep 26, 2025 04:12 PM',
    deliveryRider: 'Rahim Mia (Rider #14)',
    courierName: 'In-House Express',
    trackingNumber: 'TRK-1024388',
    notes: 'Deliver before 5:00 PM',
    orderSource: 'Phone Call'
  },
  {
    id: '#SB-10242',
    customerName: 'কামরুল হাসান',
    customerPhone: '+880 1912 334455',
    customerEmail: 'kamrul.hasan@yahoo.com',
    customerAddress: 'KDA Avenue, Sonadanga, Khulna',
    deliveryArea: 'Outside City',
    itemsCount: 4,
    itemsImages: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=150&q=80'],
    itemsDetails: [
      { name: 'বিলোনা গাওয়া ঘি', bengaliName: 'বিলোনা গাওয়া ঘি', quantity: 2, price: 950, weight: '500g' },
      { name: 'জুম্বো মরিয়ম ও মেদজুল খেজুর', bengaliName: 'জুম্বো মরিয়ম ও মেদজুল খেজুর', quantity: 1, price: 950, weight: '1kg' }
    ],
    subtotal: 2850,
    deliveryFee: 130,
    discount: 130,
    amount: 2850,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    status: 'Cancelled',
    date: 'Sep 25, 2025 02:40 PM',
    deliveryRider: 'Steadfast Courier',
    courierName: 'Steadfast Courier',
    trackingNumber: 'STF-88192834',
    notes: 'Customer cancelled due to travel',
    orderSource: 'Website'
  }
];

export const getOrders = (): AdminOrder[] => {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read orders from storage', e);
    return INITIAL_ORDERS;
  }
};

export const getOrderById = (id: string): AdminOrder | undefined => {
  const orders = getOrders();
  return orders.find(
    (o) => o.id.toLowerCase() === id.toLowerCase() || o.id.replace('#', '').toLowerCase() === id.replace('#', '').toLowerCase()
  );
};

export const saveOrders = (orders: AdminOrder[]): void => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders to storage', e);
  }
};

export const generateNextOrderId = (): string => {
  const orders = getOrders();
  let maxNum = 10248;
  orders.forEach((o) => {
    const num = parseInt(o.id.replace(/\D/g, ''), 10);
    if (!isNaN(num) && num > maxNum) {
      maxNum = num;
    }
  });
  return `#SB-${maxNum + 1}`;
};

export const createOrder = (orderData: Partial<AdminOrder>): AdminOrder => {
  const orders = getOrders();
  const nextId = orderData.id || generateNextOrderId();
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const subtotal = orderData.subtotal || 
    (orderData.itemsDetails?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0);
  
  const deliveryFee = orderData.deliveryFee ?? (subtotal >= 1500 ? 0 : orderData.deliveryArea === 'Outside City' ? 130 : 70);
  const discount = orderData.discount || 0;
  const amount = orderData.amount || Math.max(0, subtotal + deliveryFee - discount);

  const newOrder: AdminOrder = {
    id: nextId,
    customerName: orderData.customerName || 'নতুন সম্মানিত গ্রাহক',
    customerPhone: orderData.customerPhone || '+880 1700 000000',
    customerEmail: orderData.customerEmail || '',
    customerAddress: orderData.customerAddress || 'Dhaka, Bangladesh',
    deliveryArea: orderData.deliveryArea || 'Inside City',
    itemsCount: orderData.itemsDetails?.reduce((s, i) => s + i.quantity, 0) || orderData.itemsCount || 1,
    itemsImages: orderData.itemsImages && orderData.itemsImages.length > 0 
      ? orderData.itemsImages 
      : ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80'],
    itemsDetails: orderData.itemsDetails || [],
    subtotal,
    deliveryFee,
    discount,
    amount,
    paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
    paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid'),
    transactionId: orderData.transactionId || '',
    status: orderData.status || 'Processing',
    date: orderData.date || dateStr,
    deliveryRider: orderData.deliveryRider || 'Pending Assignment',
    courierName: orderData.courierName || 'In-House Express',
    trackingNumber: orderData.trackingNumber || `TRK-${nextId.replace('#SB-', '')}01`,
    notes: orderData.notes || '',
    orderSource: orderData.orderSource || 'Manual Admin'
  };

  const updatedOrders = [newOrder, ...orders];
  saveOrders(updatedOrders);
  return newOrder;
};

export const updateOrderStatus = (orderId: string, newStatus: OrderStatus): AdminOrder | null => {
  const orders = getOrders();
  let updatedOrder: AdminOrder | null = null;
  const updatedOrders = orders.map((o) => {
    if (o.id === orderId) {
      updatedOrder = { 
        ...o, 
        status: newStatus,
        paymentStatus: newStatus === 'Delivered' ? 'Paid' : o.paymentStatus
      };
      return updatedOrder;
    }
    return o;
  });

  if (updatedOrder) {
    saveOrders(updatedOrders);
  }
  return updatedOrder;
};

export const updateOrder = (orderId: string, partial: Partial<AdminOrder>): AdminOrder | null => {
  const orders = getOrders();
  let updatedOrder: AdminOrder | null = null;
  const updatedOrders = orders.map((o) => {
    if (o.id === orderId) {
      updatedOrder = { ...o, ...partial };
      return updatedOrder;
    }
    return o;
  });

  if (updatedOrder) {
    saveOrders(updatedOrders);
  }
  return updatedOrder;
};

export const deleteOrder = (orderId: string): boolean => {
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== orderId);
  if (filtered.length !== orders.length) {
    saveOrders(filtered);
    return true;
  }
  return false;
};
