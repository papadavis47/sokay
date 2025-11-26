# Sokay Setup Guide

Follow these steps to get your Sokay app up and running.

## ✅ Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Supabase account created (free tier is fine)

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Project name**: sokay (or whatever you prefer)
   - **Database password**: Choose a strong password (save this!)
   - **Region**: Choose closest to you
5. Click "Create new project" and wait for it to initialize (~2 minutes)

### 3. Get Your Supabase Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### 4. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` in your editor and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Set Up the Database Schema

1. In your Supabase project dashboard, click **SQL Editor** in the sidebar
2. Click **New query**
3. Open the file `supabase-schema.sql` in this repository
4. Copy the entire contents
5. Paste into the Supabase SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - that's perfect!

### 6. Verify Database Setup

1. In Supabase, go to **Table Editor** in the sidebar
2. You should see two tables:
   - `goals`
   - `debits`
3. Click on each table to verify they have the correct columns

### 7. Enable Email Authentication

1. In Supabase, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Optional: Configure email templates under **Authentication** → **Email Templates**

### 8. Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 9. Test the Application

1. Click **Get Started** or **Sign Up**
2. Create an account with your email and password
3. You should be redirected to the dashboard
4. Set up your first goal!

## 🎉 Success!

You should now have:
- ✅ A running Next.js app on localhost:3000
- ✅ Working authentication via Supabase
- ✅ A database with proper Row Level Security
- ✅ Ability to create goals and track treats

## 🐛 Troubleshooting

### Build fails with "Invalid supabaseUrl"
- Make sure you've added your credentials to `.env.local`
- Restart your dev server after adding environment variables

### "Email not confirmed" error when signing up
- By default, Supabase requires email confirmation
- For development, go to Supabase **Authentication** → **Providers** → **Email** → Disable "Confirm email"
- Or check your email inbox for the confirmation link

### Can't log in after signup
- Check the Supabase **Authentication** → **Users** tab to see if your user was created
- Try the password reset flow if needed

### Database errors
- Make sure you ran the entire `supabase-schema.sql` script
- Check **Database** → **Tables** to verify tables exist
- Check **Database** → **Policies** to verify Row Level Security is enabled

### Environment variables not loading
- Make sure the file is named `.env.local` exactly
- Restart your dev server with `pnpm dev`
- Variables must start with `NEXT_PUBLIC_` to be available in the browser

## 📚 Next Steps

- Customize the landing page copy
- Adjust the color theme in `src/styles/main.css`
- Add analytics tracking
- Deploy to Vercel or your preferred host

## 💬 Need Help?

Check the [README.md](./README.md) for more information about the project architecture.
