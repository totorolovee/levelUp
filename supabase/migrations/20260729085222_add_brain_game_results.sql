create table public.brain_game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  game_id text not null check (char_length(game_id) between 2 and 40),
  category text not null check (category in ('memory', 'attention', 'speed')),
  score integer not null check (score between 0 and 100),
  xp_earned integer not null check (xp_earned between 0 and 40),
  created_at timestamptz not null default now()
);

alter table public.brain_game_results enable row level security;

create policy "read own brain game results"
  on public.brain_game_results for select
  using (auth.uid() = user_id);

create policy "insert own brain game results"
  on public.brain_game_results for insert
  with check (auth.uid() = user_id);

grant select on public.brain_game_results to authenticated;

create index brain_game_results_user_created_idx
  on public.brain_game_results (user_id, created_at desc);

create function public.record_brain_game_result(
  chosen_game_id text,
  chosen_category text,
  chosen_score integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  earned_xp integer;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if chosen_score not between 0 and 100 then raise exception 'Invalid score'; end if;
  if not (
    (chosen_category = 'attention' and chosen_game_id in ('shade', 'scan', 'switch'))
    or (chosen_category = 'speed' and chosen_game_id in ('reaction', 'compare', 'math'))
    or (chosen_category = 'memory' and chosen_game_id in ('sequence', 'pairs', 'pattern'))
  ) then raise exception 'Invalid game'; end if;

  earned_xp := greatest(5, round(chosen_score * .3));
  insert into public.brain_game_results (
    user_id, game_id, category, score, xp_earned
  ) values (
    current_user_id, chosen_game_id, chosen_category, chosen_score, earned_xp
  );
  return earned_xp;
end;
$$;

revoke all on function public.record_brain_game_result(text, text, integer) from public;
grant execute on function public.record_brain_game_result(text, text, integer) to authenticated;

create or replace function public.sync_my_league_entry(chosen_username text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  calculated_xp integer;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if char_length(trim(chosen_username)) not between 1 and 30 then
    raise exception 'Invalid username';
  end if;

  select
    (select count(distinct activity_date)::integer * 25 from public.daily_activity
      where user_id = current_user_id)
    + coalesce((select sum(progress)::integer from public.reading_progress
      where user_id = current_user_id), 0)
    + coalesce((select sum(xp_earned)::integer from public.brain_training_sessions
      where user_id = current_user_id), 0)
    + coalesce((select sum(xp_earned)::integer from public.brain_game_results
      where user_id = current_user_id), 0)
  into calculated_xp;

  insert into public.league_entries (user_id, username, xp, updated_at)
  values (current_user_id, trim(chosen_username), calculated_xp, now())
  on conflict (user_id) do update
  set username = excluded.username, xp = excluded.xp, updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.sync_my_league_entry(text) from public;
grant execute on function public.sync_my_league_entry(text) to authenticated;
