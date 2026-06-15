'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, CreditCard, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, clearCart, user, isLoading } = useApp();
  const router = useRouter();

  // Form State
  const [shippingName, setShippingName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Redirect if not logged in or cart is empty
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (cart.length === 0) {
        router.push('/cart');
      } else {
        // Pre-fill shipping name with user's name
        setShippingName(user.name);
      }
    }
  }, [user, cart, isLoading, router]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shippingName || !address || !city || !zipCode || !country) {
      setError('Please fill in all shipping details.');
      return;
    }

    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      setError('Please fill in all payment details.');
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          shippingAddress: {
            name: shippingName,
            address,
            city,
            zipCode,
            country
          },
          paymentInfo: {
            cardNumber,
            cardHolder
          }
        })
      });

      const data = await res.json();
      setFormLoading(false);

      if (res.ok) {
        clearCart();
        router.push('/orders?success=true');
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (e: any) {
      setFormLoading(false);
      setError(e.message || 'An unexpected error occurred.');
    }
  };

  if (isLoading || !user || cart.length === 0) {
    return (
      <div className="container flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <p>Verifying checkout session...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '2rem' }}>Secure Checkout</h1>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-row flex-row-mobile-stack gap-4">
        {/* Left Column: Checkout Forms */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Shipping Details */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 className="flex align-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <MapPin size={20} style={{ color: 'var(--primary)' }} />
              Shipping Information
            </h2>

            <div className="form-group">
              <label htmlFor="shippingName">Recipient Name</label>
              <input
                id="shippingName"
                type="text"
                className="form-control"
                placeholder="Full Name"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                className="form-control"
                placeholder="Street Address, P.O. Box, Company Name, etc."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-3">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  className="form-control"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  id="zipCode"
                  type="text"
                  className="form-control"
                  placeholder="Zip / Postal Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  type="text"
                  className="form-control"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 className="flex align-center gap-2" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <CreditCard size={20} style={{ color: 'var(--primary)' }} />
              Payment Details (Mock Transaction)
            </h2>

            <div className="form-group">
              <label htmlFor="cardHolder">Name on Card</label>
              <input
                id="cardHolder"
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                id="cardNumber"
                type="text"
                maxLength={16}
                className="form-control"
                placeholder="4111 2222 3333 4444"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="expiry">Expiration Date</label>
                <input
                  id="expiry"
                  type="text"
                  maxLength={5}
                  placeholder="MM/YY"
                  className="form-control"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">Security Code (CVV)</label>
                <input
                  id="cvv"
                  type="password"
                  maxLength={3}
                  placeholder="•••"
                  className="form-control"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Checkout Summary Box */}
        <div style={{ flex: 1 }}>
          <div className="summary-box">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Checkout Summary</h3>

            {/* Cart Items List */}
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cart.map(item => (
                <div key={item.productId} className="flex align-center justify-between" style={{ fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex', gap: '0.25rem' }}>
                    <strong>{item.quantity}x</strong> {item.name.length > 22 ? `${item.name.slice(0, 20)}...` : item.name}
                  </span>
                  <span style={{ fontWeight: 600 }}>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `$${shipping}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                type="submit"
                disabled={formLoading}
                className="btn btn-primary"
                style={{ width: '100%', gap: '0.5rem' }}
              >
                {formLoading ? 'Processing Order...' : 'Pay & Complete Order'}
                {!formLoading && <ArrowRight size={16} />}
              </button>

              <div className="flex align-center justify-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
                <span>SSL Encrypted Checkout (Mock)</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
