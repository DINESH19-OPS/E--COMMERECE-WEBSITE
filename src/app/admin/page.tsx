'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Settings, Plus, Edit, Trash2, LayoutDashboard, ShoppingBag, ClipboardList, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/currency';

export default function AdminPage() {
  const { user, isLoading: authLoading } = useApp();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Form State
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodCategory, setProdCategory] = useState('peripherals');
  const [prodStock, setProdStock] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    // Redirect non-admins
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        loadDashboardData();
      }
    }
  }, [user, authLoading, router]);

  const loadDashboardData = async () => {
    setLoadingData(true);
    setError('');
    try {
      // Fetch both products and orders in parallel
      const [prodRes, ordRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders')
      ]);

      if (prodRes.ok && ordRes.ok) {
        const prodData = await prodRes.json();
        const ordData = await ordRes.json();
        setProducts(prodData.products);
        setOrders(ordData.orders);
      } else {
        setError('Failed to fetch admin data from backend.');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred loading the dashboard data.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalType('add');
    setSelectedProductId(null);
    setProdName('');
    setProdDesc('');
    setProdPrice('');
    setProdImage('');
    setProdCategory('peripherals');
    setProdStock('');
    setShowModal(true);
  };

  const handleOpenEditModal = (product: any) => {
    setModalType('edit');
    setSelectedProductId(product._id);
    setProdName(product.name);
    setProdDesc(product.description || '');
    setProdPrice(product.price.toString());
    setProdImage(product.image || '');
    setProdCategory(product.category);
    setProdStock(product.stock.toString());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodCategory || !prodStock) {
      alert('Please fill in required fields');
      return;
    }

    setFormLoading(true);
    const url = modalType === 'add' ? '/api/products' : `/api/products/${selectedProductId}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prodName,
          description: prodDesc,
          price: Number(prodPrice),
          image: prodImage,
          category: prodCategory,
          stock: Number(prodStock)
        })
      });

      if (res.ok) {
        setShowModal(false);
        loadDashboardData(); // Refresh list
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred saving the product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        loadDashboardData(); // Refresh list
      } else {
        const data = await res.json();
        alert(data.error || 'Delete failed');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting product');
    }
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Optimistic update of local state
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update order status');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating order status');
    }
  };

  // Derived dashboard stats (e-commerce adaptation of task-style overview)
  const ordersTodayCount = orders.filter(o => {
    try {
      return new Date(o.createdAt).toDateString() === new Date().toDateString();
    } catch { return false; }
  }).length;

  const upcomingShipments = orders.filter(o => o.status === 'shipped').length;

  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  const revenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  if (authLoading || (loadingData && products.length === 0)) {
    return (
      <div className="container flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <p>Verifying Admin session...</p>
      </div>

    if (authLoading || (loadingData && products.length === 0)) {
  return (
    <div
      className="container flex justify-center align-center"
      style={{ minHeight: '60vh' }}
    >
      <p>Verifying Admin session...</p>
    </div>
  );
}
  if (!user || user.role !== 'admin') {
    return (
      <div className="container flex flex-col align-center justify-center" style={{ minHeight: '60vh', textAlign: 'center', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--error-bg)', borderRadius: '50%', color: 'var(--error)', display: 'inline-flex' }}>
          <AlertCircle size={36} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Access Forbidden</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Only store administrators can access the admin dashboard.
          </p>
        </div>
        <Link href="/login" className="btn btn-primary btn-sm">
          Log In as Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      
      <div className="flex justify-between align-center" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="flex align-center gap-2" style={{ fontSize: '2.25rem', fontWeight: 800 }}>
            <LayoutDashboard size={28} style={{ color: 'var(--primary)' }} />
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage inventory and track system order fulfillments.
          </p>
        </div>
        {activeTab === 'products' && (
          <button onClick={handleOpenAddModal} className="btn btn-primary flex align-center gap-1">
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '2rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        <div 
          onClick={() => setActiveTab('products')} 
          className={`tab flex align-center gap-1 ${activeTab === 'products' ? 'active' : ''}`}
        >
          <ShoppingBag size={18} /> Product Catalog ({products.length})
        </div>
        <div 
          onClick={() => setActiveTab('orders')} 
          className={`tab flex align-center gap-1 ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <ClipboardList size={18} /> Customer Orders ({orders.length})
        </div>
      </div>

      {/* TAB CONTENT: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--background)' }} 
                    />
                  </td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ textTransform: 'capitalize' }}>
                    <span className="badge badge-primary">{p.category}</span>
                  </td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    {p.stock === 0 ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : p.stock <= 5 ? (
                      <span className="badge badge-warning">{p.stock} units (Low)</span>
                    ) : (
                      <span>{p.stock} units</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex gap-1 justify-end">
                      <button 
                        onClick={() => handleOpenEditModal(p)} 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.4rem' }}
                        title="Edit Product"
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p._id)} 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.4rem', color: 'var(--error)' }}
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Recipient</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>
                    <code style={{ fontWeight: 600 }}>{o._id}</code>
                  </td>
                  <td>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.shippingAddress.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.shippingAddress.city}, {o.shippingAddress.country}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{formatPrice(o.totalAmount)}</td>
                  <td>
                    {o.status === 'pending' && <span className="badge badge-warning">Pending</span>}
                    {o.status === 'shipped' && <span className="badge badge-primary">Shipped</span>}
                    {o.status === 'delivered' && <span className="badge badge-success">Delivered</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <select
                      value={o.status}
                      onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                      className="form-control"
                      style={{ width: '130px', display: 'inline-block', padding: '0.375rem 0.75rem', fontSize: '0.875rem', borderRadius: 'var(--radius-sm)' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{modalType === 'add' ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={handleCloseModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label htmlFor="prodName">Product Name *</label>
                <input
                  id="prodName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Mechanical Keyboard"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prodDesc">Description</label>
                <textarea
                  id="prodDesc"
                  className="form-control"
                  rows={3}
                  placeholder="Tell customers about the product..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="prodPrice">Price ($) *</label>
                  <input
                    id="prodPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    placeholder="199.99"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prodStock">Stock Units *</label>
                  <input
                    id="prodStock"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="10"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prodCategory">Category *</label>
                <select
                  id="prodCategory"
                  className="form-control"
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                  required
                >
                  <option value="peripherals">Peripherals</option>
                  <option value="audio">Audio</option>
                  <option value="desk-setup">Desk Setup</option>
                  <option value="displays">Displays</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label htmlFor="prodImage">Image URL</label>
                <input
                  id="prodImage"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={formLoading} 
                  className="btn btn-primary"
                >
                  {formLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
