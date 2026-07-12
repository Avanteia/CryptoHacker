# CryptoHacker

A terminal-themed, interactive Solidity learning platform. Learners level up from
**Script Kiddie** to **Elite Hacker** by writing real smart-contract code chapter by
chapter, with instant validation, hints, XP, streaks, and badges — Free-Code-Camp/CryptoZombies
style, wrapped in a hacking-sim aesthetic.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** + **Prisma** ORM
- **NextAuth** — email/password (credentials) and Google OAuth
- **Monaco Editor** for the in-browser Solidity editor
- **Razorpay** subscriptions (Pro Monthly / Pro Yearly)
- **Vitest** for unit tests

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start Postgres** (via Docker):

   ```bash
   docker compose up -d
   ```

3. **Configure environment** — copy `.env.example` to `.env` and fill in the values.
   At minimum, `DATABASE_URL` and `NEXTAUTH_SECRET` are required to run locally.
   Google OAuth and Razorpay are optional for local development (registration/login
   still works via email+password, and lesson content works without payments
   configured — only the `/pricing` checkout flow needs Razorpay keys).

4. **Run migrations and seed the curriculum**:

   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

   This creates the full track/lesson/chapter tree (fundamentals quiz, Solidity
   basics, Solidity advanced, and the four Pro tracks) plus an admin placeholder
   user (`ADMIN_EMAIL` in `.env`, defaults to `admin@cryptohacker.dev` — sign in
   with Google using that address, or set a password for it manually, to reach
   `/admin`).

5. **(Optional) Set up Razorpay plans** — after filling in `RAZORPAY_KEY_ID` /
   `RAZORPAY_KEY_SECRET` in `.env`:

   ```bash
   npm run setup:razorpay
   ```

   This creates the Pro Monthly / Pro Yearly plans on your Razorpay account and
   stores their plan IDs locally. Also point a Razorpay webhook at
   `/api/razorpay/webhook` with the same secret as `RAZORPAY_WEBHOOK_SECRET`.

6. **Run the dev server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm run test
```

Covers the code-validation engine (`src/lib/validate.ts`) and the XP/rank system
(`src/lib/xp.ts`) — the two pieces of pure logic the rest of the app builds on.

## How the curriculum engine works

- Content lives in `prisma/seed.ts` as plain data (tracks → lessons → chapters),
  not hardcoded pages — adding a chapter means adding an entry to that file and
  re-running `npm run seed`.
- Each `CODE` chapter has a starter snippet, a solution, a hint, and a list of
  **validation rules** (`contains`, `not_contains`, `regex`, `order`) evaluated
  against the learner's submitted code in `src/lib/validate.ts`. Whitespace is
  normalized away before comparison, so formatting differences never cause a
  false failure.
- Each `QUIZ` chapter is a multiple-choice question checked against a stored
  answer — used for the non-code conceptual lessons (fundamentals, security
  theory, frontend integration).
- Completing a chapter awards XP and updates the learner's streak
  (`src/lib/gamification.ts`); completing every chapter in a lesson awards a
  badge and a lesson-completion XP bonus.
- Premium lessons are gated by `src/lib/access.ts`, checked at the data-access
  layer (API routes and server components) rather than in Next.js middleware,
  since Prisma can't run in the edge runtime.

## Project structure

```
prisma/schema.prisma   Data model (users, tracks/lessons/chapters, progress, badges, subscriptions)
prisma/seed.ts          Full curriculum content
src/app/                Routes (lessons, pricing, billing, admin, auth, API routes)
src/components/         UI (terminal theme), lesson player, billing, admin widgets
src/lib/                Validation engine, gamification, auth, access control, Razorpay client
scripts/setup-razorpay.ts  One-time Razorpay plan bootstrap
```
