# Task 15 — UI Implementation from Wireframes

## Goal
Implement a pixel-perfect, dark-themed responsive UI from the provided wireframe designs. Use Tailwind CSS and shadcn/ui components to match layout structures, margins, color tokens, and interface interactions.

## Prerequisites
- Task 00 — Project Setup
- Task 02 — JWT Authentication
- Task 03 — Business Onboarding and Settings
- Task 11 — Leads Management Dashboard
- Task 12 — Analytics Dashboard
- Task 13 — Lemon Squeezy Billing Integration

## Env vars needed
- None

## Acceptance criteria
1. All five wireframe HTML files are preserved in `/wireframes/` in the repository root for developer reference.
2. Global styles are defined in `globals.css` using custom CSS variables for colors, typography, and border radius tokens.
3. Import and load `DM Sans` (main UI font) and `DM Mono` (monospace lists/metadata/timestamps) from Google Fonts via `next/font/google` in `app/layout.tsx`.
4. All dashboard sidebar elements, metric cards, status badges, and chart wrappers are built as modular, reusable React components.
5. All auth views, multi-step onboarding pages, dashboard layouts, lead sheets, settings tabs, and billing displays are fully rendered.
6. The dashboard sidebar navigation correctly flags active items according to the current active route.
7. Click interactions on leads table rows successfully slide open the detailed lead panel from the right edge, closing when clicking the cancel button.
8. The slot selector interface mounts directly inline in the user chat feed (not inside overlay popups or modals) matching the widget mockups.
9. Badge styles use color presets matching the wireframe designs exactly.
10. The UI is mobile responsive, with the dashboard sidebar collapsing into a hamburger drawer menu on screens smaller than 768px.

## Files to create or modify
- [MODIFY] [app/layout.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/layout.tsx) — Load Google fonts and set default text styles.
- [MODIFY] [app/globals.css](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/globals.css) — Declare custom CSS variables for the color palette, borders, and margins.
- [NEW] [components/dashboard/Sidebar.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/Sidebar.tsx) — Navigation menu.
- [NEW] [components/dashboard/MetricCard.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/MetricCard.tsx) — Overview statistics card.
- [NEW] [components/dashboard/LeadRow.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/LeadRow.tsx) — Lead list row.
- [NEW] [components/dashboard/LeadSlideOver.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/LeadSlideOver.tsx) — Lead details drawer.
- [NEW] [components/dashboard/ChannelBadge.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/ChannelBadge.tsx) — Channel badge.
- [NEW] [components/dashboard/StatusBadge.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/StatusBadge.tsx) — Lead status badge.
- [NEW] [components/dashboard/UsageBar.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/UsageBar.tsx) — Usage progress meter.
- [NEW] [components/dashboard/PlanCard.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/PlanCard.tsx) — Plan upgrade options.
- [NEW] [components/dashboard/ChartCard.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/dashboard/ChartCard.tsx) — Chart container.
- [NEW] [components/settings/ToggleRow.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/settings/ToggleRow.tsx) — Settings toggle.
- [NEW] [components/settings/HoursGrid.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/settings/HoursGrid.tsx) — Working hours schedule grid.
- [NEW] [components/settings/EmbedCodeBox.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/settings/EmbedCodeBox.tsx) — Code snippet display.
- [NEW] [components/settings/ConnectedBadge.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/settings/ConnectedBadge.tsx) — Integration status indicator.
- [NEW] [components/onboarding/StepIndicator.tsx](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/onboarding/StepIndicator.tsx) — Stepper header.

## Implementation notes
- Color palette setup:
  ```css
  :root {
    --bg-base: #0f0f11;
    --bg-surface: #16151a;
    --bg-elevated: #1a1820;
    --bg-deep: #111014;
    --border: #2a2830;
    --border-subtle: #1e1c24;
    --text-primary: #f0eeff;
    --text-body: #e8e6f0;
    --text-muted: #9896a8;
    --text-dim: #7a7890;
    --text-ghost: #55535f;
    --text-dead: #45434f;
    --accent: #6c5ce7;
    --accent-hover: #7d6ef5;
    --accent-soft: #2a1f4a;
    --accent-text: #9b8cf5;
    --green: #5dcaa5;
    --green-soft: #1a2e22;
    --amber: #f0c070;
    --amber-soft: #2e2010;
    --red: #e88080;
    --red-soft: #2a1a1a;
  }
  ```
- Google Fonts configuration: Import fonts in `app/layout.tsx` using `next/font/google` and configure Tailwind CSS theme variables to load them by default.
- Layouts: All dashboard interfaces must use a dark theme. Do not add a light theme toggle.
- Onboarding stepper: Implement the onboarding steps as separate sub-pages (`/onboarding/1`, `/onboarding/2`, etc.) sharing a layout containing `StepIndicator`.
- Chat bubbles layout: Ensure user message text matches the purple color accents, while bot agent answers match the neutral theme containers.

## Test steps
1. Run `npm run dev` and navigate to `/login` to verify it matches the `01_auth.html` wireframe design.
2. Navigate to `/signup` to verify the inputs matches the `01_auth.html` wireframe design.
3. Access `/onboarding/1` and click through all steps. Verify that the step indicators update and the pages match the `02_onboarding.html` wireframes.
4. Open `/dashboard` to verify the sidebar, performance cards, line/bar charts, and recent activity display correctly.
5. Click a lead row to open the drawer. Verify that the drawer slides in, displays the message transcript bubbles, and the status controls update correctly.
6. Open `/dashboard/settings` and verify the General, AI Config, Hours, and Embed Code tabs match the wireframe designs.
7. Open `/dashboard/billing` and verify that the plan details cards, billing badges, and current status are displayed correctly.
8. Embed the chat widget in a test page and verify the layout, floating launcher bubble, and inline calendar slot buttons match the widget designs.
