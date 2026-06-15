'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductType {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

export default function AddToCartArea({ product }: { product: ProductType }) {
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div className="flex flex-col gap-3" style={{ maxWidth: '300px' }}>
        
        {product.stock > 0 && (
          <div className="flex align-center gap-2">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Quantity:</span>
            <div className="flex align-center" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button 
                type="button" 
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="btn btn-outline"
                style={{ border: 'none', borderRadius: 0, padding: '0.5rem 0.75rem', backgroundColor: 'transparent' }}
              >
                <Minus size={14} />
              </button>
              
              <span style={{ width: '40px', textAlign: 'center', fontWeight: 600 }}>
                {quantity}
              </span>
              
              <button 
                type="button" 
                onClick={handleIncrement}
                disabled={quantity >= product.stock}
                className="btn btn-outline"
                style={{ border: 'none', borderRadius: 0, padding: '0.5rem 0.75rem', backgroundColor: 'transparent' }}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2" style={{ marginTop: '0.5rem' }}>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="btn btn-primary"
            style={{ flex: 1, gap: '0.5rem' }}
          >
            <ShoppingCart size={18} />
            {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p style={{ fontSize: '0.85rem', color: 'var(--warning)', fontWeight: 500 }}>
            ⚠️ Only {product.stock} items left in stock. Order soon!
          </p>
        )}
      </div>

      <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <Link href="/products" className="flex align-center gap-1" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    </div>
  );
}
