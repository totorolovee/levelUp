import { supabase } from './supabase';

export type UniversityDocumentProgress = {
  documentKey: string;
  completed: boolean;
  dueDate: string;
  notes: string;
};

type ProgressRow = {
  document_key: string;
  completed: boolean;
  due_date: string | null;
  notes: string;
};

export async function loadUniversityDocuments(universityId: string) {
  const { data, error } = await supabase
    .from('university_document_progress')
    .select('document_key,completed,due_date,notes')
    .eq('university_id', universityId);
  if (error) throw error;
  return (data as ProgressRow[]).map((row) => ({
    documentKey: row.document_key,
    completed: row.completed,
    dueDate: row.due_date ?? '',
    notes: row.notes,
  }));
}

export async function saveUniversityDocument(
  universityId: string,
  progress: UniversityDocumentProgress,
) {
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!data.user) throw new Error('Authentication required');
  const { error } = await supabase.from('university_document_progress').upsert({
    user_id: data.user.id,
    university_id: universityId,
    document_key: progress.documentKey,
    completed: progress.completed,
    due_date: progress.dueDate || null,
    notes: progress.notes,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,university_id,document_key' });
  if (error) throw error;
}
