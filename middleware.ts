// Minimal placeholder middleware for Next.js
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware that simply allows all requests to continue.
 * Adjust logic as needed for auth, redirects, etc.
 */
export function middleware(request: NextRequest) {
  // You can add custom logic here.
  return NextResponse.next();
}

// Optional: apply to all routes
export const config = {
  matcher: '/:path*',
};
