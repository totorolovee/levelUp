create table public.daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  activity_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, activity_date)
);

alter table public.daily_activity enable row level security;

create policy "read own daily activity"
  on public.daily_activity for select
  using (auth.uid() = user_id);

create policy "insert own daily activity"
  on public.daily_activity for insert
  with check (auth.uid() = user_id);

grant select, insert on public.daily_activity to authenticated;
