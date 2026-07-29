create or replace function public.record_brain_game_result(
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
    (chosen_category = 'attention' and chosen_game_id in (
      'shade', 'scan', 'switch', 'count', 'focus-match'
    ))
    or (chosen_category = 'speed' and chosen_game_id in (
      'reaction', 'compare', 'math', 'direction', 'sort'
    ))
    or (chosen_category = 'memory' and chosen_game_id in (
      'sequence', 'pairs', 'pattern', 'missing', 'reverse', 'growing-matrix'
    ))
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
