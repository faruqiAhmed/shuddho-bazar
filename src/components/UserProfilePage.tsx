import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  LayoutGrid, 
  LogOut, 
  Truck, 
  ShoppingBag, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Home,
  Briefcase
} from 'lucide-react';
import { CustomerUser, SavedAddress, Order, CartItem } from '../types';
import { addSavedAddress, deleteSavedAddress, formatDisplayPhone } from '../services/authService';
import { formatBdt } from './BdtPrice';

interface UserProfilePageProps {
  user: CustomerUser;
  onBackToStore: () => void;
  onOpenAdmin: () => void;
  onLogout: () => void;
  onLiveTrack: (trackingId: string) => void;
  onReorder: (order: any) => void;
}

// 7 Pre-seeded past orders matching user profile screenshot (#DF-10086 as primary)
const MOCK_PROFILE_ORDERS = [
  {
    id: '#DF-10086',
    rawId: 'DF-10086',
    status: 'ডেলিভারি সম্পন্ন',
    date: 'Sep 18, 2025 04:32 PM',
    amount: 1250,
    paymentMethod: 'bKash (Paid)',
    courierId: 'STDF-10086',
    items: [
      {
        name: 'মদিনার প্রিমিয়াম আজওয়া খেজুর',
        quantity: '1টি',
        price: '৳950',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'সুন্দরবনের খাঁটি মধু',
        quantity: '1টি',
        price: '৳650',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80',
      }
    ]
  },
  {
    id: '#DF-10072',
    rawId: 'DF-10072',
    status: 'ডেলিভারি সম্পন্ন',
    date: 'Sep 02, 2025 11:20 AM',
    amount: 1950,
    paymentMethod: 'Nagad (Paid)',
    courierId: 'STDF-10072',
    items: [
      {
        name: 'কাঠের ঘানির খাঁটি সরিষার তেল',
        quantity: '2টি',
        price: '৳700',
        weight: '1L',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'বিলোনা গাওয়া ঘি',
        quantity: '1টি',
        price: '৳1250',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=150&q=80',
      }
    ]
  },
  {
    id: '#DF-10065',
    rawId: 'DF-10065',
    status: 'ডেলিভারি সম্পন্ন',
    date: 'Aug 19, 2025 03:15 PM',
    amount: 850,
    paymentMethod: 'Cash on Delivery',
    courierId: 'STDF-10065',
    items: [
      {
        name: 'অর্গানিক চিয়া সিড (Chia Seeds)',
        quantity: '1টি',
        price: '৳450',
        weight: '250g',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'কালোজিরা তেল (Black Seed Oil)',
        quantity: '1টি',
        price: '৳400',
        weight: '100ml',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80',
      }
    ]
  },
  {
    id: '#DF-10058',
    rawId: 'DF-10058',
    status: 'ডেলিভারি সম্পন্ন',
    date: 'Jul 28, 2025 01:45 PM',
    amount: 2450,
    paymentMethod: 'bKash (Paid)',
    courierId: 'STDF-10058',
    items: [
      {
        name: 'রোস্টেড মিক্সড নাটস (Premium Nuts)',
        quantity: '2টি',
        price: '৳1900',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1536591375698-356403855027?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'সুন্দরবনের খলিশা ফুলের মধু',
        quantity: '1টি',
        price: '৳550',
        weight: '250g',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80',
      }
    ]
  },
  {
    id: '#DF-10049',
    rawId: 'DF-10049',
    status: 'ডেলিভারি সম্পন্ন',
    date: 'Jun 14, 2025 05:30 PM',
    amount: 1400,
    paymentMethod: 'bKash (Paid)',
    courierId: 'STDF-10049',
    items: [
      {
        name: 'খাঁটি নারিকেল তেল (Cold Pressed)',
        quantity: '2টি',
        price: '৳900',
        weight: '500ml',
        image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'মদিনা মরিয়ম খেজুর',
        quantity: '1টি',
        price: '৳500',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=150&q=80',
      }
    ]
  },
  {
    id: '#DF-10034',
    rawId: 'DF-10034',
    status: 'ডেলিভারি সম্পন্ন',
    date: 'May 04, 2025 10:15 AM',
    amount: 980,
    paymentMethod: 'Cash on Delivery',
    courierId: 'STDF-10034',
    items: [
      {
        name: 'সুন্দরবনের খাঁটি মধু',
        quantity: '1টি',
        price: '৳650',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'সরিষার তেল',
        quantity: '1টি',
        price: '৳330',
        weight: '500ml',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=150&q=80',
      }
    ]
  },
  {
    id: '#DF-10021',
    rawId: 'DF-10021',
    status: 'ডেলিভারি সম্পন্ন',
    date: 'Mar 22, 2025 02:40 PM',
    amount: 1650,
    paymentMethod: 'bKash (Paid)',
    courierId: 'STDF-10021',
    items: [
      {
        name: 'প্রিমিয়াম দেশি ঘি',
        quantity: '1টি',
        price: '৳1150',
        weight: '500g',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=150&q=80',
      },
      {
        name: 'মদিনার প্রিমিয়াম আজওয়া খেজুর',
        quantity: '1টি',
        price: '৳500',
        weight: '250g',
        image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=150&q=80',
      }
    ]
  }
];

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  onBackToStore,
  onOpenAdmin,
  onLogout,
  onLiveTrack,
  onReorder,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses'>('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    return user.savedAddresses && user.savedAddresses.length > 0 
      ? user.savedAddresses 
      : [
          {
            id: 'addr-1',
            title: 'বাসা (Home)',
            name: user.name,
            phone: user.phone,
            address: user.address || 'House 24, Road 7, Sector 4, Uttara, Dhaka-1230',
            cityArea: 'Inside City',
            isDefault: true,
          },
          {
            id: 'addr-2',
            title: 'অফিস (Office)',
            name: user.name,
            phone: user.phone,
            address: 'Concord Tower, Level 5, Plot 14, Gulshan-2, Dhaka-1212',
            cityArea: 'Inside City',
            isDefault: false,
          }
        ];
  });

  // New address form state
  const [newTitle, setNewTitle] = useState('বাসা (Home)');
  const [newName, setNewName] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [newAddressText, setNewAddressText] = useState('');
  const [newCityArea, setNewCityArea] = useState<'Inside City' | 'Outside City'>('Inside City');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    const added = addSavedAddress(user.id, {
      title: newTitle,
      name: newName || user.name,
      phone: newPhone || user.phone,
      address: newAddressText.trim(),
      cityArea: newCityArea,
      isDefault: addresses.length === 0,
    });

    setAddresses(prev => [...prev, added]);
    setIsAddingAddress(false);
    setNewAddressText('');
  };

  const handleDeleteAddress = (id: string) => {
    deleteSavedAddress(user.id, id);
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c241b] flex flex-col font-sans pb-16">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>হোম পেজে ফিরে যান</span>
            </button>

            <a 
              href="#"
              onClick={(e) => { e.preventDefault(); onBackToStore(); }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center font-bold text-amber-300 text-sm">
                SB
              </div>
              <span className="font-display font-bold text-base text-stone-900 hidden sm:inline">
                Shuddho<span className="text-emerald-700">Bazar</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>এডমিন প্যানেল</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 w-full flex-1">
        {/* Top Profile Card (Matches User Uploaded Screenshot Exactly) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Dark Forest Green Square with Bengali Letter 'ম' */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#14281e] flex items-center justify-center text-amber-300 font-extrabold text-2xl sm:text-3xl shadow-sm shrink-0 border border-stone-900/10">
              ম
            </div>

            <div className="min-w-0">
              <h1 className="font-display font-black text-xl sm:text-2xl text-stone-950 leading-tight">
                {user.name || 'মো. ওমর ফারুক'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
                {user.phone || '01842078717'} • {user.email || 'faruqdeveloper@gmail.com'}
              </p>
              <p className="text-xs text-stone-400 mt-1 font-normal">
                নিবন্ধিত গ্রাহক • সদস্য: {user.joinedDate || '১৫ জানুয়ারি, ২০২৪'}
              </p>
            </div>
          </div>

          {/* Action Buttons in Card */}
          <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-auto justify-end">
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <LayoutGrid className="w-4 h-4 text-indigo-600" />
              <span>এডমিন প্যানেল</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-stone-50 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-stone-500" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Matches Screenshot) */}
        <div className="flex items-center gap-3 pt-2">
          {/* Active Tab: পূর্বের অর্ডার হিস্টোরি (7) */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#1c3327] text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>পূর্বের অর্ডার হিস্টোরি ({MOCK_PROFILE_ORDERS.length})</span>
          </button>

          {/* Inactive Tab: সংরক্ষিত ঠিকানা সমূহ */}
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-[#1c3327] text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>সংরক্ষিত ঠিকানা সমূহ</span>
          </button>
        </div>

        {/* TAB 1: পূর্বের অর্ডার সমূহ (Matches Screenshot) */}
        {activeTab === 'orders' && (
          <div className="space-y-4 pt-2">
            <h2 className="font-display font-extrabold text-lg sm:text-xl text-stone-900">
              আপনার পূর্বের অর্ডার সমূহ
            </h2>

            <div className="space-y-4">
              {MOCK_PROFILE_ORDERS.map((order) => (
                <div 
                  key={order.id}
                  className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-colors"
                >
                  {/* Top Row: Order ID, Status, Date, Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-display font-black text-lg sm:text-xl text-stone-900 tracking-tight">
                          {order.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1 font-medium">
                        {order.date}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-display font-black text-xl text-stone-900">
                        ৳ {order.amount}
                      </p>
                      <p className="text-xs font-semibold text-emerald-700">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Middle Row: Items Thumbnails & Details */}
                  <div className="flex flex-wrap items-center gap-3">
                    {order.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-2.5 bg-stone-50/80 rounded-2xl border border-stone-200/70 min-w-[200px] sm:min-w-[240px]"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-stone-500 font-medium">
                            {item.quantity} • {item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row: Courier ID & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
                    <div className="text-xs text-stone-700">
                      <span>কুরিয়ার আইডি: </span>
                      <strong className="text-emerald-800 font-extrabold font-mono text-sm">
                        {order.courierId}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => onLiveTrack(order.rawId)}
                        className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        <span>লাইভ ট্র্যাক</span>
                      </button>

                      <button
                        onClick={() => onReorder(order)}
                        className="px-4 py-2 rounded-xl bg-[#1c3327] hover:bg-[#14281e] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                        <span>পুনরায় অর্ডার</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: সংরক্ষিত ঠিকানা সমূহ (Saved Addresses) */}
        {activeTab === 'addresses' && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-lg sm:text-xl text-stone-900">
                  সংরক্ষিত ঠিকানা সমূহ
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  চেকআউটে দ্রুত অর্ডারের জন্য আপনার পছন্দমতো ঠিকানা সংরক্ষণ করে রাখুন
                </p>
              </div>

              {!isAddingAddress && (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ঠিকানা যোগ করুন</span>
                </button>
              )}
            </div>

            {/* Add Address Form Modal/Card */}
            {isAddingAddress && (
              <form 
                onSubmit={handleAddAddress}
                className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-emerald-600/30 shadow-sm space-y-4 animate-in fade-in"
              >
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-bold text-sm text-stone-900">নতুন ডেলিভারি ঠিকানা যোগ করুন</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    বাতিল
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">ঠিকানার নাম (Tag)</label>
                    <select
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800"
                    >
                      <option value="বাসা (Home)">বাসা (Home)</option>
                      <option value="অফিস (Office)">অফিস (Office)</option>
                      <option value="অন্যান্য (Other)">অন্যান্য (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">প্রাপকের নাম</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">মোবাইল নম্বর</label>
                    <input
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">ডেলিভারি এরিয়া</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className={`p-2 rounded-xl border cursor-pointer text-center ${newCityArea === 'Inside City' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 bg-stone-50 text-stone-600'}`}>
                        <input
                          type="radio"
                          name="newArea"
                          className="sr-only"
                          checked={newCityArea === 'Inside City'}
                          onChange={() => setNewCityArea('Inside City')}
                        />
                        <span>শহরের ভেতরে (৳৭০)</span>
                      </label>
                      <label className={`p-2 rounded-xl border cursor-pointer text-center ${newCityArea === 'Outside City' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 bg-stone-50 text-stone-600'}`}>
                        <input
                          type="radio"
                          name="newArea"
                          className="sr-only"
                          checked={newCityArea === 'Outside City'}
                          onChange={() => setNewCityArea('Outside City')}
                        />
                        <span>শহরের বাইরে (৳১৩০)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">পূর্ণাঙ্গ ঠিকানা *</label>
                  <textarea
                    rows={2}
                    required
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, এলাকা, থানা, জেলা..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>ঠিকানা সংরক্ষণ করুন</span>
                </button>
              </form>
            )}

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div 
                  key={addr.id}
                  className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
                        {addr.title.includes('অফিস') ? <Briefcase className="w-4 h-4" /> : <Home className="w-4 h-4" />}
                      </span>
                      <span className="font-bold text-sm text-stone-900">{addr.title}</span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          ডিফল্ট
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="ঠিকানা মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <p className="font-semibold text-stone-800">{addr.name} ({addr.phone})</p>
                    <p className="text-stone-700 leading-relaxed">{addr.address}</p>
                    <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                      {addr.cityArea === 'Outside City' ? 'শহরের বাইরে ডেলিভারি (৳১৩০)' : 'শহরের ভেতরে ডেলিভারি (৳৭০)'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
