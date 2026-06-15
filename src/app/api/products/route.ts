import { NextResponse } from 'next/server';
import { getFilteredProducts } from '@/lib/fakestore';
import { getRepository } from '@/lib/db/repository';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET /api/products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const query = searchParams.get('q') || '';

    const products = await getFilteredProducts({ category, query });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/products (Admin Only)
export async function POST(request: Request) {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, image, category, stock } = body;

    if (!name || price === undefined || !category || stock === undefined) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    if (price < 0 || stock < 0) {
      return NextResponse.json({ error: 'Price and stock must be non-negative numbers' }, { status: 400 });
    }

    const repo = await getRepository();
    const product = await repo.createProduct({
      name,
      description: description || '',
      price: Number(price),
      image: image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600',
      category,
      stock: Number(stock)
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
