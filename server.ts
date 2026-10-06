import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Authentic Products for Shuddho Bazar (No fake/broken demo items)
const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Sundarbans Wild Khalsi Raw Honey',
    bengaliName: 'সুন্দরবনের খাঁটি খলিশা মধু',
    subtitle: '100% Unprocessed Natural Wild Floral Honey',
    category: 'Raw Honey',
    categoryId: 'honey',
    price: 1250,
    originalPrice: 1450,
    costPrice: 880,
    stock: 45,
    unit: '1 kg Jar',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    status: 'In Stock',
    soldCount: 342,
    badge: 'Best Seller',
    shortDescription: 'Sundarbans certified pure raw honey collected directly by trusted Mawals.',
    description: '100% pure, unfiltered and unpasteurized Sundarbans Khalsi floral honey.',
    rating: 4.9,
    reviewCount: 184,
    origin: 'Sundarbans Mangrove Forest, Satkhira',
    weightOptions: [
      { label: '500g Glass Jar', weight: '500g', price: 650, originalPrice: 750 },
      { label: '1kg Glass Jar', weight: '1kg', price: 1250, originalPrice: 1450 },
      { label: '2kg Family Pack', weight: '2kg', price: 2400, originalPrice: 2800 }
    ]
  },
  {
    id: 'p2',
    name: 'Wood Pressed Black Mustard Oil',
    bengaliName: 'কাঠের ঘানির খাঁটি কালো সরিষার তেল',
    subtitle: 'Cold-Pressed Unrefined Mustard Seed Oil',
    category: 'Cold-Pressed Oils',
    categoryId: 'oils',
    price: 360,
    originalPrice: 420,
    costPrice: 260,
    stock: 60,
    unit: '1 Litre',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    status: 'In Stock',
    soldCount: 512,
    badge: 'Wood Pressed',
    shortDescription: 'Traditional wooden press (কাঠের ঘানি) extracted pure pungent mustard oil.',
    description: 'Natural pungent aroma, high smoking point, no chemicals or mixing.',
    rating: 4.8,
    reviewCount: 220,
    origin: 'Natore, Rajshahi',
    weightOptions: [
      { label: '500ml Bottle', weight: '500ml', price: 190, originalPrice: 220 },
      { label: '1 Litre Bottle', weight: '1 Litre', price: 360, originalPrice: 420 },
      { label: '5 Litre Gallon', weight: '5 Litre', price: 1750, originalPrice: 2000 }
    ]
  },
  {
    id: 'p3',
    name: 'Grass-Fed Cow Milk Bilona Ghee',
    bengaliName: 'বিলোনা গাওয়া ঘি (A2 দেশি গাভী)',
    subtitle: 'Traditional Granular Bilona Churned Butter Ghee',
    category: 'Pure Deshi Ghee',
    categoryId: 'ghee',
    price: 950,
    originalPrice: 1100,
    costPrice: 690,
    stock: 35,
    unit: '500g Jar',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    status: 'In Stock',
    soldCount: 289,
    badge: '100% Pure',
    shortDescription: 'Hand-churned grass-fed desi cow cultured curd bilona ghee with granular texture.',
    description: 'Irresistible natural aroma, rich in vitamins A, D, E and butyric acid.',
    rating: 5.0,
    reviewCount: 167,
    origin: 'Pabna & Sirajganj Bathans',
    weightOptions: [
      { label: '250g Jar', weight: '250g', price: 500, originalPrice: 580 },
      { label: '500g Jar', weight: '500g', price: 950, originalPrice: 1100 },
      { label: '1kg Glass Jar', weight: '1kg', price: 1850, originalPrice: 2150 }
    ]
  },
  {
    id: 'p4',
    name: 'Premium Jumbo Maryam & Medjool Dates',
    bengaliName: 'জুম্বো মরিয়ম ও মেদজুল খেজুর',
    subtitle: 'Fresh Soft Golden Caramel Saudi & Madinah Dates',
    category: 'Dry Fruits & Nuts',
    categoryId: 'nuts',
    price: 950,
    originalPrice: 1150,
    costPrice: 710,
    stock: 8,
    unit: '1 kg Box',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
    status: 'Low Stock',
    soldCount: 420,
    badge: 'Premium',
    shortDescription: 'Grade-A Madinah Maryam dates, naturally sweet, moist, and free of added sugar.',
    description: 'Rich in potassium, dietary fiber and natural energy.',
    rating: 4.9,
    reviewCount: 140,
    origin: 'Madinah Al Munawwarah',
    weightOptions: [
      { label: '500g Box', weight: '500g', price: 500, originalPrice: 600 },
      { label: '1kg Box', weight: '1kg', price: 950, originalPrice: 1150 }
    ]
  },
  {
    id: 'p5',
    name: 'Certified Organic Chia Seeds',
    bengaliName: 'অর্গানিক চিয়া সিড (প্রিমিয়াম গ্রেড)',
    subtitle: 'High Omega-3 Superfood Dietary Fiber Seeds',
    category: 'Organic Seeds',
    categoryId: 'seeds',
    price: 450,
    originalPrice: 550,
    costPrice: 310,
    stock: 28,
    unit: '500g Pack',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    status: 'In Stock',
    soldCount: 310,
    badge: 'Organic',
    shortDescription: '100% natural pesticide-free chia seeds for weight management and heart wellness.',
    description: 'Loaded with plant protein, calcium, antioxidants and omega-3.',
    rating: 4.8,
    reviewCount: 95,
    origin: 'Direct Import (South America)',
    weightOptions: [
      { label: '250g Pack', weight: '250g', price: 240, originalPrice: 290 },
      { label: '500g Pack', weight: '500g', price: 450, originalPrice: 550 },
      { label: '1kg Jar', weight: '1kg', price: 850, originalPrice: 1050 }
    ]
  },
  {
    id: 'p6',
    name: 'Natural Extra Virgin Cold-Pressed Coconut Oil',
    bengaliName: 'এক্সট্রা ভার্জিন নারিকেল তেল',
    subtitle: 'Raw Edible & Hair Care Cold Extracted Coconut Oil',
    category: 'Cold-Pressed Oils',
    categoryId: 'oils',
    price: 420,
    originalPrice: 490,
    costPrice: 290,
    stock: 22,
    unit: '500ml Bottle',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80',
    status: 'In Stock',
    soldCount: 195,
    badge: 'Cold-Pressed',
    shortDescription: 'Cold extracted virgin coconut oil from fresh coastal coconuts.',
    description: '100% chemical-free, food-grade and cosmetic-grade virgin coconut oil.',
    rating: 4.7,
    reviewCount: 78,
    origin: 'Bagerhat Coastal Groves',
    weightOptions: [
      { label: '250ml Glass Bottle', weight: '250ml', price: 230, originalPrice: 270 },
      { label: '500ml Glass Bottle', weight: '500ml', price: 420, originalPrice: 490 }
    ]
  }
];

