create table public.goal_achievement_progress (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  completed_steps integer not null default 0 check (completed_steps >= 0),
  updated_at timestamptz not null default now()
);

alter table public.goal_achievement_progress enable row level security;

create policy "Users can read own goal achievement progress"
on public.goal_achievement_progress for select to authenticated
using (auth.uid() = user_id);

grant select on public.goal_achievement_progress to authenticated;

insert into public.goal_achievement_progress (user_id, completed_steps)
select user_id, 1
from public.achievements
where achievement_key = 'goal_first_step'
on conflict (user_id) do nothing;

create function public.complete_my_goal_step()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  new_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.goal_achievement_progress (user_id, completed_steps)
  values (current_user_id, 1)
  on conflict (user_id) do update
  set completed_steps = goal_achievement_progress.completed_steps + 1,
      updated_at = now()
  returning completed_steps into new_count;

  return new_count;
end;
$$;

revoke all on function public.complete_my_goal_step() from public;
grant execute on function public.complete_my_goal_step() to authenticated;
