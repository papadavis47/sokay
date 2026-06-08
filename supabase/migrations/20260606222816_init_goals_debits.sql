-- Sokay initial schema: goals + debits, RLS, indexes, triggers.
-- Applied locally via `supabase db reset` and to prod via `supabase db push`.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Goals table
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  total_credits integer not null check (total_credits >= 5 and total_credits <= 20),
  duration_months integer not null check (duration_months in (1, 2, 3, 6, 12)),
  start_date timestamp with time zone not null default now(),
  end_date timestamp with time zone not null,
  status text not null default 'active' check (status in ('active', 'completed', 'reviewing')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Debits table (tracks each time user consumes a cheat food)
create table public.debits (
  id uuid default uuid_generate_v4() primary key,
  goal_id uuid references public.goals(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  food_name text not null,
  notes text check (notes is null or char_length(notes) <= 250),
  debited_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

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
