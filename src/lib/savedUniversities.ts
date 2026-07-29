import { supabase } from './supabase';

export type SavedUniversity = {
  universityId: string;
  specialtyId: string;
};

type SavedUniversityRow = {
  university_id: string;
  specialty: string;
};

export async function loadSavedUniversities(): Promise<SavedUniversity[]> {
  const { data, error } = await supabase
    .from('saved_universities')
    .select('university_id,specialty')
    .order('created_at');
  if (error) throw error;
  return (data as SavedUniversityRow[]).map((row) => ({
    universityId: row.university_id,
    specialtyId: row.specialty,
  }));
}

export async function saveUniversity(universityId: string, specialtyId: string) {
  const { error } = await supabase
    .from('saved_universities')
    .insert({ university_id: universityId, specialty: specialtyId });
  if (error) throw error;
}

export async function removeSavedUniversity(universityId: string) {
  const { error } = await supabase
    .from('saved_universities')
    .delete()
    .eq('university_id', universityId);
  if (error) throw error;
}
