create table public.todo_subtasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  todo_id uuid not null references public.todo_items(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.todo_subtasks enable row level security;

create policy "Users can read own todo subtasks"
on public.todo_subtasks for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own todo subtasks"
on public.todo_subtasks for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.todo_items
    where id = todo_id and user_id = auth.uid()
  )
);

create policy "Users can update own todo subtasks"
on public.todo_subtasks for update to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.todo_items
    where id = todo_id and user_id = auth.uid()
  )
);

create policy "Users can delete own todo subtasks"
on public.todo_subtasks for delete to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete on public.todo_subtasks to authenticated;

create index todo_subtasks_todo_id_idx on public.todo_subtasks(todo_id);
