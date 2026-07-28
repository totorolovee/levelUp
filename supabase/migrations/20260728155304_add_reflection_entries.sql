create table public.reflection_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  mood smallint not null check (mood between 1 and 5),
  energy smallint not null check (energy between 1 and 5),
  note text not null default '' check (char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

alter table public.reflection_entries enable row level security;

create policy "Users can read own reflections"
on public.reflection_entries for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own reflections"
on public.reflection_entries for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own reflections"
on public.reflection_entries for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.reflection_entries to authenticated;
