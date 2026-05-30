# Task 07 — Website Chat Widget

## Goal
Build a lightweight, production-ready embeddable chat widget in Vanilla JS. The widget is bundled into `public/widget.js` and dynamically renders a floating chat interface, fetches system configurations, streams server-side chat streams, handles mobile-responsive viewports, and displays inline lead forms.

## Prerequisites
- Task 00 — Project Setup
- Task 06 — Core Chat API Endpoint

## Env vars needed
- None

## Acceptance criteria
1. An endpoint `/api/widget/config?slug=SLUG` is publicly queryable and returns tenant styling parameters and business config values.
2. A single script tag integration mounts a floating bottom-right chat bubble on host HTML documents.
3. Clicking the bubble toggles a 360x520px chat panel (or a full-screen view on mobile devices).
4. The widget reads text streams using the `ReadableStream` API, writing response fragments character-by-character to simulate typing.
5. `sessionId` is stored inside `localStorage` associated with the business slug.
6. The widget renders structured inline lead inputs (name, phone, email) inside the conversation flow if the response requests structured data.
7. Design rules are strictly client-injected (custom stylesheet tags loaded dynamically). Primary colors are configurable via a script attribute `data-color`.
8. ESBuild task is added to `package.json` to compile `/components/widget/widget.src.js` to `/public/widget.js` during builds.

## Files to create or modify
- [MODIFY] [package.json](file:///Users/muhammadhaziq/Projects/misc/bookbot/package.json) — Add widget compile build directives.
- [NEW] [components/widget/widget.src.js](file:///Users/muhammadhaziq/Projects/misc/bookbot/components/widget/widget.src.js) — Core widget source script (DOM construction, event handling, state control, SSE streaming, styles).
- [NEW] [app/api/widget/config/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/widget/config/route.ts) — Public configuration loader endpoint.
- [NEW] [public/widget.js](file:///Users/muhammadhaziq/Projects/misc/bookbot/public/widget.js) — Compiled bundle file (output of ESBuild).

## Implementation notes
- ESBuild CLI execution command: `npx esbuild components/widget/widget.src.js --bundle --minify --outfile=public/widget.js`
- Append this build task to the Next.js compilation step in `package.json`: `"build": "npm run build:widget && next build"`.
- Widget styles must be injected into the DOM via a dynamically created `<style>` block in JavaScript.
- Avoid external libraries like Tailwind or jQuery inside the widget source file to keep the payload size small.
- Implement streaming using the browser's native `fetch` + `reader.read()` decoder loop:
  ```javascript
  const response = await fetch('/api/chat', { ... });
  const reader = response.body.getReader();
  // decode chunks here
  ```
- Lead Capture Hook: If the API response contains a specific JSON instruction payload or tag, render input elements (`<input type="text">` or similar) directly within the chat message list to make it easy for users to enter their details.

## Test steps
1. Run `npm run build:widget` and verify that the minified `public/widget.js` file is successfully generated.
2. Create a test `index.html` file in the `public/` folder, insert the script block pointing to a valid slug, and load it in a browser.
3. Verify that the launcher icon renders, opening the chat panel presents the welcome message, and messages stream in response.
4. Verify `localStorage` stores the session key correctly.
5. Trigger lead capture and ensure the inline forms render and process form submissions correctly.
