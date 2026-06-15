import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-secret-key-9988-7766';
const TOKEN_EXPIRY = '7d'; // Token valid for 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

/**
 * Hash a password before saving to the database.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sign a JWT token for session state.
 */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verify a JWT token and extract the payload. Returns null if invalid or expired.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (err) {
    console.error('JWT Token verification failed:', (err as Error).message);
    return null;
  }
}
