# Task 12 — Analytics Dashboard

## Goal
Build the business analytics dashboard, rendering high-level performance cards, interactive line graphs, volume comparison bar charts, and a conversation funnel chart, using `recharts`.

## Prerequisites
- Task 02 — JWT Authentication
- Task 03 — Business Onboarding and Settings
- Task 11 — Leads Management Dashboard

## Env vars needed
- None

## Acceptance criteria
1. A dashboard page exists at `/dashboard/analytics` rendering four top-row performance cards: Monthly Conversations, Monthly Leads Captured, Monthly Bookings Confirmed, and Conversion Rate %.
2. The page renders three main responsive charts:
   - Line chart showing conversation volumes per day over the selected timeframe.
   - Bar chart showing lead numbers grouped by channel (Widget, WhatsApp, SMS).
   - Funnel chart showing the conversion pipeline: Conversations → Leads → Bookings.
3. The UI includes toggle buttons allowing users to filter statistics by 7-day, 30-day, and 90-day periods.
4. An `/api/analytics` endpoint handles data aggregations, returning values filtered by the authenticated user's `businessId`.
5. Includes empty state views that prompt users to share their widget if no analytics data is present.

## Files to create or modify
- [NEW] [app/(dashboard)/analytics/page.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/%28dashboard%29/analytics/page.tsx) — Main dashboard analytics page view containing chart sections and period toggles.
- [NEW] [app/api/analytics/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/analytics/route.ts) — Protected API route performing SQL aggregations and returning charts data.

## Implementation notes
- Dependency to install: `recharts`.
- Performance optimization: Perform database aggregations directly in Postgres using SQL queries or Prisma's aggregation API (`prisma.conversation.groupBy`, etc.) inside the route handler to avoid pulling massive lists of raw rows.
- Support date ranges by parsing search parameters: `?period=7d | 30d | 90d`.
- Make charts responsive by wrapping them in `ResponsiveContainer` components.
- Chart color rules: Use primary accent colors (`#6c5ce7` theme accent) for main chart elements and muted border styling to match the system theme.

## Test steps
1. Sign in and navigate to `/dashboard/analytics`. Verify the page renders successfully without errors.
2. Confirm the four metric cards display correct data based on the database state.
3. Toggle between the 7d, 30d, and 90d view filters and verify that the API receives the query parameter and updates the graphs with the correct date ranges.
4. Temporarily delete database data or view a newly created business profile to verify that the empty state is displayed correctly.
