import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Check, 
  Upload, 
  DollarSign, 
  Package, 
  Tag, 
  Layers, 
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { AdminProduct } from '../../types';

interface ProductEditModalProps {
  isOpen: boolean;
  product: AdminProduct | null; // If null, mode is Add
  onClose: () => void;
  onSave: (updatedProduct: AdminProduct) => void;
}

const PRESET_IMAGES = [
  { label: 'Raw Honey Jar', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80' },
  { label: 'Cold-Pressed Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80' },
  { label: 'Deshi Ghee Pot', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80' },
  { label: 'Dry Fruits & Nuts', url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400&q=80' },
  { label: 'Organic Chia Seeds', url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=400&q=80' },
  { label: 'Medjool Dates', url: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&w=400&q=80' },
];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditMode = Boolean(product);

  // Form states
  const [bengaliName, setBengaliName] = useState(product?.bengaliName || '');
  const [name, setName] = useState(product?.name || '');
  const [subtitle, setSubtitle] = useState(product?.subtitle || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || 'honey');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '500');
  const [originalPrice, setOriginalPrice] = useState(
    product?.originalPrice ? String(product.originalPrice) : '600'
  );
  const [costPrice, setCostPrice] = useState(
    product?.costPrice ? String(product.costPrice) : '350'
  );
  const [stock, setStock] = useState(product?.stock !== undefined ? String(product.stock) : '50');
  const [unit, setUnit] = useState(product?.unit || '1kg');
  const [status, setStatus] = useState<AdminProduct['status']>(product?.status || 'In Stock');
  const [image, setImage] = useState(
    product?.image || PRESET_IMAGES[0].url
  );
  const [badge, setBadge] = useState(product?.badge || '100% Pure');
  
  // Image file upload & import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setImportSuccessMsg(`"${file.name}" সফলভাবে ইমপোর্ট হয়েছে!`);
        setTimeout(() => setImportSuccessMsg(null), 3500);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  
  // Weight variants
  const [weightOptions, setWeightOptions] = useState<{ weight: string; price: number; originalPrice?: number }[]>(
    product?.weightOptions && product.weightOptions.length > 0
      ? product.weightOptions
      : [{ weight: product?.unit || '1kg', price: product?.price || 500, originalPrice: product?.originalPrice || 600 }]
  );

  const numPrice = Number(price) || 0;
  const numCost = Number(costPrice) || 0;
  const marginProfit = numPrice - numCost;
  const marginPercent = numPrice > 0 ? Math.round((marginProfit / numPrice) * 100) : 0;

  const getCategoryTitle = (catId: string) => {
    switch (catId) {
      case 'honey': return 'Raw Honey (খাঁটি মধু)';
      case 'oils': return 'Cold-Pressed Oils (ঘানির খাঁটি তেল)';
      case 'ghee': return 'Pure Deshi Ghee (গাওয়া ঘি)';
      case 'nuts': return 'Nuts & Dry Fruits (ড্রাই ফ্রুটস ও বাদাম)';
      case 'seeds': return 'Organic Seeds (সুপারফুড ও বীজ)';
      case 'spices': return 'Pure Spices (খাঁটি মশলা)';
      case 'dates': return 'Dates & Molasses (খেজুর ও গুড়)';
      default: return 'Pure Pantry (অর্গানিক প্যান্ট্রি)';
    }
  };

  const handleAddWeightOption = () => {
    setWeightOptions([
      ...weightOptions,
      { weight: '500g', price: Math.round(numPrice * 0.6), originalPrice: Math.round(numPrice * 0.7) }
    ]);
  };

  const handleUpdateWeightOption = (index: number, field: 'weight' | 'price' | 'originalPrice', value: string) => {
    const next = [...weightOptions];
    if (field === 'weight') {
      next[index].weight = value;
    } else {
      next[index][field] = Number(value) || 0;
    }
    setWeightOptions(next);
  };

  const handleRemoveWeightOption = (index: number) => {
    if (weightOptions.length <= 1) return;
    setWeightOptions(weightOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bengaliName.trim()) {
      alert('অনুগ্রহ করে পণ্যের বাংলা নাম লিখুন');
      return;
    }

    const currentStock = Number(stock) || 0;
    const computedStatus: AdminProduct['status'] = currentStock <= 0 
      ? 'Out of Stock' 
      : currentStock < 10 
      ? 'Low Stock' 
      : status;

    const savedProduct: AdminProduct = {
      id: product?.id || `p_${Date.now()}`,
      bengaliName: bengaliName.trim(),
      name: name.trim() || bengaliName.trim(),
      subtitle: subtitle.trim() || undefined,
      category: getCategoryTitle(categoryId).split(' (')[0],
      categoryId,
      price: numPrice,
      originalPrice: Number(originalPrice) || Math.round(numPrice * 1.15),
      costPrice: numCost,
      stock: currentStock,
      unit,
      status: computedStatus,
      image: image.trim() || PRESET_IMAGES[0].url,
      badge: badge.trim() || undefined,
      soldCount: product?.soldCount || 0,
      weightOptions: weightOptions.length > 0 ? weightOptions : [{ weight: unit, price: numPrice }],
    };

    onSave(savedProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
              📦
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg">
                  {isEditMode ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যুক্ত করুন (Add Product)'}
                </h3>
                {product?.id && (
                  <span className="font-mono text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                    {product.id}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                পণ্যের নাম, ছবি, বিক্রয় ও ক্রয় মূল্য এবং ইনভেন্টরি স্টক আপডেট করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-950/40 text-white hover:bg-emerald-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto text-xs">
          {/* Section 1: Product Titles & Category */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              <span>সাধারণ বিবরণ (General Details)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  পণ্যের বাংলা নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bengaliName}
                  onChange={(e) => setBengaliName(e.target.value)}
                  placeholder="যেমন: সুন্দরবনের খাঁটি খলিশা মধু"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  ইংরেজি নাম (English Name)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sundarban Raw Khalisha Honey"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  ক্যাটাগরি (Category)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="honey">খাঁটি মধু (Raw Honey)</option>
                  <option value="oils">ঘানির খাঁটি তেল (Cold-Pressed Oils)</option>
                  <option value="ghee">গাওয়া ঘি ও বাটার (Pure Deshi Ghee)</option>
                  <option value="nuts">ড্রাই ফ্রুটস ও বাদাম (Nuts & Dry Fruits)</option>
                  <option value="seeds">সুপারফুড ও অর্গানিক বীজ (Seeds)</option>
                  <option value="spices">খাঁটি মশলা (Pure Spices)</option>
                  <option value="dates">মরিয়ম খেজুর ও গুড় (Dates & Molasses)</option>
                  <option value="pantry">বিশুদ্ধ প্যান্ট্রি (Pure Pantry)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  স্পেশাল ব্যাজ / বৈশিষ্ট্য (Badge)
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="যেমন: 100% Raw, Wood-Pressed, Lab Tested"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  সাবটাইটেল / সংক্ষিপ্ত বিবরণ (Tagline)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="যেমন: সরাসরি সুন্দরবন থেকে সংগৃহীত অপরিশোধিত প্রাকৃতিক মধু"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Profit Margin */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                <span>মূল্য ও মুনাফা হিসাব (Pricing in ৳ BDT)</span>
              </h4>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                লাভ: ৳ {marginProfit.toLocaleString('en-IN')} ({marginPercent}%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  বিক্রয় মূল্য (Selling Price ৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">৳</span>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono font-black text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  পূর্বের মূল্য (Original Price ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">৳</span>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  ক্রয় / উৎপাদন খরচ (Cost Price ৳)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">৳</span>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Stock Inventory */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5 border-b border-stone-100 pb-2">
              <Package className="w-3.5 h-3.5 text-emerald-700" />
              <span>ইনভেন্টরি ও মজুত (Stock Management)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  মজুত সংখ্যা (Stock Count)
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  একক / ওজন (Base Unit)
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="1kg">1 kg</option>
                  <option value="500g">500 g</option>
                  <option value="250g">250 g</option>
                  <option value="100g">100 g</option>
                  <option value="1L">1 Litre</option>
                  <option value="500ml">500 ml</option>
                  <option value="250ml">250 ml</option>
                  <option value="Pack">Pack</option>
                  <option value="Jar">Glass Jar</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  স্টক স্ট্যাটাস
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-700 cursor-pointer"
                >
                  <option value="In Stock">In Stock (পর্যাপ্ত)</option>
                  <option value="Low Stock">Low Stock (সীমিত)</option>
                  <option value="Out of Stock">Out of Stock (স্টক আউট)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Product Image & Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                <span>পণ্যের ছবি (Product Image)</span>
              </h4>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                title="ডিভাইস থেকে সরাসরি ছবি আপলোড বা ইমপোর্ট করুন"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>ছবি ইমপোর্ট করুন (Import Image)</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Clickable Image Preview with Hover Overlay */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-600 bg-stone-100 shadow-sm shrink-0"
                title="ক্লিক করে কম্পিউটার বা মোবাইল থেকে ছবি পরিবর্তন করুন"
              >
                <img
                  src={image}
                  alt="Product Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity">
                  <Upload className="w-4 h-4 mb-0.5 text-emerald-300" />
                  <span>ছবি পরিবর্তন</span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-stone-700 text-xs">
                      ছবি URL (Image Link)
                    </label>
                    <span className="text-[10px] text-stone-400">
                      ওয়েব লিঙ্ক দিন অথবা সরাসরি ফাইল আপলোড করুন
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://... অথবা পাশের বাটনে ক্লিক করে ফাইল ইমপোর্ট করুন"
                      className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />

                    {/* Import Image Button right next to the URL input */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 hover:shadow-xs"
                      title="কম্পিউটার বা ফোন থেকে ছবি আপলোড/ইমপোর্ট করুন"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ইমপোর্ট (Import Image)</span>
                    </button>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileUpload}
                  />

                  {/* Import Success Notification */}
                  {importSuccessMsg && (
                    <div className="mt-1.5 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{importSuccessMsg}</span>
                    </div>
                  )}
                </div>

                {/* Preset quick buttons */}
                <div>
                  <span className="text-[10px] text-stone-400 block mb-1">ক্যাটালগ থেকে দ্রুত ছবি বাছাই করুন:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImage(preset.url)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                          image === preset.url
                            ? 'bg-emerald-100 border-emerald-600 text-emerald-900 font-bold'
                            : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Weight Options / Pack Variants */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>প্যাকেজিং সাইজ ও ভ্যারিয়েন্ট (Pack Sizes)</span>
              </h4>

              <button
                type="button"
                onClick={handleAddWeightOption}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>সাইজ যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-2">
              {weightOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="flex-1">
                    <span className="text-[10px] text-stone-400 block">ওজন/সাইজ:</span>
                    <input
                      type="text"
                      value={opt.weight}
                      onChange={(e) => handleUpdateWeightOption(idx, 'weight', e.target.value)}
                      placeholder="e.g. 500g"
                      className="w-full px-2 py-1 bg-white border border-stone-200 rounded font-bold text-xs"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] text-stone-400 block">বিক্রয় মূল্য (৳):</span>
                    <input
                      type="number"
                      value={opt.price}
                      onChange={(e) => handleUpdateWeightOption(idx, 'price', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-stone-200 rounded font-mono font-bold text-xs"
                    />
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] text-stone-400 block">পূর্বের মূল্য (৳):</span>
                    <input
                      type="number"
                      value={opt.originalPrice || ''}
                      onChange={(e) => handleUpdateWeightOption(idx, 'originalPrice', e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-stone-200 rounded font-mono text-xs"
                    />
                  </div>

                  {weightOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveWeightOption(idx)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer self-end mb-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold transition-all cursor-pointer"
            >
              বাতিল (Cancel)
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditMode ? 'আপডেট সংরক্ষণ করুন' : 'পণ্য যোগ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
