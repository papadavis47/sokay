# AGENTS.md

Guidance for AI agents working on **Sokay** — a mindful-eating tracker where users set a small "sokay credits" limit over a time window and log treats against that limit.

## Tech Stack

- **Framework**: TanStack Start + TanStack React Router (file-based routing)
- **UI**: React 19, Park UI / Ark UI primitives, Panda CSS (`styled-system/`), `lucide-react` icons
- **Backend**: TanStack Start server functions (`createServerFn`) running in the same Vite app
- **Auth**: Supabase Auth via `@supabase/ssr` (browser + server clients)
- **Database**: Supabase Postgres accessed through Drizzle ORM (`postgres-js` driver)
- **Tooling**: Vite, TypeScript (strict), ESLint, pnpm, Panda CSS codegen

## Commands

```bash
pnpm dev            # vite dev server on http://localhost:3000
pnpm build          # production build
pnpm start          # run built server (node .output/server/index.mjs)
pnpm lint           # eslint src
pnpm prepare        # panda codegen — regenerates styled-system/
```

Always use **pnpm**, never npm or yarn. Run `pnpm prepare` after changing `panda.config.ts` or adding new Panda tokens.

## Project Layout

```
src/
├── routes/                  # TanStack Router file-based routes
│   ├── __root.tsx           # root layout, theme bootstrap
│   ├── index.tsx            # marketing/landing
│   ├── login.tsx, signup.tsx
│   ├── dashboard.tsx        # /dashboard layout (auth-gated via beforeLoad)
│   ├── dashboard/
│   │   ├── index.tsx        # /dashboard — active goal or setup form
│   │   └── history.tsx      # /dashboard/history
│   └── goal/review/$id.tsx  # /goal/review/:id — end-of-cycle review
├── components/
│   ├── ui/                  # primitives (button, card, dialog, input, textarea, label, select, slider)
│   ├── brand-mark.tsx       # shared "sokay / Process, not perfection" wordmark
│   ├── dashboard-nav.tsx, footer.tsx, theme-provider.tsx, theme-toggle.tsx
│   ├── goal-setup-form.tsx, goal-dashboard.tsx, goal-review.tsx
│   └── history-view.tsx
├── server/                  # server functions (createServerFn)
│   ├── auth.ts              # getUser, requireUser, logout
│   ├── goals.ts             # createGoal, completeGoal
│   └── debits.ts            # createDebit, updateDebit, deleteDebit
├── lib/
│   ├── db/                  # drizzle client + schema
│   └── supabase/            # client.ts (browser), server.ts (SSR cookies)
├── types/database.ts        # re-exports + view-model types
├── router.tsx, routeTree.gen.ts, index.css
```

`routeTree.gen.ts` is **generated** by the TanStack Start Vite plugin — do not hand-edit it.

`styled-system/` is **generated** by Panda — do not hand-edit it; it's gitignored from lint via `eslint.config.mjs`.

## Path Aliases

- `@/*` → `./src/*`
- `styled-system/*` → `./styled-system/*`

Always import via aliases (e.g. `import { Button } from '@/components/ui/button'`, `import { css } from 'styled-system/css'`). No relative `../../` imports across top-level directories.

## Data Model

Two tables defined in both `src/lib/db/schema.ts` (Drizzle) and `supabase-schema.sql` (SQL with RLS). **Keep them in sync.**

- `goals` — `userId`, `totalCredits` (5–20), `durationMonths` (1|2|3|6|12), `startDate`, `endDate`, `status` (`active` | `completed` | `reviewing`)
- `debits` — `goalId` (cascade), `userId`, `foodName`, `notes` (nullable, ≤250 chars — enforced by a `check` constraint and re-validated in the server function), `debitedAt`

Row Level Security is enforced in Supabase: every row is filtered by `auth.uid() = user_id`. **Every server function must scope its queries by the authenticated `user.id`** (do not rely on RLS alone since Drizzle uses the service-side connection).

## Server Functions Pattern

All mutations and protected reads live in `src/server/*.ts` using `createServerFn`. The canonical shape:

```ts
export const doThing = createServerFn({ method: 'POST' })
  .inputValidator((data: { ... }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()                  // from @/lib/supabase/server
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })
    // ...drizzle query scoped with eq(table.userId, user.id)
    return { success: true }
  })
```

Rules:
- Always call `supabase.auth.getUser()` and redirect if missing.
- Always include `eq(table.userId, user.id)` in `where(and(...))` for updates/deletes.
- Validate inputs in `.inputValidator` — keep payload shapes minimal.
- After a mutation on the client, call `router.invalidate()` to refresh loader data.

## Routing & Auth

- Auth-gated subtree: `src/routes/dashboard.tsx` uses `beforeLoad: async () => ({ user: await requireUser() })` and exposes the user via `Route.useRouteContext()`.
- Page data is fetched in route `loader`s by calling a `createServerFn` (see `src/routes/dashboard/index.tsx`).
- Use `redirect({ to: '/...' })` from server functions / loaders for navigation guards (e.g. force a user with a `reviewing` goal to `/goal/review/$id`).

## Styling

- Use Panda's `css({...})` from `styled-system/css` for all styling. No CSS modules, no inline `style`, no Tailwind.
- Use the theme tokens from `@park-ui/panda-preset` (teal accent, neutral gray, `radius: 'md'`): `bg.canvas`, `fg.default`, `fg.muted`, `colorPalette.*`, `gray.a2`, `red.11`, etc.
- Compose primitives from `@/components/ui/*` instead of reaching into Ark UI directly.
- Dark mode is toggled by adding/removing `dark` on `<html>` — the inline script in `__root.tsx` hydrates it from `localStorage('sokay-theme')`. Use `ThemeProvider` / `ThemeToggle` rather than touching the DOM directly.

## Environment

Required (read on both client and server):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `DATABASE_URL` — Postgres connection string for Drizzle (server only)

Browser code uses `import.meta.env.VITE_*`; server code uses `process.env.*`.

## Conventions

- TypeScript strict mode; no `any`. Re-use the Drizzle-inferred types (`Goal`, `Debit`, `NewGoal`, `NewDebit`) from `@/lib/db/schema` (also re-exported via `@/types/database`).
- Components are function declarations with explicit prop interfaces (see `HistoryViewProps` in `src/components/history-view.tsx`).
- File naming: kebab-case for component files (`goal-setup-form.tsx`), PascalCase exports.
- Keep server logic out of components — call server functions from event handlers / loaders.
- Run `pnpm lint` before declaring a task done.

## Things Not to Do

- Don't edit `routeTree.gen.ts`, `styled-system/`, `.output/`, `.tanstack/`, or `dist/`.
- Don't add a second styling system (Tailwind, CSS modules, emotion).
- Don't bypass `requireUser` / `getUser` checks in server functions.
- Don't change the Drizzle schema without also updating `supabase-schema.sql` and the SQL `check` constraints (credits 5–20, duration in {1,2,3,6,12}, status enum).
- Don't introduce a new ORM, query builder, or HTTP framework — server functions + Drizzle is the pattern.
