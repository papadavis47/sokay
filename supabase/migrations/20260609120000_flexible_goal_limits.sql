-- Flexible goals: items 1-100, duration in weeks (1-52) OR months (1-12).
-- duration_months becomes duration_value + duration_unit ('week'|'month').
-- Existing rows backfill as months via the column default; their values
-- (1, 2, 3, 6, 12) all satisfy the new month range check.

alter table public.goals
  drop constraint goals_total_items_check;

alter table public.goals
  add constraint goals_total_items_check
  check (total_items >= 1 and total_items <= 100);

alter table public.goals
  rename column duration_months to duration_value;

alter table public.goals
  drop constraint goals_duration_months_check;

alter table public.goals
  add column duration_unit text not null default 'month'
  check (duration_unit in ('week', 'month'));

alter table public.goals
  add constraint goals_duration_value_check check (
    (duration_unit = 'week' and duration_value between 1 and 52)
    or (duration_unit = 'month' and duration_value between 1 and 12)
  );
