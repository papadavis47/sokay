# Sokay Migration Plan: Next.js + Tailwind → TanStack Start + Panda CSS + Park UI

## Overview

Migrate the "sokay" mindful eating tracker from **Next.js 16 + Tailwind CSS v4 + Shadcn UI** to **TanStack Start (latest RC) + Panda CSS + Park UI / Ark UI** with a complete UI redesign including user-controlled dark/light mode. All existing app features are preserved.

### Component Stack

- **[Ark UI](https://ark-ui.com/)** — Headless, accessible component library (45+ components) powered by state machines. Framework-agnostic (React, Solid, Vue, Svelte). Provides behavior, accessibility (WAI-ARIA), and keyboard navigation with zero styling.
- **[Park UI](https://park-ui.com/)** — Pre-styled component system built on top of Ark UI + Panda CSS. Distributes components as source code (like Shadcn UI) via CLI. Includes consistent sizing, standardized variants (solid/subtle/surface/outline/plain), and a color system based on Radix Colors with built-in light/dark mode support.
- **Relationship**: Park UI is to Ark UI + Panda CSS what Shadcn UI is to Radix UI + Tailwind CSS — a styled, copy-paste component distribution layer.

---

## Phase 0 — Prep (~half day)

- Freeze feature set (DB schema/RLS unchanged)
- Plan env var rename: `NEXT_PUBLIC_SUPABASE_*` → `VITE_SUPABASE_*`
- Decision: build fresh at repo root, keeping `supabase-schema.sql` and `.env.local`

**Acceptance**: Route map, auth rules, and data queries documented and agreed upon.

---

## Phase 1 — Scaffold TanStack Start + Panda CSS (1-2 days)

1. Remove Next.js, Tailwind, Shadcn, Radix, PostCSS deps:
   ```sh
   pnpm remove next @tailwindcss/postcss tailwindcss tailwind-merge class-variance-authority clsx eslint-config-next @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-slot
   rm postcss.config.mjs next.config.ts next-env.d.ts
   ```

2. Install TanStack Start + Vite:
   ```sh
   pnpm add @tanstack/react-start @tanstack/react-router
   pnpm add -D vite @vitejs/plugin-react vite-tsconfig-paths
   ```

3. Install Panda CSS + Park UI:
   ```sh
   pnpm add -D @pandacss/dev
   pnpm panda init --postcss
   npx @park-ui/cli init
   pnpm panda codegen
   ```
   - Park UI init will configure `panda.config.ts` with its preset, color system (Radix Colors), and JSX framework
   - Choose accent color (e.g., `teal`) and gray scale (e.g., `neutral` or `sage`) during init
   - Park UI's color system replaces Panda's default 50-950 scale with 12 shades per mode (light + dark)

4. Install Ark UI (Park UI's headless component layer):
   ```sh
   pnpm add @ark-ui/react
   ```

5. Add Park UI components via CLI:
   ```sh
   npx @park-ui/cli add button card dialog input label select slider
   ```
   Components are copied into `src/components/ui/` as source code (just like Shadcn UI).

6. Update `package.json`:
   ```json
   {
     "type": "module",
     "scripts": {
       "dev": "vite dev",
       "build": "vite build",
       "start": "node .output/server/index.mjs",
       "prepare": "panda codegen"
     }
   }
   ```

7. Create `vite.config.ts`:
   ```ts
   import { defineConfig } from 'vite'
   import { tanstackStart } from '@tanstack/react-start/plugin/vite'
   import viteReact from '@vitejs/plugin-react'
   import tsconfigPaths from 'vite-tsconfig-paths'

   export default defineConfig({
     server: { port: 3000 },
     plugins: [
       tsconfigPaths(),
       tanstackStart(),
       viteReact(),
     ],
   })
   ```

8. Create `src/router.tsx`:
   ```tsx
   import { createRouter } from '@tanstack/react-router'
   import { routeTree } from './routeTree.gen'

   export function getRouter() {
     const router = createRouter({
       routeTree,
       scrollRestoration: true,
     })
     return router
   }
   ```

9. Create `src/routes/__root.tsx` with basic HTML shell + `<Outlet />`

**Acceptance**: `pnpm dev` runs, hello world renders, Panda `css()` works.

---

## Phase 2 — Routing Parity (1-2 days)

### File Mapping

| Next.js File | TanStack Start File | Notes |
|---|---|---|
| `src/app/layout.tsx` | `src/routes/__root.tsx` | Root HTML shell + `<Outlet />` |
| `src/app/page.tsx` | `src/routes/index.tsx` | Landing page |
| `src/app/login/page.tsx` | `src/routes/login.tsx` | Auth form |
| `src/app/signup/page.tsx` | `src/routes/signup.tsx` | Auth form |
| `src/app/dashboard/layout.tsx` | `src/routes/dashboard.tsx` | Layout route with nav + `<Outlet />` |
| `src/app/dashboard/page.tsx` | `src/routes/dashboard/index.tsx` | Main dashboard |
| `src/app/history/page.tsx` | `src/routes/dashboard/history.tsx` | History (nested under dashboard layout) |
| `src/app/goal/review/[id]/page.tsx` | `src/routes/goal/review/$id.tsx` | Dynamic route |

### Key API Changes

- `next/link` → `Link` from `@tanstack/react-router` (`href` → `to`)
- `useRouter()` from `next/navigation` → `useNavigate()` / `useRouter()` from `@tanstack/react-router`
- `redirect()` from `next/navigation` → `throw redirect({ to: '/path' })` from `@tanstack/react-router`
- Next.js `metadata` export → `head()` function in route config
- `router.refresh()` → `router.invalidate()`

**Acceptance**: All URLs (`/`, `/login`, `/signup`, `/dashboard`, `/history`, `/goal/review/:id`) render placeholder content.

---

## Phase 3 — Auth + Protected Routes (2-4 days)

### 3.1 Rewrite Supabase Server Client

Rewrite `src/lib/supabase/server.ts` to use Vinxi/Start request primitives for cookie read/write instead of `next/headers`.

### 3.2 Create Server Auth Functions

Create `src/server/auth.ts` with server functions:

```ts
import { createServerFn } from '@tanstack/react-start'

// Returns authenticated user or null
export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  // create supabase server client, call getUser()
})

// Returns user or throws redirect to /login
export const requireUser = createServerFn({ method: 'GET' }).handler(async () => {
  // calls getUser, throws redirect if null
})

// Signs out and clears cookies
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  // sign out server-side
})
```

### 3.3 Delete Legacy Auth Files

- Delete `src/proxy.ts`
- Delete `src/lib/supabase/middleware.ts`

### 3.4 Add Route Guards via `beforeLoad`

- `dashboard.tsx` → calls `requireUser()`, redirects unauthed to `/login`
- `login.tsx` / `signup.tsx` → redirects authed users to `/dashboard`
- `goal/review/$id.tsx` → calls `requireUser()`

### 3.5 Keep Browser Client

`src/lib/supabase/client.ts` stays mostly the same, just update env var names:
- `process.env.NEXT_PUBLIC_SUPABASE_URL` → `import.meta.env.VITE_SUPABASE_URL`
- `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` → `import.meta.env.VITE_SUPABASE_ANON_KEY`

**Acceptance**: Unauthed users redirected from protected routes; authed users redirected away from auth pages; session refresh works.

---

## Phase 4 — Data Loading + Mutations (3-5 days)

### 4.1 Route Loaders (replace Next.js server component data fetching)

**`dashboard/index.tsx` loader:**
1. `requireUser()`
2. Check for `reviewing` goal → redirect to `/goal/review/$id`
3. Fetch active goal
4. If no active goal → return `{ activeGoal: null }`
5. If active goal → fetch debits, return `{ activeGoal, debits }`

**`dashboard/history.tsx` loader:**
1. `requireUser()`
2. Fetch active goal; if none → redirect `/dashboard`
3. Fetch debits for goal; return `{ goal, debits }`

**`goal/review/$id.tsx` loader:**
1. `requireUser()`
2. Fetch goal by `$id` param + `user_id`; if none → redirect `/dashboard`
3. Fetch debits for goal; return `{ goal, debits }`

Components consume data via `Route.useLoaderData()`.

### 4.2 Server Functions for Mutations

Create `src/server/goals.ts` and `src/server/debits.ts`:

- `createGoal(totalCredits, durationMonths)`
- `createDebit(goalId, foodName)`
- `updateDebit(debitId, foodName)`
- `deleteDebit(debitId)`
- `completeGoal(goalId)`

All use server-side Supabase client with cookie-based auth.

### 4.3 Client-Side Refresh Pattern

Components call serverFn then `router.invalidate()` to re-run loaders (replaces `router.refresh()`).

**Acceptance**: Full CRUD works — create goal, log treats, edit/delete treats, complete goal, review goal.

---

## Phase 5 — Park UI Components + Dark/Light Mode (2-4 days)

### 5.1 Design Tokens (handled by Park UI)

Park UI's `@park-ui/cli init` configures Panda CSS with:
- **Radix Colors** — 12 shades per color per mode (light + dark), replacing Panda's default 50-950 scale
- **Accent + gray pairing** — choose during init (e.g., accent: `teal`, gray: `neutral` or `sage`)
- **Semantic tokens** — `colorPalette.solid.bg`, `colorPalette.surface.bg`, etc. already wired for light/dark
- **Consistent sizing** — primary components (Button, Input, Select) share heights per size token
- **Standardized variants** — `solid`, `subtle`, `surface`, `outline`, `plain` across all components

Fonts: install `@fontsource-variable/inter` and add to Panda config.

Any additional token customization can be done in `panda.config.ts` `theme.extend`.

### 5.2 Park UI Components (replacing Shadcn UI)

Add components via Park UI CLI — they are copied as source code into `src/components/ui/`:

```sh
npx @park-ui/cli add button card dialog input label select slider progress
```

| Shadcn Component | Park UI Replacement | Headless Layer |
|---|---|---|
| `Button` | Park UI `Button` (variants: solid/subtle/surface/outline/plain, sizes: 2xs–2xl) | Ark UI `ark.button` |
| `Card` | Park UI `Card` (Card.Root/Header/Body/Footer/Title/Description) | Panda recipe (no Ark needed) |
| `Input` | Park UI `Input` | Panda recipe |
| `Label` | Park UI `Label` (from `@ark-ui/react/field`) | Ark UI Field |
| `Dialog` | Park UI `Dialog` (Dialog.Root/Backdrop/Positioner/Content/Title/Description) | Ark UI Dialog |
| `Select` | Park UI `Select` (Select.Root/Trigger/Content/Item/ValueText) | Ark UI Select |
| `Slider` | Park UI `Slider` (Slider.Root/Track/Range/Thumb) | Ark UI Slider |
| `ProgressBar` | Park UI `Progress` (Progress.Root/Track/Range) | Ark UI Progress |

**Key differences from Shadcn**:
- Variants are `solid/subtle/surface/outline/plain` instead of `default/destructive/outline/secondary/ghost/link`
- Use `colorPalette` prop for color theming (e.g., `<Button colorPalette="red">Delete</Button>`)
- Component parts use dot notation (e.g., `<Dialog.Content>` instead of `<DialogContent>`)
- `asChild` prop still works for composition (same as Radix)

### 5.3 Theme Toggle (Dark/Light Mode)

Park UI's color system has built-in light/dark mode support via Radix Colors (12 shades per mode). Dark mode is activated by the `.dark` class on `<html>` (Panda's `_dark` condition).

**ThemeProvider** (`src/components/theme-provider.tsx`):
- React context providing `theme` (`'light' | 'dark' | 'system'`) and `setTheme`
- Reads/writes `localStorage` key `sokay-theme`
- Adds/removes `.dark` class on `<html>`

**Flash prevention**:
- Inline `<script>` in `__root.tsx` `<head>` that reads localStorage and sets `.dark` before first paint

**ThemeToggle** button in `DashboardNav` and landing page header (sun/moon icon from `lucide-react`).

**Acceptance**: Park UI components render consistently, theme toggle works and persists across refresh, all colors adapt to light/dark.

---

## Phase 6 — Full Redesign (1-2+ weeks)

### Visual Direction
- **Calm, editorial, spacious** — soft surfaces, subtle borders, gentle gradients
- One warm accent color (teal/green) + neutral grays
- Fewer harsh contrasts, more whitespace

### Page-by-Page Redesign

**Landing Page**:
- Streamlined hero: single clear CTA + secondary "Log in"
- 3-step "How it works" strip (Set budget → Log treats → Review)
- Condensed philosophy card with more breathing room

**Auth Pages (Login/Signup)**:
- Minimal centered card forms with warm tone
- Subtle background texture or gradient

**Dashboard**:
- Large credit balance as visual anchor (big number + ring/arc progress indicator)
- Days remaining prominent
- Primary "Log a Treat" button always visible
- Recent 3-5 treats inline
- Motivational message card

**History**:
- Clean list with edit/delete icons (pencil, trash)
- Summary card at top
- Consider inline edit later

**Goal Review**:
- Celebratory, rewarding feel
- Stats in card grid (credits saved %, duration, treats logged)
- Timeline start/end
- Single CTA: "Complete Goal & Start Fresh"

### Responsive + Accessibility
- Mobile-first responsive layout
- a11y baseline: focus indicators, ARIA labels, color contrast ratios

**Acceptance**: All pages redesigned, mobile responsive, dark/light modes polished.

---

## Phase 7 — Cleanup (1-2 days)

1. Remove all legacy files:
   - `src/app/` directory (entire Next.js app router structure)
   - `postcss.config.mjs`, `next.config.ts`, `next-env.d.ts`
   - Shadcn `components.json`
   - Any remaining Tailwind config

2. Remove legacy dependencies (if not already removed in Phase 1):
   ```sh
   pnpm remove next @tailwindcss/postcss tailwindcss tailwind-merge class-variance-authority clsx eslint-config-next @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-slot
   ```

3. Update documentation:
   - `CLAUDE.md` → reflect new stack, commands, file structure
   - `README.md` → updated setup instructions

4. Final verification:
   ```sh
   pnpm build   # must pass clean
   pnpm lint     # no errors
   ```

**Acceptance**: No Next.js/Tailwind artifacts remain, clean build, bundle size reasonable.

---

## Architecture Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| Auth pattern | Route `beforeLoad` + `requireUser()` serverFn | No global middleware needed; guards are explicit per route |
| Data loading | Route `loader` functions | SSR data source of truth; components use `useLoaderData()` |
| Mutations | Server functions (`createServerFn`) | Consistent server-side auth, centralized validation |
| UI refresh | `router.invalidate()` | Re-runs loaders without full page reload |
| UI components | Park UI (source code distribution) + Ark UI (headless) + Panda CSS (styling) | Like Shadcn→Radix→Tailwind but for Panda ecosystem; pre-styled, accessible, customizable |
| Theme toggle | `.dark` class on `<html>` + localStorage | User-controlled, Panda `_dark` condition maps to `.dark &` |
| Fonts | `@fontsource-variable/inter` | No `next/font` needed; import in CSS |

---

## Effort Estimate

- **Feature parity** (no redesign polish): ~1-2 weeks
- **Full redesign** with polished component system: ~2-4 weeks

---

## Dependencies to Install (Final State)

### Production
- `@tanstack/react-start`
- `@tanstack/react-router`
- `@ark-ui/react` — headless component primitives (behavior, accessibility, state machines)
- `@supabase/ssr`
- `@supabase/supabase-js`
- `@fontsource-variable/inter`
- `lucide-react`
- `react`
- `react-dom`

### Development
- `@pandacss/dev` — CSS-in-JS engine (atomic CSS generation)
- `@park-ui/cli` — component code distribution CLI (adds styled Ark UI components as source code)
- `vite`
- `@vitejs/plugin-react`
- `vite-tsconfig-paths`
- `typescript`
- `@types/react`
- `@types/react-dom`
- `@types/node`
- `eslint`

### No Longer Needed (removed from current stack)
- `next` → replaced by `@tanstack/react-start`
- `tailwindcss`, `@tailwindcss/postcss`, `tailwind-merge` → replaced by Panda CSS
- `class-variance-authority`, `clsx` → replaced by Panda `cva()` recipes
- `@radix-ui/react-*` → replaced by `@ark-ui/react` (via Park UI)
- `eslint-config-next` → use generic ESLint config

---

## Key Resources

### TanStack Start
- [TanStack Start Overview](https://tanstack.com/start/latest/docs/framework/react/overview)
- [TanStack Start: Migrate from Next.js](https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js)
- [TanStack Start: Build from Scratch](https://tanstack.com/start/latest/docs/framework/react/build-from-scratch)
- [TanStack Router: Routing Concepts](https://tanstack.com/router/latest/docs/framework/react/routing/routing-concepts)

### Panda CSS
- [Panda CSS: Getting Started](https://panda-css.com/docs/overview/getting-started)
- [Panda CSS: Vite Installation](https://panda-css.com/docs/installation/vite)
- [Panda CSS: Tokens](https://panda-css.com/docs/theming/tokens)
- [Panda CSS: Recipes](https://panda-css.com/docs/concepts/recipes)
- [Panda CSS: Conditional Styles (dark mode)](https://panda-css.com/docs/concepts/conditional-styles)

### Park UI + Ark UI
- [Park UI: Introduction](https://park-ui.com/docs)
- [Park UI: Installation](https://park-ui.com/docs/installation)
- [Park UI: Theming (colors, variants, sizing)](https://park-ui.com/docs/theming)
- [Park UI: Components](https://park-ui.com/docs/components/button)
- [Ark UI: Getting Started](https://ark-ui.com/docs/overview/getting-started)
- [Ark UI: Components List](https://ark-ui.com/docs/components/accordion)
