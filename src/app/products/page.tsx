import { getFilteredProducts, getAllCategories } from '@/lib/fakestore';
import ProductCard from '@/components/ProductCard';
import CategoriesSidebar from '@/components/CategoriesSidebar';
import CatalogFilters from '@/components/CatalogFilters';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { q = '', category = 'all' } = await searchParams;

  const [products, categories] = await Promise.all([
    getFilteredProducts({ query: q, category }),
    getAllCategories(),
  ]);

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
        {/* Left categories sidebar (client) */}
        <CategoriesSidebar categories={['all', ...categories]} currentCategory={category} q={q} />

        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>All Products</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
              {category !== 'all' ? ` in "${category}"` : ''}
              {q ? ` for "${q}"` : ''}
            </p>
          </div>

          {/* Interactive Filter Bar */}
          <CatalogFilters
            initialQuery={q}
            initialCategory={category}
            categories={['all', ...categories]}
          />

          {/* Products Display */}
          {products.length === 0 ? (
            <div className="card flex flex-col align-center justify-center" style={{ padding: '4rem 2rem', textAlign: 'center', gap: '1.25rem' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--border)', borderRadius: '50%', color: 'var(--text-secondary)', display: 'inline-flex' }}>
                <ShoppingBag size={36} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No products match your search</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                  Try removing some filters, adjusting your terms, or browsing categories.
                </p>
              </div>
              <Link href="/products" className="btn btn-primary btn-sm">
                Reset All Filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