// Initial Real Orders
const INITIAL_ORDERS = [
  {
    id: '#SB-10482',
    customerName: 'তানভীর আহমেদ',
    customerPhone: '+880 1712 345678',
    customerEmail: 'tanvir.ahmed@gmail.com',
    customerAddress: 'House 42, Road 11, Dhanmondi, Dhaka',
    deliveryArea: 'Inside City',
    itemsCount: 2,
    itemsImages: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80'],
    itemsDetails: [
      { name: 'সুন্দরবনের খাঁটি খলিশা মধু', bengaliName: 'সুন্দরবনের খাঁটি খলিশা মধু', quantity: 1, price: 1250, weight: '1kg' },
      { name: 'কাঠের ঘানির সরিষার তেল', bengaliName: 'কাঠের ঘানির সরিষার তেল', quantity: 2, price: 360, weight: '1 Litre' }
    ],
    subtotal: 1970,
    deliveryFee: 0,
    discount: 0,
    amount: 1970,
    paymentMethod: 'bKash',
    paymentStatus: 'Paid',
    transactionId: 'BK92837482',
    status: 'Delivered',
    date: 'Oct 04, 2026 02:40 PM',
    deliveryRider: 'Rahim Mia (Rider #14)',
    courierName: 'In-House Express',
    trackingNumber: 'TRK-1048299',
    orderSource: 'Website',
    notes: 'Fragile glass bottle packing.'
  },
  {
    id: '#SB-10481',
    customerName: 'নাসরিন সুলতানা',
    customerPhone: '+880 1819 876543',
    customerEmail: 'nasrin.s@gmail.com',
    customerAddress: 'Flat 4B, Green Road, Farmgate, Dhaka',
    deliveryArea: 'Inside City',
    itemsCount: 1,
    itemsImages: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=150&q=80'],
    itemsDetails: [
      { name: 'বিলোনা গাওয়া ঘি', bengaliName: 'বিলোনা গাওয়া ঘি', quantity: 1, price: 950, weight: '500g' }
    ],
    subtotal: 950,
    deliveryFee: 70,
    discount: 0,
    amount: 1020,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Unpaid',
    status: 'Processing',
    date: 'Oct 05, 2026 10:15 AM',
    courierName: 'Steadfast Courier',
    orderSource: 'Website',
    notes: 'Call before delivery.'
  }
];

