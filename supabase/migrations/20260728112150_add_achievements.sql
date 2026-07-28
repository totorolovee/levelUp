create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  achievement_key text not null check (
    achievement_key in (
      'goal_first_step',
      'first_investment',
      'first_book',
      'book_completed',
      'streak_3',
      'league_joined'
    )
  ),
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_key)
);

alter table public.achievements enable row level security;

create policy "Users can read own achievements"
on public.achievements for select to authenticated
using (auth.uid() = user_id);

create policy "Users can unlock own achievements"
on public.achievements for insert to authenticated
with check (auth.uid() = user_id);

grant select, insert on public.achievements to authenticated;
