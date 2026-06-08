-- Profiles: one app-level row per user, kept 1-to-1 with auth.users.
-- display_name / avatar_url are seeded on signup by a trigger and editable later.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Row Level Security: each user sees and edits only their own profile.
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

-- Keep updated_at fresh (reuses the function created in the init migration).
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- On signup, create the matching profile row. display_name precedence:
--   1. display_name passed via signUp options.data (email signups)
--   2. full_name / name from OAuth metadata (e.g. GitHub)
--   3. the local part of the email address
-- security definer so the trigger can insert past RLS during signup.
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

-- Backfill profiles for any users that already exist (no-op on fresh DBs).
insert into public.profiles (id, display_name, avatar_url)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data->>'display_name', ''),
    nullif(u.raw_user_meta_data->>'full_name', ''),
    nullif(u.raw_user_meta_data->>'name', ''),
    split_part(u.email, '@', 1)
  ),
  u.raw_user_meta_data->>'avatar_url'
from auth.users u
on conflict (id) do nothing;
