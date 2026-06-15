"use client";

import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Eye, Star, Pin } from 'lucide-react';
import { Product } from '@/lib/fakestore';
import { formatPrice } from '@/lib/currency';
import { useRef, useState, useEffect } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useApp();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [previewLeft, setPreviewLeft] = useState(false);
  const [pinned, setPinned] = useState(false);

  const computePreviewSide = () => {
    if (!cardRef.current || typeof window === 'undefined') return;
    const rect = cardRef.current.getBoundingClientRect();
    const previewWidth = 360; // preview + margin
    const buffer = 28; // keep some breathing room
    if (rect.right + previewWidth + buffer > window.innerWidth) {
      setPreviewLeft(true);
    } else {
      setPreviewLeft(false);
    }
  };

  useEffect(() => {
    computePreviewSide();
    const onResize = () => computePreviewSide();
    window.addEventListener('resize', onResize);
    // load pinned state from localStorage
    try {
      const raw = localStorage.getItem(`previewPinned_${product._id}`);
      if (raw === '1') setPinned(true);
    } catch {}

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(`previewPinned_${product._id}`, pinned ? '1' : '0');
    } catch {}
  }, [pinned, product._id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
  };

  const stars = Math.round(product.rating);

  const { globalPreviewEnabled, allowGeolocation, regionCode, resolveRegionWithGeolocation } = useApp();
  const [region, setRegion] = useState<string | null>(() => {
    try { return localStorage.getItem('regionCode'); } catch { return null; }
  });

  // Attempt to resolve region once using centralized resolver
  useEffect(() => {
    if (region) return;
    if (!allowGeolocation) return;
    let mounted = true;
    (async () => {
      try {
        const cc = await resolveRegionWithGeolocation();
        if (mounted && cc) setRegion(cc);
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [allowGeolocation, region, resolveRegionWithGeolocation]);

  // Product previews controlled by global setting from AppContext

  const shippingEstimate = (() => {
    if (product.stock === 0) return 'Backordered — contact support';
    // quick region-based heuristic
    const fast = ['US', 'CA', 'GB'];
    const eu = ['DE','FR','ES','IT','NL','BE','SE','NO','DK','FI','AT','IE','PT','PL','CZ','HU'];
    const r = region ? region.toUpperCase() : null;
    if (r && fast.includes(r)) return 'Ships in 1–3 days';
    if (r && eu.includes(r)) return 'Ships in 2–5 days';
    return 'Ships in 5–10 days';
  })();
  const sku = product._id;

  return (
    <div ref={cardRef} className="card product-card" onMouseEnter={computePreviewSide} onFocus={computePreviewSide}>
      <Link href={`/products/${product._id}`} style={{ display: 'block', flex: 1 }}>
        <div className="product-card-image-wrapper" style={{ backgroundColor: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', border: '1px solid rgba(207,158,255,0.06)' }}>
          {/* Category badge */}
          <span className="badge badge-primary product-card-badge" style={{ textTransform: 'capitalize', fontSize: '0.65rem' }}>
            {product.category}
          </span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
          />
        </div>
        <div className="product-card-content">
          <h3 className="product-card-title" style={{ fontSize: '0.95rem' }}>
            {product.name.length > 60 ? `${product.name.substring(0, 57)}...` : product.name}
          </h3>

          {/* Star Rating */}
          <div className="flex align-center gap-1" style={{ marginBottom: '0.5rem' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < stars ? '#f59e0b' : 'transparent'}
                color={i < stars ? '#f59e0b' : 'rgba(207,158,255,0.3)'}
              />
            ))}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
              ({product.ratingCount})
            </span>
          </div>

          <p className="product-card-desc">
            {product.description.length > 80
              ? `${product.description.substring(0, 77)}...`
              : product.description}
          </p>
        </div>
      </Link>

      {/* Hover preview panel (desktop) */}
      {(globalPreviewEnabled || pinned) && (
        <div className={`hover-preview ${previewLeft ? 'preview-left' : ''} ${pinned ? 'pinned' : ''}`} role="dialog" aria-hidden={(!pinned).toString()}>
        <button
          className={`hp-pin ${pinned ? 'pinned' : ''}`}
          aria-pressed={pinned}
          title={pinned ? 'Unpin preview' : 'Pin preview'}
          onClick={(e) => { e.stopPropagation(); setPinned((p) => !p); }}
        >
          <Pin size={14} style={{ color: pinned ? 'var(--primary)' : 'var(--text-secondary)' }} />
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
          <div className="hp-title">{product.name.length > 40 ? `${product.name.substring(0, 37)}...` : product.name}</div>
          <div className="hp-price">{formatPrice(product.price)}</div>
        </div>
        <div className="hp-desc">{product.description.length > 120 ? `${product.description.substring(0, 117)}...` : product.description}</div>
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.6rem', alignItems: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>SKU:</strong> {sku}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}><strong>Stock:</strong> {product.stock}</div>
        </div>
        <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{shippingEstimate}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < stars ? '#f59e0b' : 'transparent'}
              color={i < stars ? '#f59e0b' : 'rgba(207,158,255,0.3)'}
            />
          ))}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({product.ratingCount})</span>
        </div>

        <div className="hp-actions">
          <button onClick={handleAddToCart} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            <ShoppingCart size={14} /> Add
          </button>
          <Link href={`/products/${product._id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={14} />
          </Link>
        </div>
      </div>
      )}

      <div className="product-card-footer">
        <span className="product-card-price">{formatPrice(product.price)}</span>
        <div className="flex gap-1">
          <Link
            href={`/products/${product._id}`}
            className="btn btn-outline btn-sm"
            title="View Details"
            style={{ padding: '0.5rem' }}
          >
            <Eye size={16} />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn btn-primary btn-sm flex align-center gap-1"
          >
            <ShoppingCart size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
