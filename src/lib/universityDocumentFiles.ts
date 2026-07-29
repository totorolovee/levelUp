import { supabase } from './supabase';

const bucket = 'university-documents';

export async function uploadUniversityDocument(
  universityId: string,
  documentKey: string,
  file: File,
) {
  if (file.size > 10 * 1024 * 1024) throw new Error('File is too large');
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!data.user) throw new Error('Authentication required');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120);
  const path = `${data.user.id}/${universityId}/${documentKey}/${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deleteUniversityDocumentFile(path: string) {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export async function getUniversityDocumentUrl(path: string) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}
