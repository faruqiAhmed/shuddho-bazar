import { CustomerUser, SavedAddress } from '../types';

const AUTH_USER_KEY = 'shuddho_auth_user';
const CUSTOMERS_DB_KEY = 'shuddho_customers_db';
const OTP_STORAGE_KEY = 'shuddho_current_otp';

// Pre-seeded customers matching user profile screenshot
const DEFAULT_CUSTOMERS: CustomerUser[] = [
  {
    id: 'CUST-FARUQ',
    name: 'মো. ওমর ফারুক',
    phone: '01842078717',
    email: 'faruqdeveloper@gmail.com',
    address: 'House 24, Road 7, Sector 4, Uttara, Dhaka-1230',
    cityArea: 'Inside City',
    totalOrders: 7,
    loyaltyPoints: 480,
    joinedDate: '১৫ জানুয়ারি, ২০২৪',
    avatar: '', // will render Bengali initial 'ম' matching screenshot
    savedAddresses: [
      {
        id: 'addr-1',
        title: 'বাসা (Home)',
        name: 'মো. ওমর ফারুক',
        phone: '01842078717',
        address: 'House 24, Road 7, Sector 4, Uttara, Dhaka-1230',
        cityArea: 'Inside City',
        isDefault: true,
      },
      {
        id: 'addr-2',
        title: 'অফিস (Office)',
        name: 'মো. ওমর ফারুক',
        phone: '01842078717',
        address: 'Concord Tower, Level 5, Plot 14, Gulshan-2, Dhaka-1212',
        cityArea: 'Inside City',
        isDefault: false,
      }
    ]
  },
  {
    id: 'CUST-01',
    name: 'ফারহান করিম',
    phone: '01712345678',
    email: 'farhan.karim@gmail.com',
    address: 'House 12, Road 4, Sector 3, Uttara, Dhaka-1230',
    cityArea: 'Inside City',
    totalOrders: 14,
    loyaltyPoints: 340,
    joinedDate: 'Jan 15, 2025',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    savedAddresses: []
  },
  {
    id: 'CUST-02',
    name: 'সাবিনা আক্তার',
    phone: '01823456789',
    email: 'sabina.akter@example.com',
    address: 'Flat 4B, Green Road, Dhanmondi, Dhaka',
    cityArea: 'Inside City',
    totalOrders: 6,
    loyaltyPoints: 120,
    joinedDate: 'Feb 10, 2025',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    savedAddresses: []
  },
  {
    id: 'CUST-03',
    name: 'মো. সাইফুল ইসলাম',
    phone: '01911223344',
    email: 'saiful.islam@example.com',
    address: 'Plot 18, Block D, Bashundhara R/A, Dhaka',
    cityArea: 'Inside City',
    totalOrders: 22,
    loyaltyPoints: 680,
    joinedDate: 'Nov 04, 2024',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    savedAddresses: []
  }
];

export interface StoredOtp {
  phone: string;
  code: string;
  expiresAt: number;
}

// Clean phone to 11 digits: e.g. "01712345678"
export const normalizePhone = (raw: string): string => {
  let cleaned = raw.replace(/\D/g, '');
  if (cleaned.startsWith('880')) {
    cleaned = cleaned.substring(2);
  }
  if (!cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
};

// Format phone for nice UI display: "01712-345678"
export const formatDisplayPhone = (raw: string): string => {
  const norm = normalizePhone(raw);
  if (norm.length === 11) {
    return `${norm.slice(0, 5)}-${norm.slice(5)}`;
  }
  return raw;
};

// Detect Bangladesh mobile operator
export const getOperator = (phone: string): { name: string; color: string; badge: string } => {
  const norm = normalizePhone(phone);
  const prefix = norm.substring(0, 3);
  switch (prefix) {
    case '017':
    case '013':
      return { name: 'Grameenphone', color: 'text-sky-600 bg-sky-50 border-sky-200', badge: 'GP' };
    case '018':
      return { name: 'Robi', color: 'text-red-600 bg-red-50 border-red-200', badge: 'Robi' };
    case '019':
    case '014':
      return { name: 'Banglalink', color: 'text-amber-600 bg-amber-50 border-amber-200', badge: 'BL' };
    case '015':
      return { name: 'Teletalk', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', badge: 'Teletalk' };
    case '016':
      return { name: 'Airtel', color: 'text-rose-600 bg-rose-50 border-rose-200', badge: 'Airtel' };
    default:
      return { name: 'Bangladesh', color: 'text-stone-600 bg-stone-50 border-stone-200', badge: 'BD' };
  }
};

export const getStoredCustomers = (): CustomerUser[] => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_DB_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(DEFAULT_CUSTOMERS));
      return DEFAULT_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CUSTOMERS;
  }
};

export const saveCustomers = (customers: CustomerUser[]) => {
  try {
    localStorage.setItem(CUSTOMERS_DB_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error(e);
  }
};

// Current logged in user
export const getCurrentUser = (): CustomerUser | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      // Default to Omar Faruq for instant seamless preview matching user's account
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(DEFAULT_CUSTOMERS[0]));
      return DEFAULT_CUSTOMERS[0];
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CUSTOMERS[0];
  }
};

