# Task 09 — Booking Integration Flow

## Goal
Build the automated calendar booking system. Enable dynamically querying busy intervals from Google Calendar, merging slots with working hours, generating schedules, registering Cal.com and Google Calendar entries, dispatching confirmation emails and SMS, and showing interactive inline widget calendars.

## Prerequisites
- Task 04 — Google Calendar OAuth Integration
- Task 06 — Core Chat API Endpoint
- Task 07 — Website Chat Widget

## Env vars needed
```env
CALCOM_API_KEY=cal_live_xxxx
CALCOM_BASE_URL=https://api.cal.com/v2
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

## Acceptance criteria
1. Slot retrieval route `/api/bookings/slots` successfully pulls Google calendar entries, checks working hours, and lists non-conflicting periods.
2. `/api/bookings/create` validates availability on Google Calendar to prevent double bookings.
3. Successful bookings trigger simultaneous updates on Google Calendar (creating calendar events) and Cal.com (via booking APIs).
4. Creation process creates a DB record in the `Booking` table.
5. Sends notification emails via Resend to the customer and the business owner, and sends an SMS message via Twilio.
6. A scheduled reminder `FollowUp` record is inserted in the DB set to run 24 hours prior to the appointment.
7. Claude flags booking intent by attaching an `action: "show_slots"` configuration to the API response.
8. Widget renders click-based button panels for selecting slots and handles client-side form submissions to complete the booking.

## Files to create or modify
- [NEW] [lib/calcom.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/calcom.ts) — Client wrapper for Cal.com booking operations.
- [NEW] [lib/resend.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/resend.ts) — Email client and transactional message templates.
- [NEW] [lib/twilio.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/twilio.ts) — SMS messaging handler routines.
- [NEW] [app/api/bookings/slots/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/bookings/slots/route.ts) — Public slot generation endpoint.
- [NEW] [app/api/bookings/create/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/bookings/create/route.ts) — Public endpoint to reserve events.
- [NEW] [app/api/bookings/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/bookings/route.ts) — Protected endpoint to list bookings.
- [NEW] [app/api/bookings/[id]/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/bookings/%5Bid%5D/route.ts) — Protected PATCH endpoint to alter reservation statuses.

## Implementation notes
- Generation process: Divide the workday into fixed booking intervals (e.g. 45 mins). Exclude busy timeframes retrieved from `getFreeBusySlots`. Return only slot windows occurring fully within configured working hours and not overlapping with existing calendar events.
- Use Cal.com API v2 schemas for booking creation.
- Check API keys when constructing notifications. Handle missing email addresses or phone numbers gracefully without crashing the booking creation flow.
- FollowUp scheduler logic: Create a record with status `PENDING` and a `scheduledAt` timestamp calculated as 24 hours before the booking's `startTime`.

## Test steps
1. Connect a test Google Calendar.
2. Query `/api/bookings/slots` for a specific day. Verify that existing busy calendar blocks are omitted from the returned slots array.
3. Send a POST request to `/api/bookings/create` for a free slot. Verify that the event is successfully created on the Google Calendar, registers in Cal.com, and creates a database `Booking` record.
4. Verify email notification is received via Resend (use a dev mailbox or test keys) and SMS details are logged/sent via Twilio.
5. Check the `FollowUp` database table to confirm a reminder row is scheduled for 24 hours prior to the booking's start time.
6. Verify that trying to book the same slot again returns a validation error.
