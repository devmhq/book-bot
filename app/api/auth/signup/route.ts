import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signJwt } from '@/lib/auth';

/**
 * POST /api/auth/signup
 * Body: { businessName: string, email: string, password: string }
 */
export async function POST(request: NextRequest) {
  const { businessName, email, password } = await request.json();
  if (!businessName || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  try {
    const result = await prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          slug: businessName.toLowerCase().replace(/\s+/g, '-'),
          email,
          phone: '',
          plan: 'FREE',
        },
      });

      const user = await tx.businessUser.create({
        data: {
          businessId: business.id,
          email,
          passwordHash,
          role: 'OWNER',
        },
      });

      await tx.businessConfig.create({
        data: {
          businessId: business.id,
          welcomeMessage: 'Welcome to BookBot!',
          workingHours: {},
        },
      });

      return { business, user };
    });

    const token = await signJwt({
      businessId: result.business.id,
      userId: result.user.id,
      role: 'OWNER',
      slug: result.business.slug,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('bb_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
