# Task 02 — JWT Authentication

## Goal
Implement a custom token-based JWT authentication system featuring signup, login, and logout route handlers, a JWT helper library using `jose`, custom password hashing, and middleware-based route protection.

## Prerequisites
- Task 00 — Project Setup
- Task 01 — Database Schema

## Env vars needed
```env
JWT_SECRET=your_jwt_secret_here
```

## Acceptance criteria
1. Password hashing and verification functions are implemented in `lib/auth.ts` using `bcryptjs` (10 rounds).
2. JWT signing and verification are implemented in `lib/auth.ts` using `jose` (`HS256`, 7-day expiration).
3. Next.js `middleware.ts` successfully intercepting unauthorized requests to dashboard paths (`/(dashboard)/:path*`) and private API endpoints (`/api/(leads|bookings|rag|calendar|billing)/:path*`).
4. Middleware injects `x-business-id` and `x-user-id` headers into request headers upon successful token verification.
5. Signup endpoint creates a `Business` and an OWNER `BusinessUser` within a transaction, and initializes a default `BusinessConfig` record.
6. Login endpoint tracks failed login attempts and locks the account using `loginAttempts` and `lockedUntil` fields in `BusinessUser`.
7. Auth pages (`/login` and `/signup`) are created with clean forms and client-side validation.

## Files to create or modify
- [NEW] [lib/auth.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/auth.ts) — Token operations, session retrieval, and password hashing helpers.
- [NEW] [middleware.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/middleware.ts) — Router interceptor for checking JWT cookie and attaching business/user contexts.
- [NEW] [app/api/auth/signup/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/auth/signup/route.ts) — Route handler for business owner registration.
- [NEW] [app/api/auth/login/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/auth/login/route.ts) — Route handler for credentials verification, rate limiting, and cookie setting.
- [NEW] [app/api/auth/logout/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/auth/logout/route.ts) — Route handler for clearing the `bb_session` cookie.
- [NEW] [app/(auth)/login/page.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/(auth)/login/page.tsx) — Email and password login view.
- [NEW] [app/(auth)/signup/page.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/(auth)/signup/page.tsx) — User and business signup view.

## Implementation notes
- Dependencies to install: `bcryptjs` and `@types/bcryptjs`.
- Cookie details: name = `bb_session`, flags = `httpOnly: true`, `secure: true` (in production), `sameSite: "lax"`, `path: "/"`, `maxAge: 60 * 60 * 24 * 7` (7 days).
- Token payload structure: `{ businessId: string, userId: string, role: string, slug: string }`.
- Password hashing: use `bcryptjs` 10 salt rounds.
- Transaction requirement: Ensure that signup creates the business, the business owner user, and a default config row with empty system prompts and fallback welcome messages, all failing atomically if any fails.
- Login protection: increment `loginAttempts` on failure. If `loginAttempts >= 5`, set `lockedUntil` to `now() + 15 minutes`. Reset attempts on successful authentication.

## Test steps
1. Attempt to navigate to `/dashboard/leads` without authenticating. Verify redirect to `/login`.
2. Access signup page `/signup`, create a new account, and check the database to confirm `Business`, `BusinessUser` and `BusinessConfig` rows were created.
3. Access login page `/login`, verify login succeeds, set cookies, and redirect to dashboard.
4. Input wrong credentials multiple times to verify account locking behavior after 5 consecutive failures.
5. Click logout button/send logout request, verify cookie `bb_session` is cleared, and request redirect to login.
