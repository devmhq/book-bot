import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { env } from 'process';

export type JwtPayload = {
  businessId: string;
  userId: string;
  role: string;
  slug: string;
};

const JWT_SECRET = env.JWT_SECRET ?? '';
if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set');
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signJwt(payload: JwtPayload): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 60 * 60; // 7 days
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return payload as unknown as JwtPayload;
  } catch (e) {
    console.error('JWT verification failed', e);
    return null;
  }
}
