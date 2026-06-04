# Sokay - Mindful Eating Tracker

**"It's okay."** Track eating habits mindfully. Set a limit of "sokay credits," log indulgences without guilt, build sustainable habits through realistic goals and self-forgiveness.

## Tech Stack

- **Framework**: TanStack Start (RC) + TanStack Router
- **Styling**: Panda CSS + Park UI / Ark UI
- **Backend**: Supabase (Auth + PostgreSQL)
- **Build**: Vite, TypeScript, pnpm

## Setup

1. `pnpm install`
2. Create a Supabase project, run `supabase-schema.sql` in the SQL Editor
3. `cp .env.local.example .env.local` and add your credentials:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. `pnpm dev` — opens at http://localhost:3000

## Scripts

```bash
pnpm dev        # dev server
pnpm build      # production build
pnpm start      # start production server
pnpm lint       # run eslint
pnpm panda codegen  # regenerate styled-system
```

## How It Works

1. Sign up and set a goal: 5-20 limit over 1-12 months
2. Log splurges as you go, see remaining balance
3. Review and reflect when goal ends, then start fresh

RLS ensures users only access their own data.

## License

MIT
