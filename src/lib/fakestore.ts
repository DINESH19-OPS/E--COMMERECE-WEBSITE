// DummyJSON API Service Layer
// Uses https://dummyjson.com for product data

export interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  images?: string[];
}

// Map DummyJSON product to our internal ProductType shape
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  ratingCount: number;
}

const BASE_URL = 'https://dummyjson.com';

function mapProduct(p: DummyJsonProduct): Product {
  return {
    _id: String(p.id),
    name: p.title,
    description: p.description,
    price: p.price,
    image: p.thumbnail || (p.images && p.images.length ? p.images[0] : ''),
    category: p.category,
    stock: p.stock,
    rating: p.rating,
    ratingCount: Math.max(0, Math.round(p.stock)),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products?limit=100`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Failed to fetch products');
  const data: any = await res.json();
  const list: DummyJsonProduct[] = data.products || [];
  return list.map(mapProduct);
}

export async function getProductById(id: string): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/products/${id}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const data: DummyJsonProduct = await res.json();
  return mapProduct(data);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const encoded = encodeURIComponent(category);
  const res = await fetch(`${BASE_URL}/products/category/${encoded}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error('Failed to fetch products by category');
  const data: any = await res.json();
  const list: DummyJsonProduct[] = data.products || [];
  return list.map(mapProduct);
}

export async function getAllCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/categories`, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data: any = await res.json();
  // DummyJSON returns array of objects {slug, name}, we need the slugs
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    return data.map((cat) => cat.slug);
  }
  // Fallback if format is different
  return Array.isArray(data) ? data : [];
}

export async function getFilteredProducts(opts: {
  query?: string;
  category?: string;
}): Promise<Product[]> {
  // If both category and query are provided, fetch category then filter
  if (opts.category && opts.category !== 'all' && opts.query) {
    const list = await getProductsByCategory(opts.category);
    const q = opts.query.toLowerCase();
    return list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  // If only query provided, use DummyJSON search endpoint
  if (opts.query) {
    const encoded = encodeURIComponent(opts.query);
    const res = await fetch(`${BASE_URL}/products/search?q=${encoded}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error('Failed to search products');
    const data: any = await res.json();
    const list: DummyJsonProduct[] = data.products || [];
    return list.map(mapProduct);
  }

  // Category only or none
  if (opts.category && opts.category !== 'all') {
    return getProductsByCategory(opts.category);
  }

  return getAllProducts();
}
