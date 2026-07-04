-- Custom migration: everything the TS schema can't express.
-- SQL copied verbatim from the retired supabase CLI migrations
-- (init_goals_debits, profiles, avatars_bucket) so prod stays identical.

-- Row Level Security
alter table public.goals enable row level security;--> statement-breakpoint
alter table public.debits enable row level security;--> statement-breakpoint
alter table public.profiles enable row level security;--> statement-breakpoint

-- Goals policies
create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);--> statement-breakpoint

create policy "Users can insert their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);--> statement-breakpoint

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);--> statement-breakpoint

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);--> statement-breakpoint

-- Debits policies
create policy "Users can view their own debits"
  on public.debits for select
  using (auth.uid() = user_id);--> statement-breakpoint

create policy "Users can insert their own debits"
  on public.debits for insert
  with check (auth.uid() = user_id);--> statement-breakpoint

create policy "Users can update their own debits"
  on public.debits for update
  using (auth.uid() = user_id);--> statement-breakpoint

create policy "Users can delete their own debits"
  on public.debits for delete
  using (auth.uid() = user_id);--> statement-breakpoint

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);--> statement-breakpoint

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);--> statement-breakpoint

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);--> statement-breakpoint

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;--> statement-breakpoint

-- Triggers for updated_at
create trigger handle_goals_updated_at
  before update on public.goals
  for each row
  execute function public.handle_updated_at();--> statement-breakpoint

create trigger handle_debits_updated_at
  before update on public.debits
  for each row
  execute function public.handle_updated_at();--> statement-breakpoint

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();--> statement-breakpoint

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
$$ language plpgsql security definer set search_path = public;--> statement-breakpoint

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();--> statement-breakpoint

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
on conflict (id) do nothing;--> statement-breakpoint

-- Storage policies for avatars bucket (bucket itself: supabase/seed.sql)
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');--> statement-breakpoint

create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );--> statement-breakpoint

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
  );--> statement-breakpoint

create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
