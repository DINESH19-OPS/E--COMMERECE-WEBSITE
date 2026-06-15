'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { formatPrice, convertToINR } from '@/lib/currency';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, user } = useApp();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 12600 || subtotal === 0 ? 0 : 1260;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container flex flex-col align-center justify-center" style={{ minHeight: '60vh', textAlign: 'center', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--border)', borderRadius: '50%', color: 'var(--text-muted)', display: 'inline-flex' }}>
          <ShoppingCart size={36} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Looks like you haven&apos;t added any premium gear to your cart yet.
          </p>
        </div>
        <Link href="/products" className="btn btn-primary btn-sm flex align-center gap-1">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h1>

      <div className="flex flex-row flex-row-mobile-stack gap-4">
        {/* Left Column: Cart Items List */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th style={{ textAlign: 'center' }}>Quantity</th>
                  <th>Total</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.productId}>
                    <td>
                      <div className="flex align-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }}
                        />
                        <Link href={`/products/${item.productId}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="flex align-center justify-center gap-1" style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="btn btn-outline"
                          style={{ border: 'none', padding: '0.25rem 0.5rem', minWidth: 'unset', height: 'unset' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ minWidth: '24px', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="btn btn-outline"
                          style={{ border: 'none', padding: '0.25rem 0.5rem', minWidth: 'unset', height: 'unset' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.4rem', border: 'none', color: 'var(--error)' }}
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <Link href="/products" className="flex align-center gap-1" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div style={{ flex: 1 }}>
          <div className="summary-box">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : formatPrice(shipping)}
              </span>
            </div>
            
            {shipping > 0 && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '-0.5rem' }}>
                💡 Add <strong>{formatPrice(12600 - subtotal)}</strong> more for Free Shipping!
              </p>
            )}

            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              {user ? (
                <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                    Login to Checkout <ArrowRight size={18} />
                  </Link>
                  <p style={{ fontSize: '0.8rem', color: 'var(--warning)', textAlign: 'center', fontWeight: 500 }}>
                    🔒 Authentication required to place order.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
