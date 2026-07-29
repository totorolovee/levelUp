create table public.todo_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 40),
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

alter table public.todo_categories enable row level security;

create policy "Users can read own todo categories"
on public.todo_categories for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own todo categories"
on public.todo_categories for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can delete own todo categories"
on public.todo_categories for delete to authenticated
using (auth.uid() = user_id);

grant select, insert, delete on public.todo_categories to authenticated;

alter table public.todo_items
  alter column category drop not null,
  add column custom_category_id uuid references public.todo_categories(id) on delete cascade,
  add constraint todo_items_category_source_check check (
    (category is not null and custom_category_id is null)
    or (category is null and custom_category_id is not null)
  );

drop policy "Users can insert own todo items" on public.todo_items;
create policy "Users can insert own todo items"
on public.todo_items for insert to authenticated
with check (
  auth.uid() = user_id
  and (
    custom_category_id is null
    or exists (
      select 1 from public.todo_categories
      where id = custom_category_id and user_id = auth.uid()
    )
  )
);

drop policy "Users can update own todo items" on public.todo_items;
create policy "Users can update own todo items"
on public.todo_items for update to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    custom_category_id is null
    or exists (
      select 1 from public.todo_categories
      where id = custom_category_id and user_id = auth.uid()
    )
  )
);
