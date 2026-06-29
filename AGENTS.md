# AGENTS.md

Guidance for AI agents working on **Sokay** — a mindful-eating tracker where users set a small "sokay items" limit over a time window and log less than ideal against that limit.

## Tech Stack

- **Framework**: TanStack Start + TanStack React Router (file-based routing)
- **UI**: React 19, Park UI / Ark UI primitives, Panda CSS (`styled-system/`), `lucide-react` icons
- **Animation**: [Motion](https://motion.dev/docs/react) (`motion` package, imported from `motion/react`) — used for the mobile nav slide-out drawer; reach for it for any new motion/transitions
- **Backend**: TanStack Start server functions (`createServerFn`) running in the same Vite app
- **Auth**: Supabase Auth via `@supabase/ssr` (browser + server clients)
- **Database**: Supabase Postgres accessed through Drizzle ORM (`postgres-js` driver)
- **Tooling**: Vite, TypeScript (strict), ESLint, Prettier (formatting), pnpm, Panda CSS codegen

## Commands

```bash
pnpm dev            # vite dev server on http://localhost:3000
pnpm build          # production build (emits dist/client + dist/server fetch handler)
pnpm serve          # run the built prod app locally on :3000 (loads .env.local)
pnpm start          # ⚠️ stale: points at .output/server/index.mjs, which this
                    #    build target does NOT emit — use `pnpm serve` instead,
                    #    or wire a hosting target before relying on it
pnpm lint           # eslint src
pnpm format         # prettier --write . (format all files)
pnpm format:check   # prettier --check . (CI-safe, no writes)
pnpm prepare        # panda codegen — regenerates styled-system/
```

Always use **pnpm**, never npm or yarn. Run `pnpm prepare` after changing `panda.config.ts` or adding new Panda tokens.

### Testing a production build locally

`vite dev` cannot reproduce prod-only behavior, so some things must be checked
against the built app. The known case: in **dev**, TanStack Start serves CSS via
a `/@tanstack-start/styles.css` middleware endpoint (`Cache-Control: no-store`)
and then, on hydration, Vite injects the styles as a `<style>` tag and **removes
that SSR stylesheet** (~700ms in). Removing/re-adding the stylesheet restarts any
running CSS animation — this is what makes the hero ring
(`src/landing/animated-sokay-mark.tsx`, a pure-CSS draw) **flicker ~20-30% into
its first draw on a cold `vite dev` load**. It is a **dev-only artifact**: the
prod build ships a single static `<link rel="stylesheet">` that is never swapped,
so there is no flicker. Verified via Playwright (dev logs a `LINK-` removal at
~700ms; prod logs none).

To test the prod build locally:

```bash
# 1. stop `pnpm dev` (it holds :3000)
pnpm build
pnpm serve            # → prod build serving on http://localhost:3000
# 2. hard-refresh http://localhost:3000 with DevTools open + "Disable cache"
#    (Network tab) to force a true cold load
```

`pnpm serve` runs `serve-prod.mjs` — a small, dependency-free runner (Node
built-ins only) that serves the static `dist/client/**` assets and routes
everything else to the `dist/server/server.js` fetch handler, mirroring what a
real host does. It loads `.env.local` via `--env-file`, so **local Supabase must
be running** for pages that fetch user/profile data. When forwarding the SSR
response it must emit `Set-Cookie` via `Headers.getSetCookie()` (an array), not
`Object.fromEntries(headers)` — the latter collapses Supabase's **chunked** auth
cookies into one header, which silently breaks server-set sessions (GitHub OAuth
callback lands back on `/login`). Harmless `notFoundError` warnings in its
console are just unmatched-path probes (Chrome DevTools `/.well-known/…`,
`/robots.txt`, etc.) hitting the router's default not-found — not a real error. `serve-prod.mjs` is **not**
part of the build graph (nothing imports it), isn't type-checked (tsconfig
includes only `.ts`/`.tsx`) or linted (`eslint src`), and is never auto-run by a
deploy platform — it is a local-only convenience and safe to keep or delete.

