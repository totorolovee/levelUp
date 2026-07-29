create table public.saved_universities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  university_id text not null check (char_length(university_id) between 1 and 80),
  specialty text not null check (char_length(specialty) between 1 and 160),
  created_at timestamptz not null default now(),
  unique (user_id, university_id)
);

alter table public.saved_universities enable row level security;

create policy "Users can read own saved universities"
on public.saved_universities for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own saved universities"
on public.saved_universities for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete own saved universities"
on public.saved_universities for delete to authenticated
using (auth.uid() = user_id);

grant select, insert, delete on public.saved_universities to authenticated;

create function public.enforce_saved_university_limit()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if (
    select count(*) from public.saved_universities
    where user_id = new.user_id
  ) >= 5 then
    raise exception 'A user can save no more than 5 universities';
  end if;
  return new;
end;
$$;

create trigger enforce_saved_university_limit
before insert on public.saved_universities
for each row execute function public.enforce_saved_university_limit();

create function public.prevent_reading_progress_decrease()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.progress < old.progress then
    raise exception 'Reading progress cannot decrease';
  end if;
  return new;
end;
$$;

create trigger prevent_reading_progress_decrease
before update of progress on public.reading_progress
for each row execute function public.prevent_reading_progress_decrease();
