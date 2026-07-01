-- Sokay Database Schema
-- Run this in your Supabase SQL Editor

-- Goals table
-- (uses core gen_random_uuid(); no extension needed, portable local + cloud)
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  total_items integer not null check (total_items >= 1 and total_items <= 100),
  duration_value integer not null,
  duration_unit text not null default 'month' check (duration_unit in ('week', 'month')),
  constraint goals_duration_value_check check (
    (duration_unit = 'week' and duration_value between 1 and 52)
    or (duration_unit = 'month' and duration_value between 1 and 12)
  ),
  start_date timestamp with time zone not null default now(),
  end_date timestamp with time zone not null,
  status text not null default 'active' check (status in ('active', 'completed', 'reviewing')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Debits table (tracks each time user consumes a cheat food)
create table public.debits (
  id uuid default gen_random_uuid() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  food_name text not null,
  notes text check (notes is null or char_length(notes) <= 250),
  debited_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Migration for existing databases: add notes column if missing
alter table public.debits
  add column if not exists notes text
    check (notes is null or char_length(notes) <= 250);

-- Enable Row Level Security
alter table public.goals enable row level security;
alter table public.debits enable row level security;

-- Goals policies
create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- Debits policies
create policy "Users can view their own debits"
  on public.debits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own debits"
  on public.debits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own debits"
  on public.debits for update
  using (auth.uid() = user_id);

create policy "Users can delete their own debits"
  on public.debits for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index goals_user_id_idx on public.goals(user_id);
create index goals_status_idx on public.goals(status);
create index debits_goal_id_idx on public.debits(goal_id);
create index debits_user_id_idx on public.debits(user_id);

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger handle_goals_updated_at
  before update on public.goals
  for each row
  execute function public.handle_updated_at();

create trigger handle_debits_updated_at
  before update on public.debits
  for each row
  execute function public.handle_updated_at();

-- Profiles table (one app-level row per user, kept 1-to-1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Seed a profile on signup. display_name precedence:
--   1. display_name from signUp options.data (email signups)
--   2. full_name / name from OAuth metadata (e.g. GitHub)
--   3. local part of the email
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Avatars: public storage bucket holding one image per user.
-- Files live under a per-user folder (<user_id>/<filename>) so RLS can scope
-- writes to the owner while keeping reads public (avatars render in the nav).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MiB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
