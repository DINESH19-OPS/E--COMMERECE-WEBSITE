'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function CatalogFilters({
  initialQuery = '',
  initialCategory = 'all',
  categories = ['all'],
}: {
  initialQuery?: string;
  initialCategory?: string;
  categories?: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  // Sync state if URL changes externally
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const updateFilters = (newQuery: string, newCategory: string) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newCategory && newCategory !== 'all') params.set('category', newCategory);
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCategory = searchParams.get('category') || 'all';
    updateFilters(query, currentCategory);
  };

  const handleCategorySelect = (categoryVal: string) => {
    updateFilters(query, categoryVal);
  };

  const handleClear = () => {
    setQuery('');
    router.push('/products');
  };

  const currentCategory = searchParams.get('category') || 'all';

  const formatLabel = (cat: string) => {
    if (cat === 'all') return 'All Products';
    return cat
      .split("'")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join("'");
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '1.25rem' }}>
        <div className="search-input-wrapper" style={{ flex: 1 }}>
          <span className="search-icon"><Search size={18} /></span>
          <input
            type="text"
            className="form-control"
            placeholder="Search products (e.g. laptop, shirt, gold ring...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
        {(query || currentCategory !== 'all') && (
          <button type="button" onClick={handleClear} className="btn btn-outline" title="Clear filters" style={{ padding: '0.75rem' }}>
            <X size={18} />
          </button>
        )}
      </form>

      {/* Category pills hidden per user preference */}
    </div>
  );
}
