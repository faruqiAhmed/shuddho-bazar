import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  TrendingUp, 
  ExternalLink,
  SquarePen
} from 'lucide-react';
import { AdminProduct } from '../../types';
import { 
  getProducts, 
  updateProduct, 
  createProduct, 
  deleteProduct 
} from '../../services/productService';
import { ProductEditModal } from './ProductEditModal';
import { ProductDetails } from './ProductDetails';
import { AdminPagination } from '../common/AdminPagination';

export const ProductsView: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>(() => getProducts());
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleViewProduct = (prod: AdminProduct) => {
    setSelectedProduct(prod);
    setViewMode('details');
  };

  const handleSaveProduct = (prod: AdminProduct) => {
    if (editingProduct) {
      // Update existing
      const updated = updateProduct(prod.id, prod);
      if (updated) {
        setProducts(getProducts());
        if (selectedProduct && selectedProduct.id === prod.id) {
          setSelectedProduct(updated);
        }
        showToast(`'${prod.bengaliName}' এর তথ্য সফলভাবে আপডেট হয়েছে!`);
      }
    } else {
      // Create new
      const created = createProduct(prod);
      setProducts(getProducts());
      showToast(`নতুন পণ্য '${created.bengaliName}' সফলভাবে ক্যাটালগে যুক্ত হয়েছে!`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে '${name}' পণ্যটি ডিলিট করতে চান?`)) {
      const ok = deleteProduct(id);
      if (ok) {
        setProducts(getProducts());
        if (selectedProduct && selectedProduct.id === id) {
          setSelectedProduct(null);
          setViewMode('list');
        }
        showToast(`'${name}' পণ্যটি তালিকা থেকে মুছে ফেলা হয়েছে`);
      }
    }
  };

  const handleUpdateProductFromDetails = (updated: AdminProduct) => {
    setProducts(getProducts());
    setSelectedProduct(updated);
    showToast(`'${updated.bengaliName}' এর তথ্য আপডেট হয়েছে`);
  };

  // If in details view mode, render dedicated Product Details page
  if (viewMode === 'details' && selectedProduct) {
    return (
      <>
        <ProductDetails
          product={selectedProduct}
          onBack={() => {
            setSelectedProduct(null);
            setViewMode('list');
          }}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onUpdate={handleUpdateProductFromDetails}
        />

        {/* Edit Modal accessible from details view */}
        <ProductEditModal
          isOpen={isModalOpen}
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      </>
    );
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.categoryId === categoryFilter;
    const matchesStatus = 
      statusFilter === 'all' 
        ? true 
        : statusFilter === 'in_stock' 
        ? p.stock >= 10 
        : statusFilter === 'low_stock' 
        ? p.stock > 0 && p.stock < 10 
        : p.stock <= 0;
    const matchesQuery = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bengaliName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesQuery;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Inventory stats
  const totalStockCount = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display font-black text-xl sm:text-2xl text-stone-900 leading-tight">
              পণ্য ব্যবস্থাপনা ও ক্যাটালগ (Products)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap">
              {products.length} Products
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 max-w-xl leading-relaxed">
            শুদ্ধ বাজারের খাঁটি মধু, তেল, ঘি ও ড্রাই ফ্রুটসের বিবরণ দেখুন, দাম ও স্টক সম্পাদনা করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন পণ্য যোগ করুন (Add Product)</span>
        </button>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-stone-400 block uppercase tracking-wider whitespace-nowrap">
              মোট পণ্য
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-0.5 block">
              {products.length}
            </span>
            <span className="text-[11px] text-stone-500 font-medium block mt-0.5 whitespace-nowrap">
              {totalStockCount} একক স্টক
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-lg">
            📦
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 block uppercase tracking-wider whitespace-nowrap">
              পর্যাপ্ত স্টক (In Stock)
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-0.5 block">
              {products.filter((p) => p.stock >= 10).length}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5 whitespace-nowrap">
              বিক্রয়ের জন্য প্রস্তুত
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <Check className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-600 block uppercase tracking-wider whitespace-nowrap">
              সীমিত স্টক (Low Stock)
            </span>
            <span className="font-display font-black text-xl sm:text-2xl text-stone-900 mt-0.5 block">
              {lowStockCount}
            </span>
            <span className="text-[11px] text-amber-700 font-medium block mt-0.5 whitespace-nowrap">
              ১০ টির নিচে স্টক
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-600 block uppercase tracking-wider whitespace-nowrap">
              ইনভেন্টরি মোট মূল্য
            </span>
            <span className="font-display font-black text-lg sm:text-xl text-stone-900 mt-0.5 block font-mono">
              ৳ {totalValuation.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-stone-500 font-medium block mt-0.5 whitespace-nowrap">
              বর্তমান বাজার দর
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              <option value="all">সকল ক্যাটাগরি (All Categories)</option>
              <option value="honey">খাঁটি মধু (Honey)</option>
              <option value="oils">ঘানির খাঁটি তেল (Oils)</option>
              <option value="ghee">গাওয়া ঘি (Ghee)</option>
              <option value="nuts">ড্রাই ফ্রুটস ও বাদাম (Nuts)</option>
              <option value="seeds">সুপারফুড ও বীজ (Seeds)</option>
              <option value="spices">খাঁটি মশলা (Spices)</option>
              <option value="dates">খেজুর ও গুড় (Dates)</option>
              <option value="pantry">বিশুদ্ধ প্যান্ট্রি (Pantry)</option>
            </select>

            {/* Stock status filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-[#15803d] text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {st === 'all' && 'All Stock'}
                  {st === 'in_stock' && 'In Stock'}
                  {st === 'low_stock' && 'Low Stock'}
                  {st === 'out_of_stock' && 'Out of Stock'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্যের নাম দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto no-scrollbar rounded-2xl border border-stone-200/90 bg-white shadow-2xs">
          <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200 text-stone-500 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4 min-w-[260px]">Product Details (পণ্য বিবরণ)</th>
                <th className="py-3.5 px-4 min-w-[140px]">Category</th>
                <th className="py-3.5 px-4 min-w-[130px]">Selling Price</th>
                <th className="py-3.5 px-4 min-w-[140px]">Cost & Margin</th>
                <th className="py-3.5 px-4 min-w-[140px]">Inventory Stock</th>
                <th className="py-3.5 px-4 min-w-[120px]">Status</th>
                <th className="py-3.5 px-4 min-w-[140px] text-center font-bold text-slate-400 uppercase tracking-widest text-[11px]">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 text-xs">
                    কোনো পণ্য পাওয়া যায়নি (No matching products found)
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const profit = p.price - p.costPrice;
                  const margin = p.price > 0 ? Math.round((profit / p.price) * 100) : 0;
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* Product Details */}
                      <td className="py-4 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewProduct(p)}
                            className="cursor-pointer group block shrink-0"
                            title="View Product Details"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 bg-stone-50 shadow-2xs group-hover:ring-2 group-hover:ring-emerald-700 transition-all"
                            />
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleViewProduct(p)}
                                className="font-bold text-stone-900 text-sm leading-snug whitespace-nowrap hover:text-emerald-800 hover:underline cursor-pointer text-left"
                              >
                                {p.bengaliName}
                              </button>
                              {p.badge && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full border border-emerald-200">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-400 block mt-0.5 whitespace-nowrap">
                              {p.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-stone-100 text-stone-700 font-semibold rounded-lg text-xs">
                          {p.category}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="font-mono font-black text-stone-900 text-sm">
                          ৳ {p.price.toLocaleString('en-IN')}
                        </div>
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-stone-400 line-through block mt-0.5">
                            ৳ {p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      {/* Cost & Margin */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="font-mono font-semibold text-stone-600 text-xs">
                          ৳ {p.costPrice.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                          লাভ ৳ {profit} ({margin}%)
                        </span>
                      </td>

                      {/* Inventory Stock */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <div className="font-bold text-stone-800 text-xs">
                          {p.stock} {p.unit}
                        </div>
                        <div className="w-20 bg-stone-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              p.stock < 10 ? 'bg-rose-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, (p.stock / 60) * 100)}%` }}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-middle whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.stock <= 0
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : p.stock < 10
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {p.stock <= 0 ? 'Out of Stock' : p.stock < 10 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      {/* Actions (matching design: ExternalLink, SquarePen, Trash2) */}
                      <td className="py-4 px-4 align-middle text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-3.5">
                          <button
                            onClick={() => handleViewProduct(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View product details"
                          >
                            <ExternalLink className="w-4 h-4" strokeWidth={1.8} />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <SquarePen className="w-4 h-4" strokeWidth={1.8} />
                          </button>

                          <button
                            onClick={() => handleDelete(p.id, p.bengaliName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <AdminPagination
          currentPage={currentPage}
          totalItems={filteredProducts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="পণ্য"
        />
      </div>

      {/* Product Edit / Add Modal */}
      <ProductEditModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
