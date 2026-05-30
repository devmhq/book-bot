import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * POST /api/auth/logout
 * Clears the `bb_session` cookie.
 */
export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('bb_session', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
