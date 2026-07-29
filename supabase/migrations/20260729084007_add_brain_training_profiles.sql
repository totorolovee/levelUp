create table public.brain_training_profiles (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  memory_need integer not null check (memory_need between 1 and 5),
  attention_need integer not null check (attention_need between 1 and 5),
  speed_need integer not null check (speed_need between 1 and 5),
  primary_focus text not null check (primary_focus in ('memory', 'attention', 'speed')),
  education_level text not null check (
    education_level in ('primary', 'middle', 'high', 'college', 'university', 'graduate')
  ),
  answers jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.brain_training_profiles enable row level security;

create policy "read own brain training profile"
  on public.brain_training_profiles for select
  using (auth.uid() = user_id);

create policy "insert own brain training profile"
  on public.brain_training_profiles for insert
  with check (auth.uid() = user_id);

create policy "update own brain training profile"
  on public.brain_training_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.brain_training_profiles to authenticated;
