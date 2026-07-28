create table public.investment_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  symbol text not null check (symbol ~ '^[A-Z.]{1,10}$'),
  company text not null check (char_length(company) between 1 and 100),
  quantity integer not null check (quantity > 0),
  price numeric(14, 4) not null check (price > 0),
  reason text not null check (char_length(reason) between 1 and 2000),
  risk text not null check (char_length(risk) between 1 and 2000),
  invalidation text not null check (char_length(invalidation) between 1 and 2000),
  horizon text not null check (char_length(horizon) between 1 and 50),
  confidence integer not null check (confidence between 1 and 10),
  analysis_approved boolean not null default false,
  analysis_feedback text not null default '',
  lesson text,
  created_at timestamptz not null default now()
);

alter table public.investment_decisions enable row level security;

create policy "Users can read own investment decisions"
on public.investment_decisions for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own investment decisions"
on public.investment_decisions for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own investment decisions"
on public.investment_decisions for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own investment decisions"
on public.investment_decisions for delete to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.investment_decisions to authenticated;
