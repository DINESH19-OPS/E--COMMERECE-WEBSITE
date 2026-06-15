'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import AnimatedDashboardPreview from '@/components/AnimatedDashboardPreview';

export default function LoginPage() {
  const { user, login, isLoading } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setFormLoading(true);
    const result = await login(email, password);
    setFormLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  if (isLoading) {
    return (
      <div className="container flex justify-center align-center" style={{ minHeight: '60vh' }}>
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <section className="login-hero">
      <div className="login-background-preview">
        <AnimatedDashboardPreview />
      </div>

      <div className="login-panel animate-pop" style={{ animationDelay: '0.06s' }}>
        <div className="panel-brand">
          <div style={{ display: 'inline-flex', padding: '0.6rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '0.25rem' }}>
            <LogIn size={26} />
          </div>
          <h2>Welcome Back</h2>
          <div className="panel-sub">Sign in to continue to VoltStore</div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="search-input-wrapper">
              <span className="search-icon"><Mail size={18} /></span>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password">Password</label>
            <div className="search-input-wrapper">
              <span className="search-icon"><Lock size={18} /></span>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {formLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="login-footer-note">
          Don&apos;t have an account?{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Register here
          </Link>
        </p>

        <div className="login-footer-note" style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <strong>💡 Admin credentials:</strong> Use an email containing &quot;admin&quot; to register or log in as an Admin.
        </div>
      </div>
    </section>
  );
}
