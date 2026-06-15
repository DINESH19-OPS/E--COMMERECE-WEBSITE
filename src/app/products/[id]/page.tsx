import { getProductById, getAllProducts } from '@/lib/fakestore';
import AddToCartArea from '@/components/AddToCartArea';
import ProductCard from '@/components/ProductCard';
import { ArrowLeft, Inbox, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/currency';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container flex flex-col align-center justify-center" style={{ minHeight: '60vh', textAlign: 'center', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: 'var(--error-bg)', borderRadius: '50%', color: 'var(--error)', display: 'inline-flex' }}>
          <Inbox size={36} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            The product you are looking for does not exist or may have been removed.
          </p>
        </div>
        <Link href="/products" className="btn btn-outline btn-sm flex align-center gap-1">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  // Fetch related products from same category
  const allProducts = await getAllProducts();
  const related = allProducts
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  const stars = Math.round(product.rating);

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Breadcrumb */}
        <div className="flex align-center gap-1" style={{ marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link href="/products" style={{ color: 'var(--text-muted)' }}>Products</Link>
          <span>/</span>
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {product.name.length > 35 ? `${product.name.substring(0, 32)}...` : product.name}
          </span>
        </div>

        <div className="flex flex-row flex-row-mobile-stack gap-4">
          {/* Left: Product Image */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            minHeight: '420px',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>

          {/* Right: Product Info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Badges */}
            <div className="flex align-center gap-2">
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>
                {product.category}
              </span>
              {product.stock === 0 ? (
                <span className="badge badge-danger">Out of Stock</span>
              ) : product.stock <= 5 ? (
                <span className="badge badge-warning">Only {product.stock} left!</span>
              ) : (
                <span className="badge badge-success">In Stock</span>
              )}
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.2 }}>{product.name}</h1>

            {/* Rating */}
            <div className="flex align-center gap-2">
              <div className="flex align-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < stars ? '#f59e0b' : 'transparent'}
                    color={i < stars ? '#f59e0b' : 'rgba(207,158,255,0.3)'}
                  />
                ))}
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.rating}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>({product.ratingCount} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatPrice(product.price)}
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '1.25rem 0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>About this product</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {product.description}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-3" style={{ gap: '0.75rem' }}>
              {[
                { icon: <Truck size={16} />, text: 'Free shipping over ₹12,600' },
                { icon: <ShieldCheck size={16} />, text: '2-year warranty' },
                { icon: <RefreshCw size={16} />, text: '30-day returns' },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex align-center gap-1"
                  style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', backgroundColor: 'var(--card)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--primary)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <AddToCartArea product={{
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
            }} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ padding: '4rem 0 0', borderTop: '1px solid rgba(207,158,255,0.12)', marginTop: '4rem' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              More in <span style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{product.category}</span>
            </h2>
            <div className="grid grid-4">
              {related.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
