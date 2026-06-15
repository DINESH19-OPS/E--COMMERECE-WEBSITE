import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/fakestore';

export async function GET() {
  try {
    const cats = await getAllCategories();
    return NextResponse.json(cats);
  } catch (e) {
    return NextResponse.json([], { status: 500 });
  }
}
