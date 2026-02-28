# ReviewBoost - AI Review Management SaaS

## What this is
AI-powered review management tool for single-location small businesses.
Montreal-based, bilingual (FR/EN), targeting Quebec market first.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Auth)
- Prisma ORM
- tRPC for type-safe APIs
- Stripe (billing), Twilio (SMS), SendGrid (email)
- Anthropic Claude API (AI review responses)
- Vercel (hosting)

## Key Commands
- `npm run dev` — start dev server
- `npx prisma migrate dev` — run migrations
- `npx prisma studio` — browse database

## Architecture Notes
- Multi-tenant by organization_id
- Background jobs via Trigger.dev
- PWA with service worker for push notifications
- i18n via next-intl (French + English)