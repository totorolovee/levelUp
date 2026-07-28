-- RLS по-прежнему ограничивает выборку строками текущего пользователя.
grant select on public.entries to authenticated;
