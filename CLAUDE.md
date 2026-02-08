# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**sokay** ("it's okay") is a mindful eating tracker that helps users build healthier relationships with food. Users set a budget of "sokay credits" (5-20) for treats over a timeframe (1-12 months), then track their indulgences without guilt. The app emphasizes balance and self-forgiveness over perfection.

## Key Technology Decisions

- **TanStack Start (RC)**: Full-stack React framework with SSR, server functions, and file-based routing
- **TanStack Router**: Type-safe routing with loaders, beforeLoad guards, and `router.invalidate()` for refresh
- **React 19.2.0**: Latest React version
- **Panda CSS v1.8**: CSS-in-JS engine with atomic CSS generation, configured via `panda.config.ts`
- **Park UI + Ark UI**: Accessible headless components (Ark UI) with styled layer (Park UI preset for Panda CSS)
- **Supabase**: Backend-as-a-Service for authentication and PostgreSQL database
- **TypeScript**: Strict mode enabled with paths configured (`@/*` -> `./src/*`)
- **Vite**: Build tool with TanStack Start plugin
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

# Regenerate Panda CSS styled-system
pnpm panda codegen

# Install dependencies
pnpm install
```

## Project Structure

```
src/
├── routes/
│   ├── __root.tsx           # Root HTML shell + ThemeProvider
│   ├── index.tsx            # Landing page
│   ├── login.tsx            # Login page (redirects authed users)
│   ├── signup.tsx           # Signup page (redirects authed users)
│   ├── dashboard.tsx        # Dashboard layout route (auth guard)
│   ├── dashboard/
│   │   ├── index.tsx        # Main dashboard (goal or setup)
│   │   └── history.tsx      # Full history with edit/delete
│   └── goal/
│       └── review/$id.tsx   # Goal review/completion page
├── components/
│   ├── ui/                  # Park UI style components (Panda CSS + Ark UI)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   └── index.ts
│   ├── dashboard-nav.tsx    # Navigation bar with logout + theme toggle
│   ├── goal-dashboard.tsx   # Active goal display + debit form
│   ├── goal-review.tsx      # Goal completion review
│   ├── goal-setup-form.tsx  # New goal creation form
│   ├── history-view.tsx     # History with edit/delete
│   ├── theme-provider.tsx   # Dark/light mode context
│   └── theme-toggle.tsx     # Sun/moon toggle button
├── server/
│   ├── auth.ts              # Server functions: getUser, requireUser, logout
│   ├── goals.ts             # Server functions: createGoal, completeGoal
│   └── debits.ts            # Server functions: createDebit, updateDebit, deleteDebit
├── lib/
│   └── supabase/
│       ├── client.ts        # Browser client (import.meta.env)
│       └── server.ts        # Server client (getRequest for cookies)
├── types/
│   └── database.ts          # TypeScript types for database
├── router.tsx               # Router configuration
├── index.css                # Panda CSS layers + Inter font
└── routeTree.gen.ts         # Auto-generated route tree (do not edit)
styled-system/               # Auto-generated Panda CSS output (gitignored)
panda.config.ts              # Panda CSS config with Park UI preset
vite.config.ts               # Vite config with TanStack Start plugin
```

## Architecture Notes

### Database Schema

Run `supabase-schema.sql` in your Supabase SQL editor to set up the database. Key tables:

- **goals**: User goals with credits, duration, status (active/completed/reviewing)
- **debits**: Individual treat entries linked to goals with food names
- Row Level Security (RLS) enabled - users can only access their own data

### Authentication Flow

1. **Route Guards**: `beforeLoad` in route files calls `requireUser()` server function
2. **Server Functions**: All mutations go through `createServerFn` with server-side auth
3. **Protected Routes**: `/dashboard`, `/goal` require auth via `requireUser()`
4. **Auth Pages**: `/login` and `/signup` redirect to `/dashboard` if already authenticated
5. **Supabase Clients**:
   - `client.ts`: Browser-side (uses `import.meta.env.VITE_SUPABASE_*`)
   - `server.ts`: Server-side (uses `getRequest()` from TanStack Start for cookies)

### Data Loading Pattern

- Route `loader` functions call server functions for data fetching
- Components consume data via `Route.useLoaderData()`
- After mutations, call `router.invalidate()` to re-run loaders

### User Flow

1. User signs up/logs in → redirected to `/dashboard`
2. If no active goal → shows goal setup form
3. User creates goal → dashboard shows credits and debit button
4. User logs treats → debits reduce available credits
5. View full history at `/dashboard/history` with edit/delete capabilities
6. When goal period ends or credits run out → user must review goal at `/goal/review/$id`
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

- **Panda CSS** configured via PostCSS (`@pandacss/dev/postcss`)
- **Park UI preset** provides Radix Colors (teal accent, neutral gray), semantic tokens, and component recipes
- **Dark mode**: `.dark` class on `<html>`, toggled via ThemeProvider + localStorage
- UI components in `src/components/ui/` use Panda CSS `css()` + Ark UI headless primitives
- Font: Inter Variable via `@fontsource-variable/inter`

### TypeScript Configuration

- Path alias `@/*` maps to `./src/*`
- `baseUrl: "."` allows importing `styled-system/*` directly
- Strict mode enabled
- Module resolution: `bundler`

## Environment Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `supabase-schema.sql` in the SQL Editor
3. Copy `.env.local.example` to `.env.local`
4. Add your Supabase URL and anon key:
   - `VITE_SUPABASE_URL=your-project-url`
   - `VITE_SUPABASE_ANON_KEY=your-anon-key`
5. Run `pnpm install` and `pnpm dev`
