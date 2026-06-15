'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ClipboardList, CheckCircle2, Truck, Box, Package, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

// Simple inner component to handle searchParams safely with Suspense in App Router
function OrdersContent() {
  const { user, isLoading: authLoading } = useApp();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessAlert(true);
      // Remove success query from URL to avoid repeating notifications on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchOrders();
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        // Expand the first order by default if it exists
        if (data.orders.length > 0) {
          setExpandedOrders({ [data.orders[0]._id]: true });
        }
      }
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="container flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container flex flex-col align-center justify-center" style={{ minHeight: '60vh', textAlign: 'center', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--border)', borderRadius: '50%', color: 'var(--text-muted)', display: 'inline-flex' }}>
          <ClipboardList size={36} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Access Denied</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Please log in to view your orders.
          </p>
        </div>
        <Link href="/login" className="btn btn-primary btn-sm">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      
      {showSuccessAlert && (
        <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
          <CheckCircle2 size={22} />
          <div>
            <strong style={{ display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>Order Placed Successfully!</strong>
            <span>Thank you for shopping at VoltStore. Your transaction has been processed and your package is being prepared.</span>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>My Orders</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          Track delivery status, review past purchases, and manage shipments.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="card flex flex-col align-center justify-center" style={{ padding: '4rem 2rem', textAlign: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--border)', borderRadius: '50%', color: 'var(--text-muted)', display: 'inline-flex' }}>
            <ClipboardList size={36} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No orders yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              You haven&apos;t placed any orders with VoltStore. Build your dream setup today!
            </p>
          </div>
          <Link href="/products" className="btn btn-primary btn-sm">
            Browse Products
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrders[order._id];
            
            // Format dates
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            // Get status details
            const getStatusBadge = (status: string) => {
              switch (status) {
                case 'shipped':
                  return <span className="badge badge-primary">Shipped</span>;
                case 'delivered':
                  return <span className="badge badge-success">Delivered</span>;
                default:
                  return <span className="badge badge-warning">Pending</span>;
              }
            };

            return (
              <div key={order._id} className="card" style={{ padding: 0, overflow: 'visible' }}>
                
                {/* Header Summary */}
                <div 
                  onClick={() => toggleExpand(order._id)}
                  style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', flexWrap: 'wrap', gap: '1rem', borderBottom: isExpanded ? '1px solid var(--border)' : 'none' }}
                >
                  <div className="flex align-center gap-3 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Order ID</span>
                      <code style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{order._id}</code>
                    </div>

                    <div className="flex flex-col gap-1" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem' }}>
                      <span className="flex align-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={12} /> Date
                      </span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{dateStr}</span>
                    </div>

                    <div className="flex flex-col gap-1" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>${order.totalAmount}</span>
                    </div>
                  </div>

                  <div className="flex align-center gap-3">
                    {getStatusBadge(order.status)}
                    <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem', border: 'none' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div style={{ padding: '2rem 1.5rem' }}>
                    
                    {/* Visual Tracking Progress Timeline */}
                    <div style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                      <div className="timeline">
                        <div className={`timeline-step ${['pending', 'shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                          <div className="timeline-icon">
                            <Package size={14} />
                          </div>
                          <span className="timeline-label">Ordered</span>
                        </div>
                        
                        <div className={`timeline-step ${order.status === 'pending' ? 'active' : ['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}>
                          <div className="timeline-icon">
                            <Truck size={14} />
                          </div>
                          <span className="timeline-label">Shipped</span>
                        </div>

                        <div className={`timeline-step ${order.status === 'shipped' ? 'active' : order.status === 'delivered' ? 'completed' : ''}`}>
                          <div className="timeline-icon">
                            <Box size={14} />
                          </div>
                          <span className="timeline-label">Delivered</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row flex-row-mobile-stack gap-4">
                      {/* Products Summary list */}
                      <div style={{ flex: 1.5 }}>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem' }}>Items Ordered</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex align-center justify-between" style={{ padding: '0.75rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                              <div className="flex align-center gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                                />
                                <div>
                                  <Link href={`/products/${item.productId}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                    {item.name}
                                  </Link>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Qty: {item.quantity} &bull; Price: ${item.price} each
                                  </div>
                                </div>
                              </div>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>${item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info Box */}
                      <div style={{ flex: 1, borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.1rem' }}>Delivery Information</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                          <p className="flex align-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                            <MapPin size={16} style={{ color: 'var(--primary)' }} />
                            <strong>Shipping Destination:</strong>
                          </p>
                          <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{order.shippingAddress.name}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress.address}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>
                              {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>{order.shippingAddress.country}</div>
                          </div>
                          
                          <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <strong>Payment Method:</strong> Card ending in {order.paymentInfo?.cardNumber?.slice(-4) || '1234'}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="container flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <p>Loading orders component...</p>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
