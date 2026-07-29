alter table public.brain_game_results
  drop constraint brain_game_results_category_check;

alter table public.brain_game_results
  add constraint brain_game_results_category_check
  check (category in ('memory', 'attention', 'speed', 'logic'));

create table public.brain_game_progress (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  game_id text not null,
  category text not null check (category in ('memory', 'attention', 'speed', 'logic')),
  current_level integer not null default 1 check (current_level between 1 and 20),
  completed_count integer not null default 0 check (completed_count >= 0),
  best_score integer not null default 0 check (best_score between 0 and 100),
  last_level_up_date date,
  last_played_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

alter table public.brain_game_progress enable row level security;

create policy "read own brain game progress"
  on public.brain_game_progress for select
  using (auth.uid() = user_id);

grant select on public.brain_game_progress to authenticated;

drop function public.record_brain_game_result(text, text, integer);

create function public.record_brain_game_result(
  chosen_game_id text,
  chosen_category text,
  chosen_score integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  earned_xp integer;
  saved_level integer;
  did_level_up boolean;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if chosen_score not between 0 and 100 then raise exception 'Invalid score'; end if;
  if not (
    (chosen_category = 'attention' and chosen_game_id in (
      'shade', 'scan', 'switch', 'count', 'focus-match'
    ))
    or (chosen_category = 'speed' and chosen_game_id in (
      'reaction', 'compare', 'math', 'direction', 'sort'
    ))
    or (chosen_category = 'memory' and chosen_game_id in (
      'sequence', 'pairs', 'pattern', 'missing', 'reverse', 'growing-matrix'
    ))
    or (chosen_category = 'logic' and chosen_game_id in (
      'number-pattern', 'target-equation', 'odd-rule', 'path-planner', 'rotation'
    ))
  ) then raise exception 'Invalid game'; end if;

  earned_xp := greatest(5, round(chosen_score * .3));
  insert into public.brain_game_results (
    user_id, game_id, category, score, xp_earned
  ) values (
    current_user_id, chosen_game_id, chosen_category, chosen_score, earned_xp
  );

  select chosen_score >= 80
    and coalesce(last_level_up_date, date '1900-01-01') < current_date
  into did_level_up
  from public.brain_game_progress
  where user_id = current_user_id and game_id = chosen_game_id;
  did_level_up := coalesce(did_level_up, chosen_score >= 80);

  insert into public.brain_game_progress (
    user_id, game_id, category, current_level, completed_count, best_score,
    last_level_up_date, last_played_at
  ) values (
    current_user_id, chosen_game_id, chosen_category,
    case when chosen_score >= 80 then 2 else 1 end, 1, chosen_score,
    case when chosen_score >= 80 then current_date else null end, now()
  )
  on conflict (user_id, game_id) do update
  set completed_count = brain_game_progress.completed_count + 1,
      best_score = greatest(brain_game_progress.best_score, excluded.best_score),
      current_level = case
        when excluded.best_score >= 80
          and coalesce(brain_game_progress.last_level_up_date, date '1900-01-01') < current_date
        then least(20, brain_game_progress.current_level + 1)
        else brain_game_progress.current_level
      end,
      last_level_up_date = case
        when excluded.best_score >= 80
          and coalesce(brain_game_progress.last_level_up_date, date '1900-01-01') < current_date
        then current_date
        else brain_game_progress.last_level_up_date
      end,
      last_played_at = now()
  returning current_level into saved_level;

  return jsonb_build_object(
    'xp_earned', earned_xp,
    'current_level', saved_level,
    'leveled_up', did_level_up
  );
end;
$$;

revoke all on function public.record_brain_game_result(text, text, integer) from public;
grant execute on function public.record_brain_game_result(text, text, integer) to authenticated;
