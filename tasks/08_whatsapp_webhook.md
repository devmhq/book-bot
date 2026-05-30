# Task 08 — WhatsApp API Integration

## Goal
Integrate Meta's WhatsApp Cloud API. Set up routes for webhook token verification, incoming message signature checks, async processing of conversation pipeline calls, and outgoing reply messaging.

## Prerequisites
- Task 01 — Database Schema
- Task 06 — Core Chat API Endpoint

## Env vars needed
```env
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
```

## Acceptance criteria
1. `/api/whatsapp/webhook` handles GET requests from Meta containing `hub.verify_token` matching the environment variable, returning `hub.challenge`.
2. POST requests to `/api/whatsapp/webhook` are verified using `X-Hub-Signature-256` matching the app secret payload hash.
3. Hook handler parses payload, extracting sender ID (`waId`), message content, and recipient details (`phoneNumberId`).
4. Resolves the correct `Business` profile by comparing the incoming webhook phone ID with the database records.
5. Inbound processing is run asynchronously (returning a `200` response status immediately to prevent webhook timeouts).
6. Uses `waId` as the unique conversation session ID key.
7. Ignores receipt events (`statuses`) and gracefully filters out media elements (sending standard text notices that only text is supported for the MVP).
8. Outgoing messages are dispatched via HTTP POST calls matching the Meta Graph API schemas.

## Files to create or modify
- [NEW] [lib/whatsapp.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/whatsapp.ts) — Verification helpers, message posting, template dispatch methods.
- [NEW] [app/api/whatsapp/webhook/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/whatsapp/webhook/route.ts) — Endpoint handling verify handshakes and incoming webhook event blocks.
- [NEW] [app/api/whatsapp/send/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/whatsapp/send/route.ts) — Internal utility handler route for manually dispatching outbound messages.

## Implementation notes
- Run webhook verification: Meta requires responses within 20 seconds. Return 200 HTTP immediately upon payload validation, spawning the chatbot execution flow in the background (e.g., call a non-blocking helper: `void processIncomingMessage(...)`).
- Incoming messages payload format: Parse `entry[0].changes[0].value.messages[0]` blocks. Filter by `type === 'text'`. Reject others (e.g. image, audio) and return "Sorry, I can only read text messages".
- Meta URL target structure: `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages` authorization via Bearer access token.
- Signature checking uses `crypto.createHmac('sha256', appSecret)` verification on request stream buffers.

## Test steps
1. Perform a mock GET verification request `/api/whatsapp/webhook` supplying parameters. Confirm it responds with `hub.challenge` string.
2. Send a mock signed POST hook body to the webhook containing text payload, simulating an incoming user message. Verify response returns 200 immediately.
3. Monitor server execution logs to verify that the conversation pipeline runs in the background, Claude generates the response, and a WhatsApp API message call is sent.
4. Verify standard status delivery logs (`statuses` events) are safely ignored without throwing runtime errors.
