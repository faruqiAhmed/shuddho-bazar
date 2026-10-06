import { AdminOrder, OrderStatus } from '../types';
import { 
  getLiveOrders, 
  createLiveOrder, 
  updateLiveOrderStatus, 
  deleteLiveOrder,
  subscribeToRealtime 
} from '../../services/realtimeSync';

export const getOrders = (): AdminOrder[] => {
  return getLiveOrders();
};

export const getOrderById = (id: string): AdminOrder | undefined => {
  const orders = getOrders();
  return orders.find(
    (o) => o.id.toLowerCase() === id.toLowerCase() || o.id.replace('#', '').toLowerCase() === id.replace('#', '').toLowerCase()
  );
};

export const saveOrders = (orders: AdminOrder[]): void => {
  // Handled automatically via realtimeSync
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
  createLiveOrder(orderData);
  const orders = getOrders();
  return orders[0];
};

export const updateOrderStatus = (orderId: string, newStatus: OrderStatus): AdminOrder | null => {
  updateLiveOrderStatus(orderId, newStatus);
  return getOrderById(orderId) || null;
};

export const updateOrder = (orderId: string, partial: Partial<AdminOrder>): AdminOrder | null => {
  const orders = getOrders();
  const found = orders.find(o => o.id === orderId);
  if (!found) return null;
  updateLiveOrderStatus(orderId, found.status, partial);
  return getOrderById(orderId) || null;
};

export const deleteOrder = (orderId: string): boolean => {
  deleteLiveOrder(orderId);
  return true;
};

export const subscribeToOrders = (listener: () => void) => {
  return subscribeToRealtime(listener);
};
