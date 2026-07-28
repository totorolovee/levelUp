create table public.investment_accounts (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  balance numeric(14, 4) not null default 10000 check (balance >= 0),
  updated_at timestamptz not null default now()
);

alter table public.investment_accounts enable row level security;

create policy "Users can read own investment account"
on public.investment_accounts for select to authenticated
using (auth.uid() = user_id);

grant select on public.investment_accounts to authenticated;

insert into public.investment_accounts (user_id, balance)
select
  user_id,
  greatest(0, 10000 - sum(price * quantity))
from public.investment_decisions
group by user_id
on conflict (user_id) do nothing;

create function public.get_my_investment_balance()
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  current_balance numeric;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  insert into public.investment_accounts (user_id)
  values (current_user_id)
  on conflict (user_id) do nothing;

  select balance into current_balance
  from public.investment_accounts
  where user_id = current_user_id;

  return current_balance;
end;
$$;

create function public.buy_investment(
  chosen_symbol text,
  chosen_company text,
  chosen_quantity integer,
  chosen_price numeric,
  chosen_reason text,
  chosen_risk text,
  chosen_invalidation text,
  chosen_horizon text,
  chosen_confidence integer,
  chosen_analysis_approved boolean,
  chosen_analysis_feedback text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  purchase public.investment_decisions;
  remaining_balance numeric;
  purchase_total numeric := chosen_price * chosen_quantity;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;
  if purchase_total <= 0 then
    raise exception 'Invalid purchase total';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(current_user_id::text, 0));

  insert into public.investment_accounts (user_id)
  values (current_user_id)
  on conflict (user_id) do nothing;

  update public.investment_accounts
  set balance = balance - purchase_total,
      updated_at = now()
  where user_id = current_user_id
    and balance >= purchase_total
  returning balance into remaining_balance;

  if remaining_balance is null then
    raise exception 'Insufficient virtual balance';
  end if;

  insert into public.investment_decisions (
    user_id, symbol, company, quantity, price, reason, risk, invalidation,
    horizon, confidence, analysis_approved, analysis_feedback
  )
  values (
    current_user_id, chosen_symbol, chosen_company, chosen_quantity, chosen_price,
    chosen_reason, chosen_risk, chosen_invalidation, chosen_horizon,
    chosen_confidence, chosen_analysis_approved, chosen_analysis_feedback
  )
  returning * into purchase;

  return jsonb_build_object(
    'balance', remaining_balance,
    'decision', to_jsonb(purchase)
  );
end;
$$;

revoke all on function public.get_my_investment_balance() from public;
revoke all on function public.buy_investment(
  text, text, integer, numeric, text, text, text, text, integer, boolean, text
) from public;
grant execute on function public.get_my_investment_balance() to authenticated;
grant execute on function public.buy_investment(
  text, text, integer, numeric, text, text, text, text, integer, boolean, text
) to authenticated;
