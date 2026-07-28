create table public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  book_title text not null check (char_length(book_title) between 1 and 300),
  progress integer not null default 0 check (progress between 0 and 100),
  updated_at timestamptz not null default now(),
  unique (user_id, book_title)
);

alter table public.reading_progress enable row level security;

create policy "read own reading progress"
  on public.reading_progress for select
  using (auth.uid() = user_id);

create policy "insert own reading progress"
  on public.reading_progress for insert
  with check (auth.uid() = user_id);

create policy "update own reading progress"
  on public.reading_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "delete own reading progress"
  on public.reading_progress for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.reading_progress to authenticated;
