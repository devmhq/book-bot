# Task 14 — Production Deployment

## Goal
Deploy the complete BookBot application to Vercel, run Prisma database migrations against the production database, configure all webhooks and keys, enable Cron Jobs, and execute a comprehensive end-to-end smoke test of all user flows.

## Prerequisites
- Tasks 00 through 13
- Task 15 — UI wireframes implementation

## Env vars needed
All environment variables configured in `.env.example` must be defined with production values in the hosting panel.

## Acceptance criteria
1. Production environment variables are set up in the Vercel dashboard.
2. The database is initialized and migrated to the production Supabase database using `npx prisma migrate deploy`.
3. The custom `match_chunks` RPC function and `ivfflat` index are registered on the production database.
4. WhatsApp webhook endpoints are verified and running in the Meta Developer Console.
5. Cal.com and Lemon Squeezy webhook endpoints are set to the production URL.
6. The chat widget build step successfully outputs `/public/widget.js` prior to compiling the Next.js application.
7. End-to-end smoke testing verification is completed and all flows succeed.

## Files to create or modify
- This task involves configuration, validation, and deployment steps. No new code files are created.

## Implementation notes
- Generate cryptographic secrets for production:
  - `ENCRYPTION_KEY`: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` to get a 64-character hex string.
  - `JWT_SECRET`: Run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` to get a 128-character hex string.
- Database deployment: Run `npx prisma migrate deploy` in your build environment. Avoid running `migrate dev` in production to prevent schema loss.
- WhatsApp Webhook requirements: Ensure SSL is enabled (Vercel provides this by default) and hook signatures match WhatsApp API standards.
- Build sequence validation: Ensure that the Next.js build command is set to `npm run build` which runs the ESBuild script before Next.js build.

## Test steps
1. Deploy the code to Vercel and verify the build completes without errors.
2. Sign up as a new business on the production URL.
3. Complete the onboarding steps (input business details, FAQ contents, and working hours).
4. Connect Google Calendar and verify status updates to connected.
5. Embed the production widget script into a test web page. Verify that the launcher bubble is displayed and the welcome message renders.
6. Send a sample inquiry to the widget. Verify the RAG engine retrieves context and Claude generates a response.
7. Book an appointment using the inline widget. Verify that:
   - The booking registers in the database and the Google Calendar.
   - Confirmation emails and SMS alerts are received.
   - A reminder `FollowUp` is scheduled in the database.
8. Verify that the Vercel Cron Job runs successfully by checking the logs in the Vercel dashboard.
9. Send an incoming message to the registered WhatsApp number. Verify that the chatbot processes the message and sends a response.
