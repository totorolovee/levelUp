revoke insert, update on public.league_entries from authenticated;

create function public.sync_my_league_entry(chosen_username text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  calculated_xp integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;
  if char_length(trim(chosen_username)) not between 1 and 30 then
    raise exception 'Invalid username';
  end if;

  select
    (
      select count(distinct activity_date)::integer * 25
      from public.daily_activity
      where user_id = current_user_id
    ) + coalesce((
      select sum(progress)::integer
      from public.reading_progress
      where user_id = current_user_id
    ), 0)
  into calculated_xp;

  insert into public.league_entries (user_id, username, xp, updated_at)
  values (current_user_id, trim(chosen_username), calculated_xp, now())
  on conflict (user_id) do update
  set username = excluded.username,
      xp = excluded.xp,
      updated_at = excluded.updated_at;
end;
$$;

revoke all on function public.sync_my_league_entry(text) from public;
grant execute on function public.sync_my_league_entry(text) to authenticated;
