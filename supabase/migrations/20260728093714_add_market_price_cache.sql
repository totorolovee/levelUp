create table public.market_price_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  symbol text not null check (symbol ~ '^[A-Z.]{1,10}$'),
  price numeric not null check (price > 0),
  change numeric not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, symbol)
);

alter table public.market_price_cache enable row level security;

create policy "Users can read own market cache"
on public.market_price_cache for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own market cache"
on public.market_price_cache for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own market cache"
on public.market_price_cache for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own market cache"
on public.market_price_cache for delete
to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.market_price_cache to authenticated;
