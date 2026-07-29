alter table public.investment_decisions
  add column if not exists matures_at timestamptz,
  add column if not exists settled_at timestamptz,
  add column if not exists settlement_price numeric(14, 4)
    check (settlement_price is null or settlement_price > 0),
  add column if not exists settlement_value numeric(14, 4)
    check (settlement_value is null or settlement_value >= 0);

create or replace function public.investment_maturity(
  started_at timestamptz,
  chosen_horizon text
)
returns timestamptz
language sql
immutable
set search_path = public
as $$
  select started_at +
    case lower(trim(chosen_horizon))
      when '1 неделя' then interval '7 days'
      when '1 week' then interval '7 days'
      when '1 месяц' then interval '1 month'
      when '1 month' then interval '1 month'
      when '3 месяца' then interval '3 months'
      when '3 months' then interval '3 months'
      when '1 год' then interval '1 year'
      when '1 year' then interval '1 year'
      when '3–5 лет' then interval '3 years'
      when '3-5 years' then interval '3 years'
      when '3–5 years' then interval '3 years'
      else interval '1 year'
    end;
$$;

update public.investment_decisions
set matures_at = public.investment_maturity(created_at, horizon)
where matures_at is null;

alter table public.investment_decisions
  alter column matures_at set not null;

create or replace function public.set_investment_maturity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.matures_at is null then
    new.matures_at := public.investment_maturity(new.created_at, new.horizon);
  end if;
  return new;
end;
$$;

drop trigger if exists set_investment_maturity_on_insert
  on public.investment_decisions;

create trigger set_investment_maturity_on_insert
before insert on public.investment_decisions
for each row execute function public.set_investment_maturity();

create or replace function public.settle_mature_investments()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  investment record;
  closing_price numeric(14, 4);
  closing_value numeric(14, 4);
  settled_count integer := 0;
  current_balance numeric(14, 2);
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform pg_advisory_xact_lock(hashtext(current_user_id::text));

  insert into public.investment_accounts (user_id, balance)
  values (current_user_id, 10000)
  on conflict (user_id) do nothing;

  for investment in
    select id, symbol, quantity, price
    from public.investment_decisions
    where user_id = current_user_id
      and settled_at is null
      and matures_at <= now()
    order by matures_at
    for update
  loop
    select cache.price
    into closing_price
    from public.market_price_cache as cache
    where cache.user_id = current_user_id
      and cache.symbol = case
        when investment.symbol = 'HSBK' then 'HSBK.L'
        else investment.symbol
      end
      and cache.updated_at >= now() - interval '12 hours'
    limit 1;

    if closing_price is null then
      continue;
    end if;

    closing_value := round(closing_price * investment.quantity, 4);

    update public.investment_accounts
    set balance = balance + closing_value,
        updated_at = now()
    where user_id = current_user_id;

    update public.investment_decisions
    set settled_at = now(),
        settlement_price = closing_price,
        settlement_value = closing_value
    where id = investment.id
      and user_id = current_user_id
      and settled_at is null;

    settled_count := settled_count + 1;
  end loop;

  select balance
  into current_balance
  from public.investment_accounts
  where user_id = current_user_id;

  return jsonb_build_object(
    'balance', current_balance,
    'settled_count', settled_count
  );
end;
$$;

revoke all on function public.settle_mature_investments() from public;
grant execute on function public.settle_mature_investments() to authenticated;

revoke insert, update, delete on public.investment_decisions from authenticated;
grant select on public.investment_decisions to authenticated;
grant update (lesson) on public.investment_decisions to authenticated;
