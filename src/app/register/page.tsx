'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const { user, register, isLoading } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setFormLoading(true);
    const result = await register(name, email, password);
    setFormLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Registration failed');
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
    <div className="container flex justify-center align-center" style={{ minHeight: '75vh', paddingTop: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1rem' }}>
            <UserPlus size={28} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Join VoltStore to order the best tech</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="search-input-wrapper">
              <span className="search-icon"><User size={18} /></span>
              <input
                id="name"
                type="text"
                className="form-control"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="search-input-wrapper">
              <span className="search-icon"><Mail size={18} /></span>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="search-input-wrapper">
              <span className="search-icon"><Lock size={18} /></span>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="search-input-wrapper">
              <span className="search-icon"><Lock size={18} /></span>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {formLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign in here
          </Link>
        </p>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong>💡 Admin account tips:</strong> Any registration with &quot;admin&quot; in the email (e.g. <code>admin.test@gmail.com</code>) will automatically receive the Admin role!
        </div>
      </div>
    </div>
  );
}
