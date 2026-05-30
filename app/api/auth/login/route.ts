import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, signJwt } from '@/lib/auth';

/**
 * POST /api/auth/login
 * Body: { email: string, password: string }
 */
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const user = await prisma.businessUser.findUnique({
    where: { email },
    include: { business: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Check lockout
  if (user.lockedUntil && new Date() < user.lockedUntil) {
    return NextResponse.json({ error: 'Account locked. Try later.' }, { status: 403 });
  }

  const valid = await verifyPassword(user.passwordHash, password);
  if (!valid) {
    // Increment attempts
    const attempts = (user.loginAttempts ?? 0) + 1;
    const updateData: any = { loginAttempts: attempts };
    if (attempts >= 5) {
      const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      updateData.lockedUntil = lockUntil;
    }
    await prisma.businessUser.update({
      where: { id: user.id },
      data: updateData,
    });
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Reset attempts on success
  await prisma.businessUser.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null },
  });

  const token = await signJwt({
    businessId: user.businessId,
    userId: user.id,
    role: user.role,
    slug: user.business.slug,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set('bb_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
