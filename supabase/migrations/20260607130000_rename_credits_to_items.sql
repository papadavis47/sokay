-- Rename goals.total_credits -> goals.total_items
-- "credits" was renamed to "items" app-wide for clearer, on-brand wording.
-- Data is preserved; only the column and its check constraint are renamed.

alter table public.goals
  rename column total_credits to total_items;

alter table public.goals
  rename constraint goals_total_credits_check to goals_total_items_check;
