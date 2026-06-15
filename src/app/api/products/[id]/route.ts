import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/fakestore';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET /api/products/[id]
export async function GET(
  request: Request,
  context: { params: Promise<any> }
) {
  try {
    const { id } = await context.params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/products/[id] (Admin Only)
export async function PUT(
  request: Request,
  context: { params: Promise<any> }
) {
  try {
    const { id } = await context.params;
    
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const repo = await getRepository();
    
    const existingProduct = await repo.getProductById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Convert fields to appropriate formats
    const updatedData: any = {};
    if (body.name !== undefined) updatedData.name = body.name;
    if (body.description !== undefined) updatedData.description = body.description;
    if (body.price !== undefined) updatedData.price = Number(body.price);
    if (body.image !== undefined) updatedData.image = body.image;
    if (body.category !== undefined) updatedData.category = body.category;
    if (body.stock !== undefined) updatedData.stock = Number(body.stock);

    if (updatedData.price !== undefined && updatedData.price < 0) {
      return NextResponse.json({ error: 'Price must be non-negative' }, { status: 400 });
    }
    if (updatedData.stock !== undefined && updatedData.stock < 0) {
      return NextResponse.json({ error: 'Stock must be non-negative' }, { status: 400 });
    }

    const updatedProduct = await repo.updateProduct(id, updatedData);
    return NextResponse.json({ product: updatedProduct });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/products/[id] (Admin Only)
export async function DELETE(
  request: Request,
  context: { params: Promise<any> }
) {
  try {
    const { id } = await context.params;

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const repo = await getRepository();
    const deleted = await repo.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found or delete failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