Real deploys still need a **hosting target/adapter** configured so `vite build`
emits the chosen platform's expected output (Netlify / Cloudflare / Vercel /
Node server); that is independent of `serve-prod.mjs`. See
`learning/auth-and-dev-prod-supabase.md` §6 for the Netlify-vs-Cloudflare notes.

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

The codebase is organized into **verticals** — top-level folders grouped by what
code _does_ (the domain), not by what it _is_ (component vs server fn vs util).
Everything for a domain — components, server functions, utils, types, tests —
lives together. See `learning/vertical-codebase-reorg.md` for the rationale.
Routes stay in `src/routes/` (TanStack file-based routing owns that tree) and act
as **thin entry points** that import the substance from the verticals.

```
src/
├── routes/                  # TanStack Router file-based routes (thin: loaders + wiring)
│   ├── __root.tsx           # root layout, theme bootstrap
│   ├── index.tsx            # marketing/landing (composes HomeNav + HeroSection + TemptationSection + HowItWorks + OriginStory)
│   ├── origin.tsx           # /origin — full long-form origin story (self-contained sections, not the landing OriginStory teaser)
│   ├── login.tsx, signup.tsx  # email/password + "Continue with GitHub" button
│   ├── auth/callback.tsx     # /auth/callback — OAuth code exchange, then redirect
│   ├── dashboard.tsx        # /dashboard layout (auth-gated; loads profile for nav)
│   ├── dashboard/
│   │   ├── index.tsx        # /dashboard — active goal or setup form
│   │   ├── history.tsx      # /dashboard/history
│   │   └── settings.tsx     # /dashboard/settings — edit display name
│   └── goal/review/$id.tsx  # /goal/review/:id — end-of-cycle review
├── design-system/           # reusable, domain-agnostic UI (the "core"); has a barrel index.ts
│   ├── index.ts            # barrel — import primitives via `design-system`
│   ├── button.tsx, card.tsx, dialog.tsx, input.tsx, textarea.tsx, label.tsx, select.tsx, slider.tsx
│   └── avatar.tsx          # round avatar: image, or initials fallback on brand.subtle; size `sm` (32px, nav) | `md` (40px) | `lg` (56px, settings)
├── layout/                  # app chrome (shared vertical)
│   ├── brand-mark.tsx       # shared "sokay / Progress, not perfection" wordmark
│   ├── sokay-mark.tsx
│   ├── home-nav.tsx         # landing-page header (responsive; hamburger below md)
│   ├── dashboard-nav.tsx    # auth header (responsive; shows display name + Settings link)
│   ├── mobile-nav.tsx       # shared Motion slide-out drawer used by both navs
│   ├── footer.tsx
│   └── theme-provider.tsx, theme-toggle.tsx
├── landing/                 # marketing-page sections vertical
│   └── hero-section.tsx, how-it-works.tsx, origin-story.tsx
├── auth/                    # auth vertical
│   ├── github-auth-button.tsx # shared "Continue with GitHub" button (inline SVG)
│   └── auth.ts             # server fns: getUser, requireUser, logout, exchangeCode
├── goals/                   # goals vertical (the core domain)
│   ├── goal-setup-form.tsx, goal-dashboard.tsx, goal-review.tsx, history-view.tsx
│   ├── goals.ts            # server fns: createGoal, startGoalReview, completeGoal
│   ├── debits.ts           # server fns: createDebit, updateDebit, deleteDebit
│   ├── duration.ts         # goal bounds (items 1-100, weeks/months max) + formatDuration
│   ├── types.ts           # re-exports (Goal, Debit) + view-model types (GoalWithDebits, GoalStatus, DurationUnit)
│   └── __tests__/         # goals.test.ts, debits.test.ts
├── profile/                 # profile vertical
│   ├── profiles.ts        # server fns: getProfile, updateProfile, updateAvatar
│   └── __tests__/profiles.test.ts
├── test/                    # shared test support (helpers.ts: createServerFn harness + db/supabase mocks)
├── theme/                   # Panda design-token + recipe source
│   └── recipes/             # config recipes consumed by design-system/ (button, card, dialog, …); registered in panda.config.ts
├── lib/                     # truly generic infra only
│   ├── db/                  # drizzle client + schema
│   └── supabase/            # client.ts (browser), server.ts (SSR cookies)
├── router.tsx, routeTree.gen.ts, index.css

supabase/                    # local Supabase stack config + migrations (committed)
├── config.toml             # stack + auth config (secrets via env() refs — safe to commit)
├── migrations/             # SQL migrations = schema source of truth (run local + prod)
└── .env.local              # GitHub OAuth creds for local dev (gitignored)
```

