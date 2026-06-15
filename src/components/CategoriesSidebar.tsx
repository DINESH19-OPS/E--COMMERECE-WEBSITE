"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesSidebar({
  categories,
  currentCategory,
  q,
}: {
  categories: string[];
  currentCategory: string;
  q: string;
}) {
  const router = useRouter();

  const handleSelect = (cat: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat && cat !== 'all') params.set('category', cat);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <aside className="categories-sidebar" aria-label="Product categories">
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Categories</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {categories.map((cat) => {
          const isActive = cat === (currentCategory || 'all');
          return (
            <li key={cat}>
              <button
                onClick={() => handleSelect(cat)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{ width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem' }}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
