# Task 10 — Automated Follow-Up Engine

## Goal
Build the automated message follow-up system that processes pending notification items via a daily cron job. It targets specific notification channels (WhatsApp template alerts, Twilio SMS alerts, or Resend emails) and logs transmission results in the database.

## Prerequisites
- Task 01 — Database Schema
- Task 02 — JWT Authentication
- Task 08 — WhatsApp API Integration
- Task 09 — Booking Integration Flow

## Env vars needed
```env
CRON_SECRET=your_vercel_cron_secret_value
```

## Acceptance criteria
1. The cron endpoint `/api/cron/followups` verifies that incoming headers match the Vercel `CRON_SECRET` validation key.
2. The cron job runs daily at 9:00 AM UTC (configured in `vercel.json` and processed by Next.js router handlers).
3. The engine fetches all `FollowUp` rows where `status = PENDING` and `scheduledAt <= now()`.
4. Messages are sent via the channel the lead was captured on:
   - `WHATSAPP`: Meta WhatsApp Cloud API template dispatch (`sendTemplate`).
   - `WIDGET`: Transmits email notifications via Resend.
   - `SMS`: Dispatches messages using Twilio (`sendSms`).
5. After sending, records are marked with `status = SENT` and the timestamp `sentAt = now()`. Failed attempts write a `FAILED` status and log the error details.
6. Includes a re-engagement scheduler rule: if a lead is captured but no booking is made within 48 hours, a re-engagement record is automatically created in the database.
7. A protected POST route `/api/followups` enables business owners to schedule manual, ad-hoc follow-up reminders from the dashboard.

## Files to create or modify
- [NEW] [app/api/cron/followups/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/cron/followups/route.ts) — Verification and scheduled processing route for follow-ups.
- [NEW] [app/api/followups/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/followups/route.ts) — Protected endpoint to schedule manual follow-up messages.

## Implementation notes
- Vercel Cron Security: Ensure headers match using:
  ```typescript
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  ```
- WhatsApp Template requirements:
  - You must register a template named `appointment_reminder` in the Meta Business Suite.
  - Template body: `"Hi {{1}}, this is a reminder that your appointment at {{2}} is tomorrow at {{3}}. Reply CONFIRM to confirm or CANCEL to cancel."`
  - Capture variables: `{{1}}` customer name, `{{2}}` business name, `{{3}}` formatted start time.
- 48-Hour Re-engagement rule: In the chat capture logic, once a lead is confirmed, verify if any booking exists. If not, schedule a `FollowUp` record set to run 48 hours in the future. If a booking is later created, delete or cancel any pending re-engagement `FollowUp` records.

## Test steps
1. Manually insert `FollowUp` records in the database with past `scheduledAt` dates and statuses set to `PENDING` across different channels.
2. Trigger the endpoint `/api/cron/followups` using a POST request containing the authorization header. Verify that the request is authorized and process results are returned.
3. Verify that email, SMS, and WhatsApp messages are successfully received by the target test accounts.
4. Verify database records are updated, showing `status = SENT` and the correct `sentAt` timestamp.
5. Create a new lead without completing a booking. Verify that a re-engagement `FollowUp` record is scheduled for 48 hours in the future.
