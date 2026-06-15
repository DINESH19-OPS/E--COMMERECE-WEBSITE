import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/db/repository';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

// GET /api/orders
export async function GET() {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized. Login required.' }, { status: 401 });
    }

    const repo = await getRepository();
    let orders;

    if (decoded.role === 'admin') {
      // Admin sees all orders
      orders = await repo.getOrders();
    } else {
      // User sees only their own orders
      orders = await repo.getOrders(decoded.userId);
    }

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST /api/orders (Checkout)
export async function POST(request: Request) {
  try {
    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized. Login required to checkout.' }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, paymentInfo } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.country) {
      return NextResponse.json({ error: 'Missing shipping address details' }, { status: 400 });
    }

    const repo = await getRepository();

    // Verify stock and calculate total amount from backend prices to prevent client-side manipulation
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await repo.getProductById(item.productId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product with ID ${item.productId} not found.` }, { status: 400 });
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock}` 
        }, { status: 400 });
      }

      calculatedTotal += dbProduct.price * item.quantity;
      verifiedItems.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        image: dbProduct.image,
        quantity: item.quantity
      });
    }

    // Process payment info (mask card number)
    const maskedCardNumber = paymentInfo?.cardNumber 
      ? `•••• •••• •••• ${paymentInfo.cardNumber.slice(-4)}` 
      : '•••• •••• •••• 1234';

    const orderData = {
      userId: decoded.userId,
      items: verifiedItems,
      shippingAddress,
      paymentInfo: {
        cardNumber: maskedCardNumber,
        cardHolder: paymentInfo?.cardHolder || 'Cardholder Name'
      },
      totalAmount: calculatedTotal,
      status: 'pending'
    };

    const newOrder = await repo.createOrder(orderData);

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
