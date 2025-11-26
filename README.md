# Sokay - Mindful Eating Tracker

**"It's okay."** Build a healthier relationship with food by tracking treats mindfully.

## What is Sokay?

Sokay helps you practice mindful eating without guilt. Set a budget of "sokay credits" for your favorite treats, track your indulgences honestly, and build sustainable habits through balance and self-forgiveness—not restriction.

### The Philosophy

Your body thrives when you eat well 90% of the time. The other 10%? That's life—celebrations, cravings, moments of joy. Sokay helps you stay mindful of these moments while building in the self-forgiveness that makes healthy eating sustainable.

## Features

- 🎯 **Goal Setting**: Choose 5-20 credits over 1-12 months
- 📊 **Progress Tracking**: See your remaining balance at a glance
- 📝 **Treat Logging**: Record what you enjoyed with full edit/undo
- 📈 **Goal Review**: Celebrate progress and learn from your journey
- 🔒 **Secure Auth**: Email/password authentication via Supabase
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS v4 & Shadcn UI

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn UI
- **Backend**: Supabase (Auth + PostgreSQL)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- A Supabase account (free tier works fine)

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd sokay
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up Supabase**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings → API
   - Copy your project URL and anon key

4. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Set up the database**

   - Go to your Supabase project
   - Open the SQL Editor
   - Copy the contents of `supabase-schema.sql`
   - Paste and run the SQL

6. **Start the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── dashboard/          # Protected dashboard
│   ├── goal/review/[id]/   # Goal review page
│   ├── history/            # Full history with edit/delete
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   └── *.tsx               # Custom components
├── lib/
│   ├── supabase/           # Supabase clients
│   └── utils.ts            # Utilities
└── types/                  # TypeScript types
```

## Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## How It Works

1. **Sign up** and create an account
2. **Set a goal**: Choose your credit budget (5-20) and duration (1-12 months)
3. **Track treats**: Log what you enjoyed when you indulge
4. **Stay mindful**: See your remaining balance and progress
5. **Review & reflect**: When your goal ends, see your stats and start fresh

## Database Schema

- **goals**: User goals with credits, duration, and status
- **debits**: Individual treat entries with food names

Row Level Security (RLS) ensures users can only access their own data.

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

---

Built with ❤️ and the belief that balance beats perfection every time.
