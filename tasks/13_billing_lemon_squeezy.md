# Task 13 — Lemon Squeezy Billing Integration

## Goal
Integrate Lemon Squeezy for subscription billing. Enable businesses to purchase and manage plans (Free, Starter, Growth, Pro), configure plan level access gates for application features, and handle checkout redirects and webhook events.

## Prerequisites
- Task 02 — JWT Authentication
- Task 03 — Business Onboarding and Settings

## Env vars needed
```env
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

## Acceptance criteria
1. A billing page is available at `/dashboard/billing` displaying the business's current plan, monthly conversation usage, and action buttons to upgrade, downgrade, or manage subscriptions.
2. The `POST /api/billing/checkout` route securely generates checkout URLs from the Lemon Squeezy API, passing the business ID in custom metadata.
3. The public `POST /api/billing/webhook` handles incoming Lemon Squeezy events (`subscription_created`, `subscription_updated`, `subscription_cancelled`, and `subscription_payment_success`), validating payloads with signature headers.
4. A subscription logic helper (`lib/plans.ts`) validates active feature limits based on the business's plan tier.
5. Inbound chats in `/api/chat` enforce plan conversation limits (e.g. Free plan stops at 100 conversations per month).
6. Restricts WhatsApp integrations (Starter and above only) and widget branding overrides (Growth and above only).
7. The portal redirection route `/api/billing/portal` retrieves the customer billing management URL from Lemon Squeezy and redirects the user.

## Files to create or modify
- [NEW] [lib/plans.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/plans.ts) — Plan details dictionary and feature capability checker helpers.
- [NEW] [app/(dashboard)/billing/page.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/%28dashboard%29/billing/page.tsx) — Main dashboard billing page view containing current status and plan comparisons.
- [NEW] [app/api/billing/checkout/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/billing/checkout/route.ts) — Protected checkout link generator route.
- [NEW] [app/api/billing/portal/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/billing/portal/route.ts) — Protected Lemon Squeezy portal redirect helper.
- [NEW] [app/api/billing/webhook/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/billing/webhook/route.ts) — Public webhook endpoint verifying signatures and updating subscription tables.

## Implementation notes
- Webhook signature validation: Read the raw body as a string. Verify using HMAC-SHA256 signature checks:
  ```typescript
  const signature = request.headers.get('x-signature');
  const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = hmac.update(rawBody).digest('hex');
  if (signature !== digest) return new Response('Invalid signature', { status: 401 });
  ```
- Checkout metadata: Include `custom_data: { businessId }` in the payload passed to the Lemon Squeezy checkout endpoint to match webhook payloads to businesses.
- Downgrades: When a user cancels a subscription, do not immediately downgrade their plan. Keep status active until the `currentPeriodEnd` date, then downgrade to `FREE`.

## Test steps
1. Visit the billing page `/dashboard/billing` and verify that the current plan is displayed as `FREE` and the usage progress bar renders correctly.
2. Click the upgrade button for the `Starter` plan, verify it redirects to the Lemon Squeezy checkout screen, and confirm the business ID is included in the URL payload.
3. Use a tool like ngrok to expose your local port, register the webhook endpoint in Lemon Squeezy, and trigger mock subscription events using test payments. Verify that updates write to the database.
4. Verify feature gates by setting the plan to `FREE` in the DB and running more than 100 conversations to confirm limit warning notifications are displayed.
5. Verify that accessing `/api/billing/portal` redirects you to the customer billing management panel.
