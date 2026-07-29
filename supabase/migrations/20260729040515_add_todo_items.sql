create table public.todo_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category text not null check (category in ('work', 'study', 'personal')),
  title text not null check (char_length(title) between 1 and 300),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.todo_items enable row level security;

create policy "Users can read own todo items"
on public.todo_items for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own todo items"
on public.todo_items for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own todo items"
on public.todo_items for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own todo items"
on public.todo_items for delete to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.todo_items to authenticated;
