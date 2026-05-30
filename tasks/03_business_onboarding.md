# Task 03 — Business Onboarding and Settings

## Goal
Build the post-signup configuration dashboard containing sections for business profile details, AI welcome messages, toggles for collecting customer lead information, a working hours scheduler, and the integration embed code.

## Prerequisites
- Task 02 — JWT Authentication

## Env vars needed
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Acceptance criteria
1. A settings dashboard page is accessible at `/dashboard/settings` with four functional tabs: General, AI Config, Working Hours, and Embed Code.
2. The General Tab displays and saves business details (name, phone, email, and timezone selection).
3. The AI Config Tab captures and saves AI welcome messages, optional system prompts, and configuration flags for lead details (name, phone, email). It also includes a textarea for knowledge base content.
4. The Working Hours Tab enables configuring daily working schedules for Monday through Sunday, storing this information in the database.
5. The Embed Code Tab displays the copyable widget script block dynamically injected with the business's slug and hosts an iframe preview pointing to `/preview/[slug]`.
6. Client and server validate all payloads using `zod` schemas. Settings are modified via a protected `PATCH /api/settings` route handler.

## Files to create or modify
- [NEW] [app/(dashboard)/settings/page.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/%28dashboard%29/settings/page.tsx) — Main dashboard settings page view wrapping tabs and sub-forms.
- [NEW] [app/api/settings/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/settings/route.ts) — Protected PATCH handler saving business config and detail modifications.
- [NEW] [app/preview/[slug]/page.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/preview/%5Bslug%5D/page.tsx) — Public view for previewing how the widget behaves.

## Implementation notes
- Working hours payload must follow the JSON schema:
  ```typescript
  type DayConfig = { enabled: boolean; start: string; end: string };
  type WorkingHours = {
    mon: DayConfig; tue: DayConfig; wed: DayConfig; thu: DayConfig;
    fri: DayConfig; sat: DayConfig; sun: DayConfig;
  };
  ```
- Ensure timezone field supports major standard database timezone identifiers (e.g. `America/New_York`, `Europe/London`, `Asia/Karachi`).
- When saving the Knowledge Base textarea, the settings PATCH route must trigger an internal request or function call to the RAG ingestion pipeline (implemented in Task 05) to re-chunk and re-embed.
- Settings page must read authentication headers injected by the middleware to determine the current tenant's context (`x-business-id`).

## Test steps
1. Sign in, access `/dashboard/settings`, and verify all four tabs are rendered.
2. Edit company name and email under the General tab and save. Reload to verify changes persist.
3. Toggle "Collect Phone" to off, edit the welcome message, and save. Confirm the corresponding fields updated in the database.
4. Modify Monday's working hours to `08:00 - 17:00` and save. Verify the JSON content in `BusinessConfig` was correctly written.
5. Visit the Embed Code tab, copy the script block, and ensure the script URL resolves correctly to the host domain.
