-- Runs on `supabase start` / `supabase db reset` (local stack only).
-- Storage-level setup only — app schema comes from drizzle (`pnpm db:setup`).
-- Storage POLICIES live in drizzle/0001 (real prod policies, part of schema history).

-- Avatars: public storage bucket holding one image per user.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152, -- 2 MiB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;
