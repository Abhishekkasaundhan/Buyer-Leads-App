# Buyer Lead Intake - Mini App

Stack: Next.js (App Router) + TypeScript, Prisma + SQLite, Zod, simple demo auth.

Setup
1. copy .env.example to .env and adjust DATABASE_URL if needed.
2. npm install
3. npx prisma migrate deploy
4. npx prisma db seed  # optional: seeds are included
5. npm run dev

Migrations
A basic migration is included under prisma/migrations/0001_init.

What's included
- Zod validation (shared client + server)
- SSR list with pagination and URL-synced filters
- CSV import/export endpoints
- Ownership checks (ownerId cookie-based demo auth)
- Simple rate-limit middleware
- One unit test for budget validator

What's skipped / notes
- Polished UI; the app provides functional pages and APIs.
- Auth is a demo cookie-based login for simplicity. Replace with real auth for production.
