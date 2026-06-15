'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestGeolocation } from '@/lib/geo';
import { useRouter } from 'next/navigation';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AppContextType {
  user: UserProfile | null;
  cart: CartItem[];
  isLoading: boolean;
  addToCart: (product: { _id: string; name: string; price: number; image: string; stock: number }, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkUserSession: () => Promise<void>;
  // UI settings
  globalPreviewEnabled: boolean;
  setGlobalPreviewEnabled: (v: boolean) => void;
  allowGeolocation: boolean;
  setAllowGeolocation: (v: boolean) => void;
  clearPinnedPreviews: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalPreviewEnabled, setGlobalPreviewEnabled] = useState<boolean>(true);
  const [allowGeolocation, setAllowGeolocation] = useState<boolean>(true);
  const [regionCode, setRegionCode] = useState<string | null>(null);
  const router = useRouter();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart data from localStorage', e);
      }
    }
    checkUserSession();
    try {
      const raw = localStorage.getItem('globalPreviewEnabled');
      setGlobalPreviewEnabled(raw === null ? true : raw === '1');
    } catch {}
    try {
      const raw2 = localStorage.getItem('allowGeolocation');
      setAllowGeolocation(raw2 === null ? true : raw2 === '1');
    } catch {}
    try {
      const rc = localStorage.getItem('regionCode');
      if (rc) setRegionCode(rc);
    } catch {}
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const checkUserSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Failed to retrieve user session:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: { _id: string; name: string; price: number; image: string; stock: number }, quantity = 1) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.productId === product._id);
      
      if (existingIdx > -1) {
        const newQty = Math.min(prevCart[existingIdx].quantity + quantity, product.stock);
        const newCart = [...prevCart];
        newCart[existingIdx] = { ...newCart[existingIdx], quantity: newQty };
        return newCart;
      } else {
        const safeQty = Math.min(quantity, product.stock);
        if (safeQty <= 0) return prevCart;
        return [...prevCart, {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: safeQty
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        router.refresh();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to login' };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'An error occurred' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        router.refresh();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to register' };
      }
    } catch (e: any) {
      return { success: false, error: e.message || 'An error occurred' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      clearCart();
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const clearPinnedPreviews = () => {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('previewPinned_')) keys.push(k);
      }
      keys.forEach((k) => localStorage.removeItem(k));
      // notify UI
      window.dispatchEvent(new CustomEvent('pinnedPreviewsCleared'));
    } catch (e) {
      console.error('Failed to clear pinned previews', e);
    }
  };

  // Resolve region code using geolocation => server-side geocode endpoint
  const resolveRegionWithGeolocation = async () => {
    if (!allowGeolocation) return null;
    try {
      const pos = await requestGeolocation();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const res = await fetch(`/api/geocode?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data?.countryCode) {
        setRegionCode(data.countryCode);
        try { localStorage.setItem('regionCode', data.countryCode); } catch {}
        return data.countryCode;
      }
    } catch (e) {
      // ignore
    }
    return null;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        login,
        register,
        logout,
        checkUserSession,
        globalPreviewEnabled,
        setGlobalPreviewEnabled: (v: boolean) => {
          try { localStorage.setItem('globalPreviewEnabled', v ? '1' : '0'); } catch {}
          setGlobalPreviewEnabled(v);
          try { window.dispatchEvent(new CustomEvent('globalPreviewToggle', { detail: v })); } catch {}
        },
        allowGeolocation,
        setAllowGeolocation: (v: boolean) => {
          try { localStorage.setItem('allowGeolocation', v ? '1' : '0'); } catch {}
          setAllowGeolocation(v);
        },
        regionCode,
        resolveRegionWithGeolocation,
        clearPinnedPreviews,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
