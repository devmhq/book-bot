# Task 06 — Core Chat API Endpoint

## Goal
Build the public `/api/chat` endpoint to handle conversation pipelines, including routing incoming user messages, categorizing intents, pulling semantic context via RAG, building structured prompts, calling Claude, capturing lead details, and logging history.

## Prerequisites
- Task 01 — Database Schema
- Task 02 — JWT Authentication
- Task 05 — RAG Ingestion Pipeline

## Env vars needed
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Acceptance criteria
1. Public endpoint `/api/chat` handles POST requests containing `message`, `sessionId`, `businessSlug`, and `channel` properties.
2. The route maps the slug to a valid active business and conversation profile.
3. Message classifier queries Anthropic Claude API to bucket intents into `qa`, `booking`, `lead_capture`, or `greeting`.
4. Relevant knowledge document chunks are injected into the context prompt if classification is resolved as `qa` or `booking`.
5. Prompts are automatically populated with business details, working hours, and configuration preferences.
6. The Claude response is returned (as a text stream for WIDGET channels, and a complete JSON block for WhatsApp).
7. Lead extraction scans conversations, detects phone numbers, names, or emails, updating the `Lead` model accordingly.
8. Logs the ongoing exchange inside the JSON `history` attribute of the `Conversation` model.

## Files to create or modify
- [NEW] [lib/claude.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/claude.ts) — Anthropic client config and prompt invocation abstractions.
- [NEW] [app/api/chat/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/chat/route.ts) — Public API route managing orchestration, intent mapping, LLM completion, and data capture.

## Implementation notes
- Packages to install: `@ai-sdk/anthropic` and `ai` (Vercel AI SDK) for streaming response patterns.
- Classification Prompt: Keep it tiny to minimize latency. Instruct the model to return exactly one word.
- Lead capture extraction: When the `BusinessConfig` requires specific fields, and they aren't filled yet in `Lead`, run a secondary regex or Claude parsing check on the user's message after the conversational response is computed. Extract fields like names, emails, and phone numbers. Once all required details are stored, save/update a `Lead` record.
- Do NOT stream for the WhatsApp channel. WhatsApp requires a full payload. Ensure that if `channel === 'WHATSAPP'`, standard non-streaming client operations are used.
- History schema: `[{ role: "user" | "assistant", content: string, timestamp: string }]` stored inside `Conversation.history`. Restrict context window retrieval to the latest 8 messages.

## Test steps
1. Use HTTP utility to send a request to `/api/chat` with `channel: "WIDGET"` and check that text responses stream back token-by-token.
2. Send a chat request with a query asking about services (e.g. "What packages do you offer?"). Verify the system performs RAG context searches and Claude uses that context in the response.
3. Test a customer lead message (e.g. "My name is John Doe, email john@example.com"). Verify that a `Lead` record is generated in the database.
4. Verify history is updated in the `Conversation` database table.
