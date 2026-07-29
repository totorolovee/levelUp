alter table public.todo_items
  add column priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  add column due_date date;
