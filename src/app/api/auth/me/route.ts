import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getRepository } from '@/lib/db/repository';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      // Clear invalid cookie
      cookieStore.delete('session');
      return NextResponse.json({ user: null });
    }

    const repo = await getRepository();
    const user = await repo.getUserById(decoded.userId);

    if (!user) {
      cookieStore.delete('session');
      return NextResponse.json({ user: null });
    }

    // Remove password hash before returning user info
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userProfile } = user;

    return NextResponse.json({ user: userProfile });
  } catch (error: any) {
    console.error('Me auth error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
