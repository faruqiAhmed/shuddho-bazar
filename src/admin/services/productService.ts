import { AdminProduct } from '../types';
import { PRODUCTS } from '../../data/mockData';

const PRODUCTS_STORAGE_KEY = 'shuddho_bazar_admin_products';

const INITIAL_PRODUCTS: AdminProduct[] = PRODUCTS.map((p, idx) => ({
  id: p.id,
  name: p.name,
  bengaliName: p.bengaliName,
  subtitle: p.subtitle,
  category: p.category,
  categoryId: p.categoryId,
  price: p.price,
  originalPrice: p.originalPrice,
  costPrice: Math.round(p.price * 0.72),
  stock: p.stockCount || 40,
  unit: p.unit || 'Pack',
  image: p.image,
  status: (p.stockCount && p.stockCount < 10) ? 'Low Stock' : 'In Stock',
  soldCount: 120 + idx * 18,
  badge: p.badge,
  weightOptions: p.weightOptions || [
    { weight: p.unit || '1 Pack', price: p.price, originalPrice: p.originalPrice }
  ],
}));

export const getProducts = (): AdminProduct[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load products from storage', e);
    return INITIAL_PRODUCTS;
  }
};

export const getProductById = (id: string): AdminProduct | undefined => {
  const products = getProducts();
  return products.find((p) => p.id === id);
};

export const saveProducts = (products: AdminProduct[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to storage', e);
  }
};

export const updateProduct = (id: string, updatedData: Partial<AdminProduct>): AdminProduct | null => {
  const products = getProducts();
  let updatedProduct: AdminProduct | null = null;

  const nextProducts = products.map((p) => {
    if (p.id === id) {
      const stock = updatedData.stock !== undefined ? updatedData.stock : p.stock;
      const status: AdminProduct['status'] = stock <= 0 
        ? 'Out of Stock' 
        : stock < 10 
        ? 'Low Stock' 
        : (updatedData.status || p.status || 'In Stock');

      updatedProduct = {
        ...p,
        ...updatedData,
        stock,
        status,
      };
      return updatedProduct;
    }
    return p;
  });

  if (updatedProduct) {
    saveProducts(nextProducts);
  }
  return updatedProduct;
};

export const createProduct = (productData: Partial<AdminProduct>): AdminProduct => {
  const products = getProducts();
  const newId = productData.id || `p_${Date.now()}`;
  const price = Number(productData.price) || 500;
  const originalPrice = productData.originalPrice || Math.round(price * 1.15);
  const costPrice = productData.costPrice || Math.round(price * 0.72);
  const stock = Number(productData.stock) || 50;
  const status: AdminProduct['status'] = stock <= 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock';

  const newProd: AdminProduct = {
    id: newId,
    name: productData.name || 'New Organic Product',
    bengaliName: productData.bengaliName || 'নতুন অর্গানিক পণ্য',
    subtitle: productData.subtitle || '100% Pure Natural Pantry Item',
    category: productData.category || 'Pure Pantry',
    categoryId: productData.categoryId || 'pantry',
    price,
    originalPrice,
    costPrice,
    stock,
    unit: productData.unit || '1kg',
    image: productData.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    status,
    soldCount: 0,
    badge: productData.badge || 'New',
    weightOptions: productData.weightOptions || [
      { weight: productData.unit || '1kg', price, originalPrice }
    ],
  };

  const nextProducts = [newProd, ...products];
  saveProducts(nextProducts);
  return newProd;
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const nextProducts = products.filter((p) => p.id !== id);
  if (nextProducts.length !== products.length) {
    saveProducts(nextProducts);
    return true;
  }
  return false;
};
