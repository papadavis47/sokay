# Sokay Setup Guide

## Environment Variables

Rename your `.env.local` variables from the old Next.js format to Vite format:

```
# Old (Next.js)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# New (Vite / TanStack Start)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The values stay the same — just the prefix changes from `NEXT_PUBLIC_` to `VITE_`.

## Quick Start

```bash
pnpm install
pnpm dev
```

The app runs at http://localhost:3000
