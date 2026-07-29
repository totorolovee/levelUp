create table public.university_document_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  university_id text not null,
  document_key text not null check (char_length(document_key) between 1 and 80),
  completed boolean not null default false,
  due_date date,
  notes text not null default '' check (char_length(notes) <= 1000),
  updated_at timestamptz not null default now(),
  unique (user_id, university_id, document_key),
  foreign key (user_id, university_id)
    references public.saved_universities(user_id, university_id) on delete cascade
);

alter table public.university_document_progress enable row level security;

create policy "Users can read own university document progress"
on public.university_document_progress for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own university document progress"
on public.university_document_progress for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own university document progress"
on public.university_document_progress for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own university document progress"
on public.university_document_progress for delete to authenticated
using (auth.uid() = user_id);

grant select, insert, update, delete
on public.university_document_progress to authenticated;
