# Original Prompt: BookBot

BookBot is an AI-powered customer inquiry and booking assistant for small businesses (salons, clinics, gyms, restaurants). It consists of:

1. **Embeddable Chat Widget**: Sits on a business's website.
2. **Business Dashboard**: View leads, bookings, and configure the AI.
3. **WhatsApp Channel**: Meta Cloud API integration.
4. **RAG-based Q&A Engine**: Powered by Claude API.
5. **Booking System**: Integrated with Google Calendar and Cal.com.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router (TypeScript) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Custom JWT using `jose` — httpOnly cookies, no Clerk, no NextAuth |
| Database | Supabase (PostgreSQL + pgvector extension) |
| ORM | Prisma |
| AI — conversation | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| AI — embeddings | OpenAI `text-embedding-3-small` |
| Booking | Cal.com API |
| Calendar | Google Calendar API (OAuth 2.0) |
| Email | Resend |
| SMS | Twilio |
| WhatsApp | Meta WhatsApp Cloud API (Graph API) |
| Payments | Lemon Squeezy |
| Scheduled jobs | Vercel Cron Jobs |
| Hosting | Vercel |
| Widget | Vanilla JS (built separately, served from /public) |

---

## Project Folder Structure

```
bookbot/
├── tasks/
│   ├── 00_project_setup.md
│   ├── 01_database_schema.md
│   ├── ...
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   └── api/
├── components/
│   ├── ui/
│   ├── dashboard/
│   └── widget/
├── lib/
├── middleware.ts
├── prisma/
│   └── schema.prisma
├── public/
│   └── widget.js
├── .env.example
└── vercel.json
```
