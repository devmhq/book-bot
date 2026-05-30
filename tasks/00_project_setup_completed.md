# Task 00 — Project Setup

## Goal
Scaffold the Next.js 14 App Router project with TypeScript, install all necessary dependencies, configure Tailwind CSS and shadcn/ui, set up the base folder structure, and define the environment variables and cron job configurations.

## Prerequisites
- None

## Env vars needed
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (Prisma)
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres

# Anthropic
ANTHROPIC_API_KEY=your_anthropic_key

# OpenAI (embeddings only)
OPENAI_API_KEY=your_openai_key

# Google Calendar
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/oauth/callback

# Cal.com
CALCOM_API_KEY=cal_live_xxxx
CALCOM_BASE_URL=https://api.cal.com/v2

# WhatsApp Cloud API
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_VERIFY_TOKEN=your_whatsapp_verify_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Resend
RESEND_API_KEY=re_xxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# Encryption (for storing Google refresh tokens)
ENCRYPTION_KEY=your_32_byte_64_hex_encryption_key_here
```

## Acceptance criteria
1. Next.js 14 project is initialized with `create-next-app@latest` using TypeScript, ESLint, Tailwind CSS, and App Router, with the `src/` directory option disabled.
2. All specified npm dependencies are installed: `@anthropic-ai/sdk`, `openai`, `@prisma/client`, `prisma`, `@supabase/supabase-js`, `jose`, `resend`, `twilio`, `zod`, `date-fns`, `lucide-react`, and shadcn/ui initialized.
3. `.env.example` created in the root containing all variables with placeholder values.
4. `vercel.json` created in the root with a cron job configured for `/api/cron/followups` running daily at 9:00 AM UTC (`0 9 * * *`).
5. shadcn/ui is initialized with the `neutral` theme and base styles configured.
6. The entire project directory structure as specified in the master prompt is created, with `.gitkeep` files in empty subdirectories to preserve them in git.

## Files to create or modify
- [NEW] [.env.example](file:///Users/muhammadhaziq/Projects/misc/bookbot/.env.example) — Template for all environment variables.
- [NEW] [vercel.json](file:///Users/muhammadhaziq/Projects/misc/bookbot/vercel.json) — Configuration file for Vercel deployment, including cron job definition.
- [NEW] [tasks/.gitkeep](file:///Users/muhammadhaziq/Projects/misc/bookbot/tasks/.gitkeep) — Keep task directory.
- (All other required directory folders and `.gitkeep` files for structure scaffolding)

## Implementation notes
- Initialize Next.js project using `npx create-next-app@latest ./ --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"`.
- Run shadcn/ui CLI init using `npx shadcn-ui@latest init` (choose Neutral theme, global CSS in `app/globals.css`, CSS variables enabled).
- Install all core dependencies:
  `npm install @prisma/client @supabase/supabase-js jose resend twilio zod date-fns @anthropic-ai/sdk openai`
- Install dev dependencies:
  `npm install -D prisma esbuild`
- Ensure Vercel configuration (`vercel.json`) has the structure:
  ```json
  {
    "crons": [
      {
        "path": "/api/cron/followups",
        "schedule": "0 9 * * *"
      }
    ]
  }
  ```
- Scaffolding must include creation of empty folders/files matching the project layout structure with placeholder/empty content or `.gitkeep` where directories are empty.

## Test steps
1. Run `npm run dev` and verify that the local server starts successfully on `http://localhost:3000`.
2. Inspect `package.json` to verify all required dependencies are present.
3. Verify `vercel.json` contains the correct cron job setup.
4. Confirm `.env.example` is fully populated.
