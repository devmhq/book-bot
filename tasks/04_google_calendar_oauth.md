# Task 04 — Google Calendar OAuth Integration

## Goal
Implement the Google Calendar OAuth 2.0 flow allowing businesses to securely link their calendar, storing access and refresh tokens encrypted with AES-256-GCM, and expose helpers for fetching free/busy availability and scheduling calendar events.

## Prerequisites
- Task 03 — Business Onboarding and Settings

## Env vars needed
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/oauth/callback
ENCRYPTION_KEY=your_32_byte_64_hex_encryption_key_here
```

## Acceptance criteria
1. Google OAuth flow starts from `/api/calendar/oauth/start`, redirecting to Google's consent screen with requested offline scopes (`https://www.googleapis.com/auth/calendar.events`, `https://www.googleapis.com/auth/calendar.readonly`).
2. Google redirects back to `/api/calendar/oauth/callback`, exchanging authorization codes for auth tokens.
3. Access and refresh tokens are stored encrypted using AES-256-GCM in the `CalendarToken` table.
4. Settings page reflects connection status (showing a "Connected" badge with calendar email or a "Disconnect" action).
5. A calendar helper utility (`lib/google-calendar.ts`) handles fetching current access tokens, checking token expiration, and performing silent refresh cycles.
6. The utility includes robust methods for querying free/busy calendar time windows, creating calendar entries, and removing scheduled calendar items.

## Files to create or modify
- [NEW] [lib/google-calendar.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/google-calendar.ts) — Token encryption/decryption routines, token refreshing, and Calendar API wrappers.
- [NEW] [app/api/calendar/oauth/start/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/calendar/oauth/start/route.ts) — Redirect handler starting the Google Consent flow.
- [NEW] [app/api/calendar/oauth/callback/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/calendar/oauth/callback/route.ts) — Callback receiver for code-token exchange and encryption.
- [NEW] [app/api/calendar/oauth/disconnect/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/calendar/oauth/disconnect/route.ts) — Endpoint for deleting stored calendar credentials.

## Implementation notes
- Google client library to install: `googleapis` (`google-auth-library` is bundled).
- AES-256-GCM Encryption rules:
  - Generate an IV (12 bytes) using `crypto.randomBytes(12)`.
  - Perform encryption and append/store the initialization vector (IV) and the authentication tag alongside the ciphertext in the database column (e.g., `iv:authTag:ciphertext`).
  - `ENCRYPTION_KEY` must be a 64-character hex string representing a 32-byte key.
- Token refresh: Check expiry when fetching tokens. If `expiresAt <= Date.now() + 5 * 60 * 1000` (5 minutes), perform refresh call, encrypt the new access token, and save it to the DB with the updated expiration date.

## Test steps
1. Click the "Connect Calendar" link on settings. Verify redirection to Google oauth consent dialog.
2. Complete auth flow and verify redirect back to `/dashboard/settings?calendar=connected`. Check the `CalendarToken` database table to ensure records exist and the tokens are encrypted (not plain text).
3. Call `getFreeBusySlots` test scripts using invalid and expired token dates to ensure refresh operations run seamlessly and automatically.
4. Create a mock calendar event using the `createEvent` helper and verify the entry appears immediately on the connected Google Calendar.
5. Click "Disconnect Calendar" on the settings UI, verify removal of database record, and verify page returns to calendar disconnected state.
