# Task 01 — Database Schema

## Goal
Define the complete Prisma database schema including the `Business`, `BusinessUser`, `BusinessConfig`, `KnowledgeChunk`, `Lead`, `Conversation`, `Booking`, `FollowUp`, `CalendarToken`, and `Subscription` models, enable the pgvector extension on Supabase, and apply the initial migration and custom vector index.

## Prerequisites
- Task 00 — Project Setup

## Env vars needed
```env
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

## Acceptance criteria
1. `prisma/schema.prisma` is populated with all models, relational fields, constraints, and enums as specified.
2. The `pgvector` extension is enabled on the Supabase database.
3. Database migration is generated and successfully run against the Supabase database.
4. Custom SQL commands are executed to create the `ivfflat` index on the `KnowledgeChunk.embedding` vector field.
5. Prisma client is generated (`npx prisma generate`) and singleton client file `lib/prisma.ts` exists.

## Files to create or modify
- [NEW] [prisma/schema.prisma](file:///Users/muhammadhaziq/Projects/misc/bookbot/prisma/schema.prisma) — Database schema definition.
- [NEW] [lib/prisma.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/prisma.ts) — Prisma client singleton helper.

## Implementation notes
- Prisma Schema constraints:
  - `Business`: ID (UUID, default uuid), `slug` string (unique), `email` string, `phone` string, `whatsappPhoneId` string (optional), `plan` (enum: FREE, STARTER, GROWTH, PRO), `isActive` boolean (default true).
  - `BusinessUser`: ID (UUID), `businessId` (relation to `Business`), `email` string, `passwordHash` string, `role` (enum: OWNER, STAFF), `loginAttempts` Int (default 0), `lockedUntil` DateTime (optional).
  - `BusinessConfig`: ID (UUID), `businessId` (relation to `Business`, unique), `systemPrompt` text (optional), `welcomeMessage` text, `collectName` boolean (default true), `collectPhone` boolean (default true), `collectEmail` boolean (default true), `workingHours` Json, `timezone` string (default "UTC").
  - `KnowledgeChunk`: ID (UUID), `businessId` (relation to `Business`), `content` text, `embedding` `Unsupported("vector(1536)")`, `source` string.
  - `Lead`: ID (UUID), `businessId` (relation to `Business`), `name` string (optional), `phone` string (optional), `email` string (optional), `waId` string (optional), `channel` (enum: WIDGET, WHATSAPP, SMS), `status` (enum: NEW, CONTACTED, BOOKED, LOST), `notes` text (optional).
  - `Conversation`: ID (UUID), `leadId` (relation to `Lead`), `businessId` (relation to `Business`), `channel` (enum: WIDGET, WHATSAPP, SMS), `history` Json.
  - `Booking`: ID (UUID), `leadId` (relation to `Lead`), `businessId` (relation to `Business`), `calcomBookingId` string (optional), `calcomEventId` string (optional), `googleEventId` string (optional), `startTime` DateTime, `endTime` DateTime, `status` (enum: PENDING, CONFIRMED, CANCELLED), `notes` text (optional).
  - `FollowUp`: ID (UUID), `leadId` (relation to `Lead`), `businessId` (relation to `Business`), `channel` (enum: WIDGET, WHATSAPP, SMS), `message` text, `scheduledAt` DateTime, `sentAt` DateTime (optional), `status` (enum: PENDING, SENT, FAILED).
  - `CalendarToken`: ID (UUID), `businessId` (relation to `Business`, unique), `accessToken` text, `refreshToken` text, `expiresAt` DateTime.
  - `Subscription`: ID (UUID), `businessId` (relation to `Business`, unique), `lsSubscriptionId` string, `lsCustomerId` string, `lsVariantId` string, `status` string, `currentPeriodEnd` DateTime.
- SQL setup:
  - Execute SQL on Supabase SQL Editor: `CREATE EXTENSION IF NOT EXISTS vector;` before running Prisma migrations, or include it in a custom migration folder structure.
  - Indexing: Run index script `CREATE INDEX ON "KnowledgeChunk" USING ivfflat (embedding vector_cosine_ops);` after migration.

## Test steps
1. Run `npx prisma db push` or `npx prisma migrate dev --name init` and verify it succeeds.
2. Verify via Supabase console or `psql` that the tables were created in the schema.
3. Verify that the `ivfflat` index is active on the `KnowledgeChunk` table.
4. Verify that the Prisma client is successfully generated and exported via `lib/prisma.ts`.
