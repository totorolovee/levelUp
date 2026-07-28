create or replace function public.get_league_leaderboard()
returns table (
  username text,
  xp integer,
  league text,
  rank_position bigint,
  is_current_user boolean
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  return query
  with ranked as (
    select
      entry.user_id,
      entry.username,
      entry.xp,
      case
        when entry.xp >= 3000 then 'master'
        when entry.xp >= 2000 then 'diamond'
        when entry.xp >= 1000 then 'gold'
        when entry.xp >= 500 then 'silver'
        else 'bronze'
      end as league
    from public.league_entries as entry
  )
  select
    ranked.username,
    ranked.xp,
    ranked.league,
    row_number() over (partition by ranked.league order by ranked.xp desc, ranked.username),
    ranked.user_id = auth.uid()
  from ranked;
end;
$$;

revoke all on function public.get_league_leaderboard() from public;
grant execute on function public.get_league_leaderboard() to authenticated;
