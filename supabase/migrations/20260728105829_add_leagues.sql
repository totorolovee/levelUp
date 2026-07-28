create table public.league_entries (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 1 and 30),
  xp integer not null default 0 check (xp between 0 and 1000000),
  updated_at timestamptz not null default now()
);

alter table public.league_entries enable row level security;

create policy "Users can read own league entry"
on public.league_entries for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own league entry"
on public.league_entries for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own league entry"
on public.league_entries for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.league_entries to authenticated;

create function public.get_league_leaderboard()
returns table (
  username text,
  xp integer,
  league text,
  rank_position bigint,
  is_current_user boolean
)
language sql
security definer
set search_path = public
stable
as $$
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
$$;

revoke all on function public.get_league_leaderboard() from public;
grant execute on function public.get_league_leaderboard() to authenticated;