**Adding code:** put it in the vertical that owns its behavior. Reusable,
domain-agnostic UI → `design-system/`; app chrome → `layout/`. Server functions
are plain `.ts` files inside their vertical (e.g. `goals/goals.ts`) — **never**
`*.server.ts`: TanStack reserves the `*.server.*` filename for server-only
modules that must not reach the client, but `createServerFn` files are imported
by client routes/components, so that suffix breaks the build.

`routeTree.gen.ts` is **generated** by the TanStack Start Vite plugin — do not hand-edit it.

`styled-system/` is **generated** by Panda — do not hand-edit it; it's gitignored from lint via `eslint.config.mjs`.

## Path Aliases

- `@/*` → `./src/*`
- `design-system/*` → `./src/design-system/*`
- `styled-system/*` → `./styled-system/*`

Always import via aliases. Design-system primitives come from the `design-system`
barrel (e.g. `import { Button, Card } from 'design-system'`) or a direct file
(`import { Avatar } from 'design-system/avatar'`). Other verticals use `@/`
direct file imports (e.g. `import { createGoal } from '@/goals/goals'`,
`import { css } from 'styled-system/css'`). No relative `../../` imports across
top-level directories. (Aliases are declared in `tsconfig.json` and mirrored in
`vitest.config.ts`; Vite picks them up via `resolve.tsconfigPaths`.)

## Data Model

Three tables defined in `src/lib/db/schema.ts` (Drizzle), `supabase-schema.sql` (SQL with RLS), **and** `supabase/migrations/` (the applied source of truth). **Keep all three in sync.**

- `goals` — `userId`, `totalItems` (1–100, column `total_items`), `durationValue` + `durationUnit` (`'week'` 1–52 | `'month'` 1–12 — one unit per goal, never mixed), `startDate`, `endDate`, `status` (`active` | `completed` | `reviewing`). Limits + `formatDuration` live in `src/goals/duration.ts` — import from there, don't re-hardcode bounds.
- `debits` — `goalId` (cascade), `userId`, `foodName`, `notes` (nullable, ≤250 chars — enforced by a `check` constraint and re-validated in the server function), `debitedAt`
- `profiles` — `id` (PK = `auth.users.id`, cascade delete), `displayName`, `avatarUrl`. One row per user, kept 1-to-1 with `auth.users` by an `on auth.users` insert trigger (`handle_new_user`, `security definer`). `display_name` is seeded with precedence: signup `options.data.display_name` → OAuth `full_name`/`name` → email local part. `display_name` and `avatar_url` are both editable later via `/dashboard/settings`; the avatar shows in `dashboard-nav.tsx` (falling back to initials via `avatar.tsx`).

### Avatars (Supabase Storage)

Avatar images live in a **public `avatars` storage bucket** (created in `supabase/migrations/*_avatars_bucket.sql`, mirrored in `supabase-schema.sql`). Files are stored per-user at `<user_id>/avatar.<ext>`; the folder name is the user id so `storage.objects` RLS can scope writes to the owner (`(storage.foldername(name))[1] = auth.uid()::text`) while reads stay public. The bucket caps uploads at 2 MiB and allows `image/jpeg|png|webp|gif`.

The **upload flow is client-side then server-persist**: the settings page uploads the file straight to Storage with the browser client (`upsert: true`), clears any prior file in the user's folder first (so a changed extension leaves no orphan), then calls the `updateAvatar` server fn to save the public URL (with a `?t=` cache-buster). "Remove" deletes the file(s) and sets `avatar_url` to `null`. Storage upsert needs INSERT + SELECT + UPDATE policies (all present), plus DELETE for remove/replace.

### Goal lifecycle

