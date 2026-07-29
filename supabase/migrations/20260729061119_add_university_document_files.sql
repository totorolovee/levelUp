alter table public.university_document_progress
  add column file_path text,
  add column file_name text check (
    file_name is null or char_length(file_name) between 1 and 255
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'university-documents',
  'university-documents',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can read own university files"
on storage.objects for select to authenticated
using (
  bucket_id = 'university-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can upload own university files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'university-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete own university files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'university-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);
