# AGENTS.md

Guidance for AI agents working on **Sokay** — a mindful-eating tracker where users set a small "sokay items" limit over a time window and log less than ideal against that limit.

## Tech Stack

- **Framework**: TanStack Start + TanStack React Router (file-based routing)
- **UI**: React 19, Park UI / Ark UI primitives, Panda CSS (`styled-system/`), `lucide-react` icons
- **Animation**: [Motion](https://motion.dev/docs/react) (`motion` package, imported from `motion/react`) — used for the mobile nav slide-out drawer; reach for it for any new motion/transitions
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

### Local Supabase (dev)

Dev runs against a **local Supabase stack** in Docker (free, unlimited); the cloud
free-tier project is reserved for prod. Requires Docker running.

```bash
supabase start            # boot local stack (API :54321, Studio :54323, DB :54322)
supabase status           # print URLs + keys (note: new CLI uses sb_publishable_* keys)
supabase db reset         # rebuild local DB from ALL migrations (wipes local data)
supabase migration up     # apply only pending migrations (preserves local data)
supabase stop             # shut the stack down
```

- `.env.local` points at the **local** stack for dev; the `VITE_SUPABASE_ANON_KEY`
  value is the local `sb_publishable_*` key. Prod values live commented below the
  DEV block (and in the deploy provider's env).
- **Migrations are the schema source of truth.** Add a new file under
  `supabase/migrations/` for any schema change — never edit an applied migration.
- Prod sync (later): `supabase link --project-ref <ref>` then `supabase db push`.
  See `learning/git-safety-and-prod-sync.md`.

## Project Layout

```
src/
├── routes/                  # TanStack Router file-based routes
│   ├── __root.tsx           # root layout, theme bootstrap
│   ├── index.tsx            # marketing/landing (composes HomeNav + HeroSection + HowItWorks + OriginStory)
│   ├── login.tsx, signup.tsx  # email/password + "Continue with GitHub" button
│   ├── auth/callback.tsx     # /auth/callback — OAuth code exchange, then redirect
│   ├── dashboard.tsx        # /dashboard layout (auth-gated; loads profile for nav)
│   ├── dashboard/
│   │   ├── index.tsx        # /dashboard — active goal or setup form
│   │   ├── history.tsx      # /dashboard/history
│   │   └── settings.tsx     # /dashboard/settings — edit display name
│   └── goal/review/$id.tsx  # /goal/review/:id — end-of-cycle review
├── components/
│   ├── ui/                  # primitives (button, card, dialog, input, textarea, label, select, slider)
│   ├── brand-mark.tsx       # shared "sokay / Progress, not perfection" wordmark
│   ├── avatar.tsx           # round avatar: image, or initials fallback on brand.subtle
│   ├── home-nav.tsx         # landing-page header (responsive; hamburger below md)
│   ├── dashboard-nav.tsx    # auth header (responsive; shows display name + Settings link)
│   ├── mobile-nav.tsx       # shared Motion slide-out drawer used by both navs
│   ├── github-auth-button.tsx # shared "Continue with GitHub" button (inline SVG)
│   ├── hero-section.tsx, how-it-works.tsx, origin-story.tsx  # landing-page sections
│   ├── footer.tsx, theme-provider.tsx, theme-toggle.tsx
│   ├── goal-setup-form.tsx, goal-dashboard.tsx, goal-review.tsx
│   └── history-view.tsx
├── server/                  # server functions (createServerFn)
│   ├── auth.ts              # getUser, requireUser, logout, exchangeCode
│   ├── profiles.ts          # getProfile, updateProfile, updateAvatar
│   ├── goals.ts             # createGoal, startGoalReview, completeGoal
│   └── debits.ts            # createDebit, updateDebit, deleteDebit
├── lib/
│   ├── db/                  # drizzle client + schema
│   └── supabase/            # client.ts (browser), server.ts (SSR cookies)
├── types/database.ts        # re-exports + view-model types
├── router.tsx, routeTree.gen.ts, index.css

supabase/                    # local Supabase stack config + migrations (committed)
├── config.toml             # stack + auth config (secrets via env() refs — safe to commit)
├── migrations/             # SQL migrations = schema source of truth (run local + prod)
└── .env.local              # GitHub OAuth creds for local dev (gitignored)
```

`routeTree.gen.ts` is **generated** by the TanStack Start Vite plugin — do not hand-edit it.

`styled-system/` is **generated** by Panda — do not hand-edit it; it's gitignored from lint via `eslint.config.mjs`.

## Path Aliases

- `@/*` → `./src/*`
- `styled-system/*` → `./styled-system/*`

Always import via aliases (e.g. `import { Button } from '@/components/ui/button'`, `import { css } from 'styled-system/css'`). No relative `../../` imports across top-level directories.

## Data Model

Three tables defined in `src/lib/db/schema.ts` (Drizzle), `supabase-schema.sql` (SQL with RLS), **and** `supabase/migrations/` (the applied source of truth). **Keep all three in sync.**

- `goals` — `userId`, `totalItems` (5–20, column `total_items`), `durationMonths` (1|2|3|6|12), `startDate`, `endDate`, `status` (`active` | `completed` | `reviewing`)
- `debits` — `goalId` (cascade), `userId`, `foodName`, `notes` (nullable, ≤250 chars — enforced by a `check` constraint and re-validated in the server function), `debitedAt`
- `profiles` — `id` (PK = `auth.users.id`, cascade delete), `displayName`, `avatarUrl`. One row per user, kept 1-to-1 with `auth.users` by an `on auth.users` insert trigger (`handle_new_user`, `security definer`). `display_name` is seeded with precedence: signup `options.data.display_name` → OAuth `full_name`/`name` → email local part. `display_name` and `avatar_url` are both editable later via `/dashboard/settings`; the avatar shows in `dashboard-nav.tsx` (falling back to initials via `avatar.tsx`).

### Avatars (Supabase Storage)

Avatar images live in a **public `avatars` storage bucket** (created in `supabase/migrations/*_avatars_bucket.sql`, mirrored in `supabase-schema.sql`). Files are stored per-user at `<user_id>/avatar.<ext>`; the folder name is the user id so `storage.objects` RLS can scope writes to the owner (`(storage.foldername(name))[1] = auth.uid()::text`) while reads stay public. The bucket caps uploads at 2 MiB and allows `image/jpeg|png|webp|gif`.

The **upload flow is client-side then server-persist**: the settings page uploads the file straight to Storage with the browser client (`upsert: true`), clears any prior file in the user's folder first (so a changed extension leaves no orphan), then calls the `updateAvatar` server fn to save the public URL (with a `?t=` cache-buster). "Remove" deletes the file(s) and sets `avatar_url` to `null`. Storage upsert needs INSERT + SELECT + UPDATE policies (all present), plus DELETE for remove/replace.

### Goal lifecycle

A goal moves `active → reviewing → completed`. Data is **never deleted** — completed goals and their debits stay queryable so users can review past cycles.

- **Time runs out:** the dashboard loader (`src/routes/dashboard/index.tsx`) lazily flips an `active` goal whose `endDate <= now` to `reviewing` and redirects to `/goal/review/$id`. There is no cron — the transition happens on the next dashboard load. The countdown UI clamps days-remaining at `0` (never negative).
- **Items run out:** logging is a **hard cap** — `createDebit` rejects inserts once `usedItems >= totalItems` (the active goal also can't be `reviewing`/`completed`). When the user clicks "Log an Item" at 0 items, the dashboard shows a dialog offering "Review & Start Over", which calls `startGoalReview` (sets `reviewing`) and routes to the review page.
- **Review → fresh start:** the review page's "Complete Goal & Start Fresh" calls `completeGoal` (sets `completed`); the dashboard then shows the setup form for a new goal.
- **History** (`/dashboard/history`) lists **all** of the user's goals (active + past) with status badges; selecting one shows its debits — editable only for the `active` goal, read-only otherwise.

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

- Auth-gated subtree: `src/routes/dashboard.tsx` uses `beforeLoad: async () => ({ user: await requireUser() })` and exposes the user via `Route.useRouteContext()`. Its `loader` also fetches the profile so the nav can show `displayName`.
- Page data is fetched in route `loader`s by calling a `createServerFn` (see `src/routes/dashboard/index.tsx`).
- Use `redirect({ to: '/...' })` from server functions / loaders for navigation guards (e.g. force a user with a `reviewing` goal to `/goal/review/$id`).

### Auth methods

- **Email/password** — `signInWithPassword` / `signUp` from the browser client on `login.tsx` / `signup.tsx`. Signup passes `options.data.display_name` from a "Display name" field.
- **GitHub OAuth** — `signInWithOAuth({ provider: 'github' })` via the shared `github-auth-button.tsx`, with `redirectTo` set to `/auth/callback`. The `/auth/callback` route's `beforeLoad` calls the `exchangeCode` server fn (`exchangeCodeForSession`), which sets the session cookies and redirects to `/dashboard`. Same-email accounts auto-link (one user, two identities).
- **Cookies** — `src/lib/supabase/server.ts` uses `getCookies` + `setCookie` from `@tanstack/react-start/server`. Use `setCookie` (which appends), **never** `setResponseHeader('Set-Cookie', …)` in a loop — that overwrites and drops Supabase's chunked auth cookies.
- **Client-side navigation after auth mutations** — server fns like `logout` just sign out and return; the component then does `router.invalidate()` + `router.navigate(...)`. A server-side `throw redirect()` does **not** navigate the browser when a server fn is called from a click handler (only inside loaders/`beforeLoad`).

### GitHub OAuth setup (env-specific)

- **Local**: a GitHub OAuth App with callback `http://127.0.0.1:54321/auth/v1/callback`; creds in `supabase/.env.local`; `enabled = true` in `[auth.external.github]` in `config.toml`.
- **Prod**: a _separate_ GitHub OAuth App with callback `https://<prod-ref>.supabase.co/auth/v1/callback`; creds entered in the cloud dashboard (Authentication → Providers → GitHub), not `config.toml`.

## Styling

- Use Panda's `css({...})` from `styled-system/css` for all styling. No CSS modules, no inline `style`, no Tailwind.
- Use the theme tokens from `@park-ui/panda-preset` (teal accent, neutral gray, `radius: 'md'`): `bg.canvas`, `fg.default`, `fg.muted`, `colorPalette.*`, `gray.a2`, `red.11`, etc.
- **Brand accent** (warm orange) lives as custom semantic tokens in `panda.config.ts` — use these, never hardcoded hex: colors `brand.solid`, `brand.solidHover`, `brand.onSolid`, the soft surface pair `brand.subtle` (tinted background) / `brand.border`, and shadows `brand` / `brandHover`. They carry their own light/dark values, so no `_dark` override is needed. Used for the "sokay" wordmark (`brand-mark.tsx`), landing heading highlights, the `cta` button, the balance/review item counts, the tinted summary cards, and the History goal selector. Prefer these over the teal `colorPalette.*` accent for anything that should read as "brand".
- Button variants (`@/components/ui/button.tsx`): `solid` (default), `outline`, `subtle`, `plain`, and `cta` — the warm brand-fill primary call-to-action (lifting shadow + a trailing `<svg>` icon that slides on hover). Use `cta` for the main conversion action on a page, not in dense nav.
- Compose primitives from `@/components/ui/*` instead of reaching into Ark UI directly.
- **Responsive nav**: both `home-nav.tsx` and `dashboard-nav.tsx` show an inline nav at `md+` and a hamburger below `md`. The hamburger opens the shared `mobile-nav.tsx` drawer — a Motion (`AnimatePresence`) slide-in panel portaled to `document.body` with a fading backdrop, Esc-to-close, body scroll-lock, and a render-prop `close` so links dismiss it on tap. Reuse `MobileNav` for any new responsive header rather than rolling another drawer.
- The Inter latin subset is **inlined as a base64 data URI** in `src/index.css` (`font-display: block`) so the font ships with the render-blocking CSS and is present at first paint — no FOUT / layout shift. Don't swap it back to an external `@font-face` + `<link rel="preload">`.
- Dark mode is toggled by adding/removing `dark` on `<html>` — the inline script in `__root.tsx` hydrates it from `localStorage('sokay-theme')`. Use `ThemeProvider` / `ThemeToggle` rather than touching the DOM directly.

## Environment

Required (read on both client and server) — in `.env.local` (gitignored):

- `VITE_SUPABASE_URL` — local: `http://127.0.0.1:54321`; prod: `https://<ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY` — local: `sb_publishable_*` from `supabase status`; prod: cloud key
- `DATABASE_URL` — Postgres connection string for Drizzle (server only); local: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

Browser code uses `import.meta.env.VITE_*`; server code uses `process.env.*`.

GitHub OAuth creds are **not** in `.env.local` — local creds live in `supabase/.env.local` (read by `config.toml` via `env()`), prod creds in the cloud dashboard.

## Conventions

- TypeScript strict mode; no `any`. Re-use the Drizzle-inferred types (`Goal`, `Debit`, `Profile`, `NewGoal`, `NewDebit`, `NewProfile`) from `@/lib/db/schema` (also re-exported via `@/types/database`).
- Components are function declarations with explicit prop interfaces (see `HistoryViewProps` in `src/components/history-view.tsx`).
- File naming: kebab-case for component files (`goal-setup-form.tsx`), PascalCase exports.
- Keep server logic out of components — call server functions from event handlers / loaders.
- Run `pnpm lint` before declaring a task done.

## Things Not to Do

- Don't edit `routeTree.gen.ts`, `styled-system/`, `.output/`, `.tanstack/`, or `dist/`.
- Don't add a second styling system (Tailwind, CSS modules, emotion).
- Don't bypass `requireUser` / `getUser` checks in server functions.
- Don't change the Drizzle schema without also updating `supabase-schema.sql` and the SQL `check` constraints (items 5–20, duration in {1,2,3,6,12}, status enum).
- Don't introduce a new ORM, query builder, or HTTP framework — server functions + Drizzle is the pattern.

## Learning Folder

- There is a gitignored folder in the root of this project - place information into this folder in the form of .md files - when asked to do so. Everything in the folder will also be gitignored. This is for educational purposes for learning more and more about web dev and programming, and this project as it is built. Do not place anything in this folder unless asked to do so.

## Status & Checklist (pick up here)

### Done ✅

- Local Supabase dev stack (Docker) wired up; `.env.local` points at local, prod values commented.
- Migrations as schema source of truth: `init_goals_debits` + `profiles`.
- Auth: email/password **and** GitHub OAuth (login/signup button + `/auth/callback`), same-email linking.
- Fixed `Set-Cookie` overwrite bug in `lib/supabase/server.ts` (now `getCookies`/`setCookie`).
- Fixed logout (client-side `invalidate` + `navigate`, no more dead-end).
- `profiles` table + insert trigger + RLS + backfill; "Display name" on signup.
- Editable display name at `/dashboard/settings`; nav shows display name; redirects to dashboard on save.
- Avatar support: public `avatars` Storage bucket + owner-scoped RLS; upload/change/remove on `/dashboard/settings`; avatar shown in nav (initials fallback).
- Learning notes: `learning/auth-and-dev-prod-supabase.md`, `learning/git-safety-and-prod-sync.md`.

### TODO (next steps)

- [ ] Tests: Vitest for server fns (`profiles`, `goals`, `debits` scoping); Playwright for auth flows (email, GitHub, logout, protected-route redirect).
- [x] Avatar support on `profiles` (upload via Supabase Storage, show in nav).
- [ ] Email confirmation flow (currently signup → straight to `/dashboard`; breaks if "confirm email" is enabled).
- [ ] Session refresh on navigation (tokens can go stale).
- [ ] Prod: create cloud GitHub OAuth app, `supabase link` + `supabase db push`, set deploy env vars.
- [ ] Decide deploy target (Netlify lowest-friction now; Cloudflare later — see `learning/auth-and-dev-prod-supabase.md` §6).
