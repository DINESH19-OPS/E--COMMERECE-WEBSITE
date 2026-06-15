import { NextResponse } from 'next/server';
import { getRepository } from '@/lib/db/repository';
import { hashPassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing name, email, or password' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const repo = await getRepository();
    const existingUser = await repo.getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    // Hash password and determine role
    const hashedPassword = await hashPassword(password);
    
    // Auto-promote any email containing 'admin' to the admin role
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';

    const newUser = await repo.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Sign JWT token
    const token = signToken({
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    // Remove password hash from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userProfile } = newUser;

    return NextResponse.json({ user: userProfile });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
