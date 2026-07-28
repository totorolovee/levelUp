create table public.username_changes (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  last_changed_at timestamptz not null default now()
);

alter table public.username_changes enable row level security;

create policy "Users can read own username cooldown"
on public.username_changes for select to authenticated
using (auth.uid() = user_id);

grant select on public.username_changes to authenticated;

create function public.change_my_username(new_username text)
returns timestamptz
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user_id uuid := auth.uid();
  clean_username text := trim(new_username);
  previous_change timestamptz;
  changed_at timestamptz := now();
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(current_user_id::text, 0));
  if char_length(clean_username) not between 2 and 30 then
    raise exception 'Username must contain 2 to 30 characters';
  end if;

  select last_changed_at into previous_change
  from public.username_changes
  where user_id = current_user_id
  for update;

  if previous_change is not null and previous_change + interval '14 days' > changed_at then
    raise exception 'Username can only be changed once every 14 days';
  end if;

  update auth.users
  set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
    || jsonb_build_object('display_name', clean_username),
      updated_at = changed_at
  where id = current_user_id;

  insert into public.username_changes (user_id, last_changed_at)
  values (current_user_id, changed_at)
  on conflict (user_id) do update
  set last_changed_at = excluded.last_changed_at;

  return changed_at + interval '14 days';
end;
$$;

revoke all on function public.change_my_username(text) from public;
grant execute on function public.change_my_username(text) to authenticated;
