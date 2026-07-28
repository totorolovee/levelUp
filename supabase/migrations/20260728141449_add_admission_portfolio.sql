create table public.admission_portfolios (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  ielts numeric(2, 1) check (ielts between 0 and 9 and ielts * 2 = trunc(ielts * 2)),
  sat_score integer check (sat_score between 400 and 1600),
  honors text not null default '' check (char_length(honors) <= 2000),
  major text not null default '' check (char_length(major) <= 120),
  updated_at timestamptz not null default now()
);

alter table public.admission_portfolios enable row level security;

create policy "Users can read own admission portfolio"
on public.admission_portfolios for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own admission portfolio"
on public.admission_portfolios for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own admission portfolio"
on public.admission_portfolios for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.admission_portfolios to authenticated;
