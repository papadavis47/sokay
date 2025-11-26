# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**sokay** ("it's okay") is a mindful eating tracker that helps users build healthier relationships with food. Users set a budget of "sokay credits" (5-20) for treats over a timeframe (1-12 months), then track their indulgences without guilt. The app emphasizes balance and self-forgiveness over perfection.

## Key Technology Decisions

- **Next.js 16.0.2**: Using the latest stable version with App Router architecture
- **React 19.2.0**: Latest React version
- **Tailwind CSS v4.1.17**: Recently migrated from Chakra UI to Tailwind v4 (see commit d724fa5)
- **Shadcn UI**: Component library built on Radix UI primitives
- **Supabase**: Backend-as-a-Service for authentication and PostgreSQL database
- **TypeScript**: Strict mode enabled with paths configured (`@/*` -> `./src/*`)
- **Package Manager**: pnpm

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Install dependencies
pnpm install
```

## Project Structure

```
src/
├── app/
│   ├── dashboard/           # Protected dashboard routes
│   │   ├── layout.tsx       # Dashboard layout with auth check
│   │   └── page.tsx         # Main dashboard (shows goal or setup)
│   ├── goal/
│   │   └── review/[id]/     # Goal review/completion page
│   ├── history/             # Full history with edit/delete
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── layout.tsx           # Root layout with Inter font
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # Shadcn UI components
│   ├── dashboard-nav.tsx    # Navigation bar with logout
│   ├── goal-dashboard.tsx   # Active goal display + debit form
│   ├── goal-review.tsx      # Goal completion review
│   ├── goal-setup-form.tsx  # New goal creation form
│   └── history-view.tsx     # History with edit/delete
├── lib/
│   ├── supabase/            # Supabase clients
│   │   ├── client.ts        # Browser client
│   │   ├── server.ts        # Server client (async cookies)
│   │   └── middleware.ts    # Auth middleware
│   └── utils.ts             # Tailwind merge utility
├── types/
│   └── database.ts          # TypeScript types for database
├── styles/
│   └── main.css             # Tailwind + theme variables
└── proxy.ts                 # Next.js proxy (middleware) for auth
```

## Architecture Notes

### Database Schema

Run `supabase-schema.sql` in your Supabase SQL editor to set up the database. Key tables:

- **goals**: User goals with credits, duration, status (active/completed/reviewing)
- **debits**: Individual treat entries linked to goals with food names
- Row Level Security (RLS) enabled - users can only access their own data

### Authentication Flow

1. **Proxy** (`src/proxy.ts`): Intercepts all requests, refreshes auth tokens (Next.js 16+ proxy pattern)
2. **Protected Routes**: `/dashboard`, `/goal`, `/history` redirect to `/login` if not authenticated
3. **Auth Pages**: `/login` and `/signup` redirect to `/dashboard` if already authenticated
4. **Supabase Clients**:
   - `client.ts`: Browser-side (client components)
   - `server.ts`: Server-side (server components, uses async cookies in Next.js 16)
   - `middleware.ts`: Proxy-specific client (legacy name, still works)

### User Flow

1. User signs up/logs in → redirected to `/dashboard`
2. If no active goal → shows goal setup form
3. User creates goal → dashboard shows credits and debit button
4. User logs treats → debits reduce available credits
5. View full history at `/history` with edit/delete capabilities
6. When goal period ends or credits run out → user must review goal at `/goal/review/[id]`
7. After review → goal marked as completed, user can start a new goal

### Goal States

- **active**: Current goal in progress
- **reviewing**: Goal period ended or credits depleted, needs user review
- **completed**: User reviewed and completed the goal

### Key Business Rules

- Users can only have ONE active goal at a time
- Credits range: 5-20
- Duration options: 1, 2, 3, 6, or 12 months
- Debits can be edited or deleted at any time (full undo/edit)
- Food name is required when logging a treat

### Styling Setup

- **Tailwind v4** is configured via PostCSS (`@tailwindcss/postcss`)
- Theme variables in `src/styles/main.css` using `@theme` directive
- **Shadcn UI** components in `src/components/ui/`
- Font: Inter (Google Font) configured as CSS variable `--font-inter` in layout

### TypeScript Configuration

- Path alias `@/*` maps to `./src/*`
- Strict mode enabled
- JSX pragma: `react-jsx`
- Module resolution: `bundler`

## Environment Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase-schema.sql` in the SQL Editor
3. Copy `.env.local.example` to `.env.local`
4. Add your Supabase URL and anon key from project settings
5. Run `pnpm install` and `pnpm dev`

## ESLint

- Uses Next.js recommended config (`next/core-web-vitals`, `next/typescript`)
- Flat config format (eslint.config.mjs)
