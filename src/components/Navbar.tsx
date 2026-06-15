'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import { ShoppingCart, LogOut, LayoutDashboard, History, LogIn, ShoppingBag, User, Sun, Moon, Eye, Settings as SettingsIcon } from 'lucide-react';
import SettingsModal from './SettingsModal';

export default function Navbar() {
  const pathname = usePathname();
  const { user, cart, logout } = useApp();

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { globalPreviewEnabled } = useApp();
  const [globalPreview, setGlobalPreview] = useState<boolean>(globalPreviewEnabled);

  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get('category') || 'all';
  const [categories, setCategories] = useState<string[]>(['peripherals', 'desk-setup', 'audio', 'displays']);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onToggle = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        setGlobalPreview(Boolean(detail));
      };
      window.addEventListener('globalPreviewToggle', onToggle as EventListener);
      return () => window.removeEventListener('globalPreviewToggle', onToggle as EventListener);
    }
  }, []);

  useEffect(() => {
    // fetch live categories for navbar
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) return;
        const data: string[] = await res.json();
        if (!cancelled && Array.isArray(data) && data.length) setCategories(data);
      } catch (e) {
        // ignore and keep fallback categories
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link href="/" className="logo">
          <ShoppingBag size={26} style={{ color: 'var(--primary)' }} />
          <span>VoltStore</span>
        </Link>

        {/* Nav Links */}
        <ul className="nav-links">
          <li>
            <Link href="/products" className={`nav-link ${pathname.startsWith('/products') ? 'active' : ''}`}>
              Shop
            </Link>
          </li>
          {/* categories removed from top nav per UX request */}

          {user && (
            <li>
              <Link href="/orders" className={`nav-link ${pathname === '/orders' ? 'active' : ''}`}>
                <span className="flex align-center gap-1">
                  <History size={15} /> Orders
                </span>
              </Link>
            </li>
          )}

          {user && user.role === 'admin' && (
            <li>
              <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                <span className="flex align-center gap-1" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  <LayoutDashboard size={15} /> Admin
                </span>
              </Link>
            </li>
          )}
        </ul>

        {/* Right Side Actions */}
        <div className="nav-actions flex align-center gap-2">
          {/* Cart */}
          <Link href="/cart" className="cart-icon-container">
            <span className="btn btn-outline btn-sm flex align-center gap-1">
              <ShoppingCart size={17} />
              <span>Cart</span>
              {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
            </span>
          </Link>

          {/* User */}
          {user ? (
            <div className="flex align-center gap-2">
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <User size={14} style={{ color: 'var(--primary)' }} />
                <strong style={{ color: 'var(--text-primary)' }}>{user.name.split(' ')[0]}</strong>
              </span>
              <button
                onClick={logout}
                className="btn btn-outline btn-sm"
                title="Log Out"
                style={{ padding: '0.4rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex align-center gap-2">
              <Link href="/login">
                <span className="btn btn-outline btn-sm flex align-center gap-1">
                  <LogIn size={15} />
                  <span>Login</span>
                </span>
              </Link>
              <Link href="/register">
                <span className="btn btn-primary btn-sm flex align-center gap-1">
                  <User size={14} />
                  <span>Sign Up</span>
                </span>
              </Link>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="btn btn-sm btn-outline"
            title="Toggle theme"
            style={{ marginLeft: '0.25rem', display: 'inline-flex', alignItems: 'center' }}
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          {/* Global Preview Toggle */}
          <button
            onClick={() => {
              const next = !globalPreview;
              setGlobalPreview(next);
              try { localStorage.setItem('globalPreviewEnabled', next ? '1' : '0'); } catch {}
              window.dispatchEvent(new CustomEvent('globalPreviewToggle', { detail: next }));
            }}
            className={`btn btn-sm ${globalPreview ? 'btn-primary' : 'btn-outline'}`}
            title={globalPreview ? 'Disable previews' : 'Enable previews'}
            style={{ marginLeft: '0.25rem', display: 'inline-flex', alignItems: 'center' }}
          >
            <Eye size={14} />
          </button>
          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="btn btn-sm btn-outline"
            title="Settings"
            style={{ marginLeft: '0.25rem', display: 'inline-flex', alignItems: 'center' }}
          >
            <SettingsIcon size={14} />
          </button>
          <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
      </div>
    </nav>
  );
}