// Helper functions for persistent disk storage
function readProducts() {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
      return INITIAL_PRODUCTS;
    }
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading products:', err);
    return INITIAL_PRODUCTS;
  }
}

function writeProducts(products: any[]) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing products:', err);
  }
}

function readOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(INITIAL_ORDERS, null, 2), 'utf-8');
      return INITIAL_ORDERS;
    }
    const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading orders:', err);
    return INITIAL_ORDERS;
  }
}

function writeOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing orders:', err);
  }
}

// Connected SSE clients for Live Real-Time Data Push
const sseClients = new Set<Response>();

function broadcast(event: string, payload: any) {
  const data = JSON.stringify({ event, payload, timestamp: Date.now() });
  for (const client of sseClients) {
    try {
      client.write(`event: ${event}\ndata: ${data}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Real-time Server-Sent Events (SSE) Endpoint
  app.get('/api/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    sseClients.add(res);

    // Initial heartbeat
    res.write(`data: ${JSON.stringify({ event: 'connected', timestamp: Date.now() })}\n\n`);

    const interval = setInterval(() => {
      res.write(': keep-alive\n\n');
    }, 20000);

    req.on('close', () => {
      clearInterval(interval);
      sseClients.delete(res);
    });
  });

  // ================= PRODUCTS API =================
  app.get('/api/products', (req: Request, res: Response) => {
    const products = readProducts();
    res.json({ success: true, count: products.length, data: products });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const products = readProducts();
    const body = req.body;
    const newId = body.id || `p_${Date.now()}`;
    const price = Number(body.price) || 500;
    const originalPrice = Number(body.originalPrice) || Math.round(price * 1.15);
    const stock = Number(body.stock ?? body.stockCount ?? 30);
    const status = stock <= 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock';

    const newProduct = {
      id: newId,
      name: body.name || 'New Organic Product',
      bengaliName: body.bengaliName || body.name || 'নতুন অর্গানিক পণ্য',
      subtitle: body.subtitle || '100% Pure Natural Pantry Item',
      category: body.category || 'Pure Pantry',
      categoryId: body.categoryId || 'pantry',
      price,
      originalPrice,
      costPrice: Number(body.costPrice) || Math.round(price * 0.72),
      stock,
      unit: body.unit || 'Pack',
      image: body.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      status,
      soldCount: 0,
      badge: body.badge || 'Organic',
      shortDescription: body.shortDescription || body.subtitle || '',
      description: body.description || body.shortDescription || '',
      rating: 5.0,
      reviewCount: 0,
      origin: body.origin || 'Bangladesh',
      weightOptions: Array.isArray(body.weightOptions) && body.weightOptions.length > 0 
        ? body.weightOptions 
        : [{ label: body.unit || '1 Pack', weight: body.unit || '1 Pack', price, originalPrice }]
    };

    products.unshift(newProduct);
    writeProducts(products);

    // Broadcast in real-time to customer store & other admin sessions
    broadcast('product:created', newProduct);
    broadcast('products:sync', products);

    res.status(201).json({ success: true, message: 'Product created', data: newProduct });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const products = readProducts();
    const id = req.params.id;
    const index = products.findIndex((p: any) => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const current = products[index];
    const stock = req.body.stock !== undefined ? Number(req.body.stock) : current.stock;
    const status = stock <= 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : (req.body.status || current.status);

    const updated = {
      ...current,
      ...req.body,
      stock,
      status
    };

    products[index] = updated;
    writeProducts(products);

    broadcast('product:updated', updated);
    broadcast('products:sync', products);

    res.json({ success: true, message: 'Product updated', data: updated });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const products = readProducts();
    const id = req.params.id;
    const filtered = products.filter((p: any) => p.id !== id);

    if (filtered.length === products.length) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    writeProducts(filtered);
    broadcast('product:deleted', { id });
    broadcast('products:sync', filtered);

    res.json({ success: true, message: 'Product deleted', id });
  });

  // ================= ORDERS API =================
  app.get('/api/orders', (req: Request, res: Response) => {
    const orders = readOrders();
    res.json({ success: true, count: orders.length, data: orders });
  });

  app.post('/api/orders/clear-demo', (req: Request, res: Response) => {
    writeOrders([]);
    broadcast('orders:sync', []);
    res.json({ success: true, message: 'All demo orders cleared', data: [] });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const orders = readOrders();
    const products = readProducts();
    const body = req.body;

    // Generate neat order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = body.id ? (body.id.startsWith('#') ? body.id : `#${body.id}`) : `#SB-${randomSuffix}`;

    const items = body.items || [];
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

    const subtotal = Number(body.subtotal) || items.reduce((acc: number, it: any) => acc + (it.unitPrice || it.price || 0) * (it.quantity || 1), 0);
    const deliveryFee = Number(body.deliveryFee) || (subtotal >= 1500 ? 0 : 70);
    const discount = Number(body.discount) || 0;
    const amount = Number(body.amount || body.total) || (subtotal + deliveryFee - discount);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
      ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      customerName: body.customerName || 'Customer',
      customerPhone: body.customerPhone || body.phone || '',
      customerEmail: body.customerEmail || body.email || '',
      customerAddress: body.customerAddress || body.address || '',
      deliveryArea: body.deliveryArea || body.city || 'Inside City',
      itemsCount: items.reduce((acc: number, it: any) => acc + (Number(it.quantity) || 1), 0) || 1,
      itemsImages,
      itemsDetails,
      subtotal,
      deliveryFee,
      discount,
      amount,
      paymentMethod: body.paymentMethod || 'Cash on Delivery',
      paymentStatus: body.paymentStatus || (body.paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Paid'),
      transactionId: body.transactionId || (body.paymentMethod !== 'Cash on Delivery' ? `${(body.paymentMethod || 'TX').slice(0, 2).toUpperCase()}${Date.now().toString().slice(-6)}` : undefined),
      status: body.status || 'Processing',
      date: dateFormatted,
      orderSource: body.orderSource || 'Website',
      notes: body.notes || body.deliveryNote || ''
    };

    // Stock deduction in real-time
    let stockChanged = false;
    for (const item of items) {
      const prodId = item.product?.id || item.productId || item.id?.split('_')[0];
      const pIdx = products.findIndex((p: any) => p.id === prodId);
      if (pIdx !== -1) {
        const qty = Number(item.quantity) || 1;
        products[pIdx].stock = Math.max(0, products[pIdx].stock - qty);
        products[pIdx].soldCount = (products[pIdx].soldCount || 0) + qty;
        if (products[pIdx].stock <= 0) {
          products[pIdx].status = 'Out of Stock';
        } else if (products[pIdx].stock < 10) {
          products[pIdx].status = 'Low Stock';
        }
        stockChanged = true;
      }
    }

    if (stockChanged) {
      writeProducts(products);
      broadcast('products:sync', products);
    }

    orders.unshift(newOrder);
    writeOrders(orders);

    // Broadcast new order to Admin & Store live
    broadcast('order:created', newOrder);
    broadcast('orders:sync', orders);

    res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder });
  });

  app.put('/api/orders/:id', (req: Request, res: Response) => {
    const orders = readOrders();
    const id = req.params.id;
    const index = orders.findIndex((o: any) => 
      o.id.toLowerCase() === id.toLowerCase() || 
      o.id.replace('#', '').toLowerCase() === id.replace('#', '').toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updated = {
      ...orders[index],
      ...req.body
    };

    orders[index] = updated;
    writeOrders(orders);

    broadcast('order:updated', updated);
    broadcast('orders:sync', orders);

    res.json({ success: true, message: 'Order updated', data: updated });
  });

  app.delete('/api/orders/:id', (req: Request, res: Response) => {
    const orders = readOrders();
    const id = req.params.id;
    const filtered = orders.filter((o: any) => 
      o.id.toLowerCase() !== id.toLowerCase() && 
      o.id.replace('#', '').toLowerCase() !== id.replace('#', '').toLowerCase()
    );

    if (filtered.length === orders.length) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    writeOrders(filtered);
    broadcast('order:deleted', { id });
    broadcast('orders:sync', filtered);

    res.json({ success: true, message: 'Order deleted', id });
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Setup Vite in middleware mode for seamless dev execution
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
