import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/db/repository';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET /api/orders/[id]
export async function GET(
  request: Request,
  context: { params: Promise<any> }
) {
  try {
    const { id } = await context.params;

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized. Login required.' }, { status: 401 });
    }

    const repo = await getRepository();
    const order = await repo.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Authorization: User must be an Admin OR the owner of the order
    if (decoded.role !== 'admin' && order.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden. Unauthorized to access this order.' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/orders/[id] (Admin Only - Update Order Status)
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
    const { status } = body;

    if (!status || !['pending', 'shipped', 'delivered'].includes(status)) {
      return NextResponse.json({ error: 'Invalid or missing status (must be pending, shipped, or delivered)' }, { status: 400 });
    }

    const repo = await getRepository();
    const existingOrder = await repo.getOrderById(id);

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await repo.updateOrderStatus(id, status);
    return NextResponse.json({ order: updatedOrder });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