export const setCurrentUser = (user: CustomerUser | null) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  } catch (e) {
    console.error(e);
  }
};

export const addSavedAddress = (userId: string, newAddr: Omit<SavedAddress, 'id'>): SavedAddress => {
  const customers = getStoredCustomers();
  const address: SavedAddress = {
    ...newAddr,
    id: `addr-${Date.now()}`,
  };

  const updatedCustomers = customers.map(c => {
    if (c.id === userId) {
      const addresses = c.savedAddresses || [];
      const updatedAddrs = address.isDefault
        ? [...addresses.map(a => ({ ...a, isDefault: false })), address]
        : [...addresses, address];
      return {
        ...c,
        savedAddresses: updatedAddrs,
      };
    }
    return c;
  });

  saveCustomers(updatedCustomers);
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedUser = updatedCustomers.find(c => c.id === userId);
    if (updatedUser) setCurrentUser(updatedUser);
  }

  return address;
};

export const deleteSavedAddress = (userId: string, addressId: string) => {
  const customers = getStoredCustomers();
  const updatedCustomers = customers.map(c => {
    if (c.id === userId) {
      const addresses = (c.savedAddresses || []).filter(a => a.id !== addressId);
      return {
        ...c,
        savedAddresses: addresses,
      };
    }
    return c;
  });

  saveCustomers(updatedCustomers);
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedUser = updatedCustomers.find(c => c.id === userId);
    if (updatedUser) setCurrentUser(updatedUser);
  }
};


// Generate and send OTP (simulated SMS)
export const requestOtp = (rawPhone: string): { success: boolean; code: string; message: string; isNewUser: boolean } => {
  const normPhone = normalizePhone(rawPhone);
  if (!normPhone || normPhone.length !== 11 || !normPhone.startsWith('01')) {
    return {
      success: false,
      code: '',
      message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)',
      isNewUser: false,
    };
  }

  // Generate 4-digit code (realistic e-commerce SMS OTP)
  // For demo convenience, deterministic or easy to test
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

  const otpData: StoredOtp = {
    phone: normPhone,
    code,
    expiresAt,
  };

  try {
    localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(otpData));
  } catch (e) {
    console.error(e);
  }

  const customers = getStoredCustomers();
  const existing = customers.find(c => normalizePhone(c.phone) === normPhone);

  return {
    success: true,
    code,
    message: `আপনার নম্বরে (${formatDisplayPhone(normPhone)}) ওটিপি কোড পাঠানো হয়েছে`,
    isNewUser: !existing,
  };
};

export const getLatestOtp = (): StoredOtp | null => {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Verify OTP
export const verifyOtp = (
  rawPhone: string, 
  inputCode: string,
  extraDetails?: { name?: string; address?: string; cityArea?: 'Inside City' | 'Outside City' }
): { success: boolean; user?: CustomerUser; error?: string } => {
  const normPhone = normalizePhone(rawPhone);
  const otpData = getLatestOtp();

  // Accept generated OTP or universal testing passcode '1234'
  const isMatch = (otpData && otpData.phone === normPhone && otpData.code === inputCode) || inputCode === '1234';

  if (!isMatch) {
    return {
      success: false,
      error: 'ভুল ওটিপি কোড! অনুগ্রহ করে পুনরায় চেষ্টা করুন (বা টেস্ট কোড 1234 ব্যবহার করুন)।',
    };
  }

  const customers = getStoredCustomers();
  let user = customers.find(c => normalizePhone(c.phone) === normPhone);

  if (!user) {
    // Register new user
    user = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: extraDetails?.name || 'সম্মানিত গ্রাহক',
      phone: normPhone,
      address: extraDetails?.address || 'Dhaka, Bangladesh',
      cityArea: extraDetails?.cityArea || 'Inside City',
      totalOrders: 0,
      loyaltyPoints: 50, // Welcome loyalty points bonus!
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    };
    customers.push(user);
    saveCustomers(customers);
  } else if (extraDetails?.name || extraDetails?.address) {
    // Update existing customer info if provided
    user = {
      ...user,
      name: extraDetails.name || user.name,
      address: extraDetails.address || user.address,
      cityArea: extraDetails.cityArea || user.cityArea,
    };
    const updated = customers.map(c => c.id === user?.id ? user! : c);
    saveCustomers(updated);
  }

  setCurrentUser(user);
  localStorage.removeItem(OTP_STORAGE_KEY);

  return {
    success: true,
    user,
  };
};

export const updateProfile = (userId: string, updates: Partial<CustomerUser>): CustomerUser | null => {
  const customers = getStoredCustomers();
  let updatedUser: CustomerUser | null = null;
  const updatedList = customers.map(c => {
    if (c.id === userId) {
      updatedUser = { ...c, ...updates };
      return updatedUser;
    }
    return c;
  });

  if (updatedUser) {
    saveCustomers(updatedList);
    setCurrentUser(updatedUser);
  }
  return updatedUser;
};

export const logoutUser = () => {
  setCurrentUser(null);
};

export const getDemoAccounts = (): CustomerUser[] => {
  return DEFAULT_CUSTOMERS;
};
