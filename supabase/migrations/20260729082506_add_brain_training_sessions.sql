create table public.brain_training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  memory_score integer not null check (memory_score between 0 and 100),
  attention_score integer not null check (attention_score between 0 and 100),
  speed_score integer not null check (speed_score between 0 and 100),
  total_score integer not null check (total_score between 0 and 100),
  xp_earned integer not null check (xp_earned between 0 and 100),
  created_at timestamptz not null default now()
);

alter table public.brain_training_sessions enable row level security;

create policy "read own brain training sessions"
  on public.brain_training_sessions for select
  using (auth.uid() = user_id);

create policy "insert own brain training sessions"
  on public.brain_training_sessions for insert
  with check (auth.uid() = user_id);

grant select, insert on public.brain_training_sessions to authenticated;

create index brain_training_sessions_user_created_idx
  on public.brain_training_sessions (user_id, created_at desc);
