# Task 11 — Leads Management Dashboard

## Goal
Build the dashboard interface for managing leads, featuring search filters for contact fields, channel status categorization tabs, server-paginated data grids, and an interactive slide-over detail panel showcasing customer chat history transcripts.

## Prerequisites
- Task 02 — JWT Authentication
- Task 03 — Business Onboarding and Settings

## Env vars needed
- None

## Acceptance criteria
1. A page exists at `/dashboard/leads` rendering a table of all captured customer leads.
2. The UI supports text searches (matching names, phone numbers, or emails) and dropdown filters (channel and status).
3. The page implements pagination loading 20 lead rows per page.
4. Clicking a row opens a slide-over details drawer (using shadcn's `Sheet` component) without changing the route.
5. The drawer displays contact details, booking records, dropdown controls for changing statuses, and auto-saves the notes textbox on blur.
6. The drawer displays the complete conversation history as alternate-styled message chat bubbles.
7. Data access checks enforce that businesses can only query, search, or modify their own lead records (matching the token's `businessId`).

## Files to create or modify
- [NEW] [app/(dashboard)/leads/page.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/%28dashboard%29/leads/page.tsx) — Main dashboard leads view containing searching, filtering, and the table list.
- [NEW] [app/api/leads/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/leads/route.ts) — Protected API route returning filtered, paginated leads for the authenticated business.
- [NEW] [app/api/leads/[id]/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/leads/%5Bid%5D/route.ts) — Protected PATCH API route for updating a single lead's status, notes, or info.

## Implementation notes
- Design colors for badges:
  - Channel badge colors: Widget = purple (`#6c5ce7` accent), WhatsApp = green (`#5dcaa5`), SMS = amber (`#f0c070`).
  - Status badge colors: New = blue (`#6c5ce7`/blue), Contacted = amber (`#f0c070`), Booked = green (`#5dcaa5`), Lost = gray (`#7a7890`).
- Slide-over Chat Layout: Bot assistant bubble aligns left using neutral borders and dark backgrounds. Customer user bubble aligns right with accent borders and soft purple backgrounds.
- Auto-saving notes: Bind notes text fields inside the slide-over panel with an `onBlur` trigger that sends updates to `PATCH /api/leads/[id]`.
- SQL safety: When querying database models, always filter by the authorized token context `businessId`.

## Test steps
1. Sign in and navigate to `/dashboard/leads`. Verify that a table containing captured leads is rendered.
2. Enter values in the search bar and verify that the table updates with matching records.
3. Apply channel and status filters. Verify that only matching leads are displayed.
4. Click on a lead row and verify that the detail slide-over drawer opens.
5. Review the conversation transcript bubbles to verify that alternating user/assistant message roles are styled correctly.
6. Edit the lead notes field, click outside the field to trigger blur, and reload the drawer to verify that the notes update persisted.