A goal moves `active → reviewing → completed`. Data is **never deleted** — completed goals and their debits stay queryable so users can review past cycles.

- **Time runs out:** the dashboard loader (`src/routes/dashboard/index.tsx`) lazily flips an `active` goal whose `endDate <= now` to `reviewing` and redirects to `/goal/review/$id`. There is no cron — the transition happens on the next dashboard load. The countdown UI clamps days-remaining at `0` (never negative).
- **Items run out:** logging is a **hard cap** — `createDebit` rejects inserts once `usedItems >= totalItems` (the active goal also can't be `reviewing`/`completed`). At 0 items the "Log an Item" button does **not render at all**; the dashboard shows an inline notice card with a direct "Review & Start Over" button, which calls `startGoalReview` (sets `reviewing`) and routes to the review page.
- **End early (user in control):** while items remain, the dashboard shows an "End this goal early" link → confirm dialog → same `startGoalReview` path. Users can always bail on a goal and start fresh with new settings; settings of an existing goal are never edited in place.
- **Review → fresh start:** the review page's "Complete Goal & Start Fresh" calls `completeGoal` (sets `completed`); the dashboard then shows the setup form for a new goal.
- **History** (`/dashboard/history`) lists **all** of the user's goals (active + past) with status badges; selecting one shows its debits — editable only for the `active` goal, read-only otherwise.

Row Level Security is enforced in Supabase: every row is filtered by `auth.uid() = user_id`. **Every server function must scope its queries by the authenticated `user.id`** (do not rely on RLS alone since Drizzle uses the service-side connection).

## Server Functions Pattern

All mutations and protected reads live in each vertical (e.g. `src/goals/goals.ts`, `src/auth/auth.ts`) using `createServerFn`. The canonical shape:

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
- Validate inputs **inside the handler**, not (only) `.inputValidator` — the Vitest transform-free path skips the validator, so handler-side checks are what tests exercise and what every call path enforces (see `validateGoalInput` in `goals.ts`). Keep payload shapes minimal.
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
- Button variants (`src/design-system/button.tsx`): `solid` (default), `outline`, `subtle`, `plain`, and `cta` — the warm brand-fill primary call-to-action (lifting shadow + a trailing `<svg>` icon that slides on hover). Use `cta` for the main conversion action on a page, not in dense nav.
- **Text color on solid-fill buttons:** the `solid` (default) and `cta` variants fill with `brand.solid`, so their label must be `brand.onSolid` (the recipe already sets this). Don't override a solid/default button's `color` to `brand.solid` — that's orange-on-orange and unreadable. `brand.solid` text is only for transparent-bg variants (`outline`/`plain`/`subtle`) and on-canvas text (wordmark, headings).
- Compose primitives from `design-system` instead of reaching into Ark UI directly.
- **Design-system primitives are Panda config recipes; override them with a plain `className={css({...})}`.** Each primitive's styles live in a **config recipe** under `src/theme/recipes/*.ts` (`defineRecipe` for single elements: `button`/`input`/`textarea`/`label`; `defineSlotRecipe` for multi-part: `card`/`dialog`/`select`/`slider`/`avatar`), registered in `panda.config.ts` under `theme.extend.recipes` / `theme.extend.slotRecipes`. Recipes emit into `@layer recipes`, which sits **below** `@layer utilities` (see the layer order in `src/index.css`), so a consumer's plain `className={css({...})}` — or, on the factory-based primitives, the `css` prop / style props — **automatically beats the recipe base**. No object-merge helper, no `!important`, no source-order fragility. Run `pnpm prepare` after changing any recipe. Two override paths exist depending on how the wrapper is built:
  - **Factory-based primitives** (`Button`, `Input`, `Textarea`, `Label` via `styled(...)`; `Card` family via `createStyleContext`) accept the **`css` prop and style props natively** (e.g. `<Card css={{ bg: 'brand.subtle' }}>`, `<CardTitle css={{ fontSize: '2xl' }}>`), which land in `@layer utilities`.
  - **Composed wrappers** (`Dialog`, `Select`, `Slider` — they wrap Ark internals and call the recipe directly) take overrides via **`className={css({...})}`** only (e.g. `<DialogTitle className={css({ color: 'brand.solid' })}>`).
  - `Label` sets no `color` on purpose (the body inherits `fg.default` globally), so a brand color is just `className={css({ color: 'brand.solid' })}`.
- **Responsive nav**: both `home-nav.tsx` and `dashboard-nav.tsx` show an inline nav at `md+` and a hamburger below `md`. The hamburger opens the shared `mobile-nav.tsx` drawer — a Motion (`AnimatePresence`) slide-in panel portaled to `document.body` with a fading backdrop, Esc-to-close, body scroll-lock, and a render-prop `close` so links dismiss it on tap. Reuse `MobileNav` for any new responsive header rather than rolling another drawer.
- The Inter latin subset is **inlined as a base64 data URI** in `src/index.css` (`font-display: block`) so the font ships with the render-blocking CSS and is present at first paint — no FOUT / layout shift. Don't swap it back to an external `@font-face` + `<link rel="preload">`.
- Dark mode is toggled by adding/removing `dark` on `<html>` — the inline script in `__root.tsx` hydrates it from `localStorage('sokay-theme')`. Use `ThemeProvider` / `ThemeToggle` rather than touching the DOM directly.
- **Panda extracts styles statically at build time**, so values must be **literal** — a runtime expression like ``w: `${size}px` `` emits a class name with no matching CSS rule (the element silently falls back to content/intrinsic size). For prop-driven sizes, enumerate discrete options with literal values: a recipe `size` variant (see `avatar.recipe.ts`'s `sm`/`md`/`lg` slots) or, in plain `css()`, a lookup map combined with `cx`.

## Environment

Required (read on both client and server) — in `.env.local` (gitignored):

- `VITE_SUPABASE_URL` — local: `http://127.0.0.1:54321`; prod: `https://<ref>.supabase.co`
- `VITE_SUPABASE_ANON_KEY` — local: `sb_publishable_*` from `supabase status`; prod: cloud key
- `DATABASE_URL` — Postgres connection string for Drizzle (server only); local: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

Browser code uses `import.meta.env.VITE_*`; server code uses `process.env.*`.

GitHub OAuth creds are **not** in `.env.local` — local creds live in `supabase/.env.local` (read by `config.toml` via `env()`), prod creds in the cloud dashboard.

## Conventions

- TypeScript strict mode; no `any`. Re-use the Drizzle-inferred types (`Goal`, `Debit`, `Profile`, `NewGoal`, `NewDebit`, `NewProfile`) from `@/lib/db/schema` (also re-exported via `@/goals/types`).
- Components are function declarations with explicit prop interfaces (see `HistoryViewProps` in `src/goals/history-view.tsx`).
- File naming: kebab-case for component files (`goal-setup-form.tsx`), PascalCase exports.
- Keep server logic out of components — call server functions from event handlers / loaders.
- **Formatting is Prettier** (`.prettierrc.json`: `semi: false`, `singleQuote: true`). Run `pnpm format` (or rely on format-on-save) — don't hand-format. `eslint-config-prettier` sits last in `eslint.config.mjs`, so ESLint defers all style to Prettier; lint is for correctness only.
- Run `pnpm lint` and `pnpm format` before declaring a task done.

## Things Not to Do

- Don't edit `routeTree.gen.ts`, `styled-system/`, `.output/`, `.tanstack/`, or `dist/`.
- Don't add a second styling system (Tailwind, CSS modules, emotion).
- Don't bypass `requireUser` / `getUser` checks in server functions.
- Don't change the Drizzle schema without also updating `supabase-schema.sql`, a new migration, and the SQL `check` constraints (items 1–100, duration 1–52 weeks / 1–12 months, status enum) — plus the bounds in `src/goals/duration.ts`.
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
- Flexible goals (`flexible_goal_limits` migration): items 1–100 (slider + synced number input), duration in weeks (1–52) **or** months (1–12) via unit toggle + per-unit dropdowns; handler-side validation; at-limit inline notice (no log button); "End this goal early" dialog.
- Learning notes: `learning/auth-and-dev-prod-supabase.md`, `learning/git-safety-and-prod-sync.md`.
- Origin page (`/origin`): full long-form story — lead, "sokay" definition callout, personal turning point, the bigger cultural current (scroll-revealed shifts list), honest claims, closing CTA. Reuses `FadeIn`, `SokayMark`, `brand.subtle` radial washes + brand/somber tokens; mirrors the hero CTA. Curly `"…"` only on the two display pull-quotes; straight apostrophes elsewhere (matches the rest of the codebase; HTML entities not used).

### TODO (next steps)

- [x] Tests (Vitest, server fns): `goals`, `debits`, `profiles` covered (auth-guard redirects, validation, hard-cap, scoping). Run with `pnpm test`. Config in `vitest.config.ts` deliberately omits the `tanstackStart()` plugin so `createServerFn` handlers run inline; helpers + mocks in `src/test/helpers.ts`. Caveat: that transform-free path doesn't surface handler return values, so tests assert side effects (db calls) + thrown errors, not resolved values.
- [x] Tests (Playwright, auth flows): protected-route redirect, email signup (+ password-mismatch error), email login (+ invalid-creds error), logout/re-protect, and GitHub OAuth initiation. Run with `pnpm test:e2e` against the **local** dev server (:3000) + local Supabase (:54321), both of which must be running. Config in `playwright.config.ts` (`testDir: ./e2e`, reuses an already-running dev server). Specs + helpers in `e2e/`; `ensureTestUser` seeds a confirmed user via GoTrue's signup endpoint, and `waitForHydration` avoids the SSR-form native-submit race by waiting for React's `__reactProps$` keys before interacting. Signup tests use unique emails (cleared by `supabase db reset`).
- [x] Tests (Playwright, goal flow — `e2e/goal-flow.spec.ts`): goal setup with weeks duration (verifies 14-day countdown), logging an item, hard cap (log button hidden + at-limit notice), end-goal-early dialog → review → start fresh, and "Keep going" dismissal. Each test signs up a **fresh user** so tests stay isolated and fully parallel. Locator note: the Ark UI select trigger exposes as role `combobox` (no accessible name), not `button`.
- [x] Avatar support on `profiles` (upload via Supabase Storage, show in nav).
- [x] **Design-system: migrated hand-rolled primitives to Panda config recipes + cascade layers.** All 9 primitives (`button`/`input`/`textarea`/`label` as `defineRecipe`; `card`/`dialog`/`select`/`slider`/`avatar` as `defineSlotRecipe`) now live in `src/theme/recipes/*.ts`, registered in `panda.config.ts`. They emit into `@layer recipes` (below `@layer utilities`), so consumer `className={css({...})}` / `css`-prop overrides win automatically — the old `css`-prop object-merge workaround and `CardSizeContext` are gone. The Park UI preset's unused recipes are stripped via a `preset:resolved` hook (tokens kept). Wrappers use `styled()` (single elements), `createStyleContext()` (Card), or direct recipe calls (Dialog/Select/Slider/Avatar). **Faithful port — zero visual change.** Follow-up fix: the original author had used Park UI button token names from a _newer_ preset version (`colorPalette.solid.bg`, nested) that don't exist in the installed preset 0.43.1, so `solid`/`subtle`/`outline`/`plain` and the slider `range` rendered transparent (the default-`solid` "Sign in"/"Save" buttons were invisible). Re-pointed to the preset's real tokens — accent `colorPalette.default/fg/emphasized` for `solid` (+ slider range), neutral `colorPalette: 'gray'` + alpha steps for the quiet variants — using only the existing teal/gray/brand palette. See `learning/panda-recipe-refactor-plan.md`.
- [ ] Email confirmation flow (currently signup → straight to `/dashboard`; breaks if "confirm email" is enabled).
- [ ] Session refresh on navigation (tokens can go stale).
- [ ] Prod: create cloud GitHub OAuth app, `supabase link` + `supabase db push`, set deploy env vars.
- [ ] Decide deploy target (Netlify lowest-friction now; Cloudflare later — see `learning/auth-and-dev-prod-supabase.md` §6).
