import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  LogOut, 
  Edit3, 
  Check, 
  Sparkles, 
  Clock, 
  Truck, 
  ShieldCheck,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { CustomerUser, Order } from '../types';
import { updateProfile, formatDisplayPhone } from '../services/authService';
import { formatBdt } from './BdtPrice';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: CustomerUser;
  onUpdateUser: (updated: CustomerUser) => void;
  onLogout: () => void;
  userOrders: Order[];
  onTrackOrder: (orderId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  userOrders,
  onTrackOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [editName, setEditName] = useState(user.name);
  const [editAddress, setEditAddress] = useState(user.address || '');
  const [editCityArea, setEditCityArea] = useState<'Inside City' | 'Outside City'>(user.cityArea || 'Inside City');
  const [editEmail, setEditEmail] = useState(user.email || '');

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateProfile(user.id, {
      name: editName,
      address: editAddress,
      cityArea: editCityArea,
      email: editEmail,
    });
    if (updated) {
      onUpdateUser(updated);
      setIsEditing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} 
              alt={user.name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white/80 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-white truncate">
                  {user.name}
                </h3>
                <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full shrink-0">
                  ভেরিফাইড মেম্বার
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-amber-300" />
                <span>+880 {formatDisplayPhone(user.phone)}</span>
              </p>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-emerald-700/60">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'bg-emerald-950/40 text-emerald-100 hover:bg-emerald-950/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>প্রোফাইল তথ্য (Profile)</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'bg-emerald-950/40 text-emerald-100 hover:bg-emerald-950/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>আমার অর্ডারসমূহ ({userOrders.length})</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Member stats bar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-amber-800 text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>পিওরিটি রিওয়ার্ড পয়েন্ট</span>
                  </div>
                  <p className="text-xl font-extrabold text-stone-900 mt-1">
                    {user.loyaltyPoints || 100} <span className="text-xs font-medium text-stone-500">পয়েন্ট</span>
                  </p>
                </div>
                <div className="bg-emerald-50/70 border border-emerald-200/80 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>মোট সফল অর্ডার</span>
                  </div>
                  <p className="text-xl font-extrabold text-stone-900 mt-1">
                    {(user.totalOrders || 0) + userOrders.length} <span className="text-xs font-medium text-stone-500">টি</span>
                  </p>
                </div>
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-700">ডিফল্ট ডেলিভারি তথ্য</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>পরিবর্তন করুন</span>
                      </button>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1.5">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="text-stone-800 font-medium">{user.address || 'কোনো ঠিকানা যুক্ত করা নেই'}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>এলাকা: <strong className="text-stone-800">{user.cityArea === 'Outside City' ? 'শহরের বাইরে (৳১৩০)' : 'শহরের ভেতরে (৳৭০)'}</strong></span>
                      </p>
                      {user.email && (
                        <p className="text-[11px] text-stone-500">ইমেইল: {user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-50/60 rounded-xl border border-stone-200/60 flex items-center justify-between text-xs text-stone-500">
                    <span>যোগদানের তারিখ:</span>
                    <span className="font-semibold text-stone-700">{user.joinedDate || 'Recent'}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-800">প্রোফাইল এডিট করুন</span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      বাতিল
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">নাম</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">ঠিকানা</label>
                    <textarea
                      rows={2}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">ডেলিভারি এরিয়া</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className={`p-2 rounded-xl border cursor-pointer text-center ${editCityArea === 'Inside City' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 bg-white text-stone-600'}`}>
                        <input
                          type="radio"
                          name="editArea"
                          className="sr-only"
                          checked={editCityArea === 'Inside City'}
                          onChange={() => setEditCityArea('Inside City')}
                        />
                        <span>Inside City</span>
                      </label>
                      <label className={`p-2 rounded-xl border cursor-pointer text-center ${editCityArea === 'Outside City' ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-bold' : 'border-stone-200 bg-white text-stone-600'}`}>
                        <input
                          type="radio"
                          name="editArea"
                          className="sr-only"
                          checked={editCityArea === 'Outside City'}
                          onChange={() => setEditCityArea('Outside City')}
                        />
                        <span>Outside City</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </form>
              )}

              {/* Logout button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-2xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>লগআউট করুন (Logout)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-stone-700">এখনো কোনো অর্ডার করা হয়নি</p>
                  <p className="text-[11px] text-stone-400">খাঁটি ও প্রাকৃতিক পণ্য অর্ডার করুন এবং পয়েন্ট অর্জন করুন</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div 
                    key={ord.id}
                    className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 hover:border-emerald-300 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-stone-900">অর্ডার {ord.id}</span>
                        <p className="text-[10px] text-stone-400">{ord.date}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <span>{ord.items.length} টি আইটেম • {formatBdt(ord.total)}</span>
                      <button
                        onClick={() => {
                          onTrackOrder(ord.id);
                          onClose();
                        }}
                        className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>ট্র্যাক করুন</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
