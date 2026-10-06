import { AdminProduct } from '../types';
import { 
  getLiveProducts, 
  createLiveProduct, 
  updateLiveProduct, 
  deleteLiveProduct,
  subscribeToRealtime
} from '../../services/realtimeSync';

export const getProducts = (): AdminProduct[] => {
  return getLiveProducts();
};

export const getProductById = (id: string): AdminProduct | undefined => {
  const products = getProducts();
  return products.find((p) => p.id === id);
};

export const saveProducts = (products: AdminProduct[]): void => {
  // Saved through realtimeSync automatically
};

export const updateProduct = (id: string, updatedData: Partial<AdminProduct>): AdminProduct | null => {
  updateLiveProduct(id, updatedData);
  const products = getProducts();
  return products.find(p => p.id === id) || null;
};

export const createProduct = (productData: Partial<AdminProduct>): AdminProduct => {
  createLiveProduct(productData);
  const products = getProducts();
  return products[0];
};

export const deleteProduct = (id: string): boolean => {
  deleteLiveProduct(id);
  return true;
};

export const subscribeToProducts = (listener: () => void) => {
  return subscribeToRealtime(listener);
};
