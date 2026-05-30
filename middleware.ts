import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth';

/**
 * Protects dashboard pages and private API endpoints.
 * If a valid JWT is present in the `bb_session` cookie, injects the
 * `x-business-id` and `x-user-id` headers for downstream handlers.
 * Otherwise redirects to the login page.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedDashboard = pathname.startsWith('/dashboard');
  const protectedApi = /\/api\/(leads|bookings|rag|calendar|billing)\/.test(pathname);

  if (!protectedDashboard && !protectedApi) {
    // Public route – let it pass through unchanged
    return NextResponse.next();
  }

  const token = request.cookies.get('bb_session')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  // Propagate business and user identifiers to downstream API/routes
  response.headers.set('x-business-id', payload.businessId);
  response.headers.set('x-user-id', payload.userId);
  return response;
}

export const config = {
  // Apply to all routes – internal logic decides when to enforce auth
  matcher: '/:path*',
};
