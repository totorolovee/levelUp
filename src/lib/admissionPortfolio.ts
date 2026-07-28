import { supabase } from './supabase';

export type AdmissionPortfolio = {
  ielts: string;
  satScore: string;
  honors: string;
  major: string;
  extracurriculars: string;
  extracurricularFeedback: string;
};

export const emptyAdmissionPortfolio: AdmissionPortfolio = {
  ielts: '',
  satScore: '',
  honors: '',
  major: '',
  extracurriculars: '',
  extracurricularFeedback: '',
};

export async function loadAdmissionPortfolio() {
  const { data, error } = await supabase
    .from('admission_portfolios')
    .select('ielts,sat_score,honors,major,extracurriculars,extracurricular_feedback')
    .maybeSingle();
  if (error) throw error;
  if (!data) return emptyAdmissionPortfolio;
  return {
    ielts: data.ielts === null ? '' : String(data.ielts),
    satScore: data.sat_score === null ? '' : String(data.sat_score),
    honors: data.honors,
    major: data.major,
    extracurriculars: data.extracurriculars,
    extracurricularFeedback: data.extracurricular_feedback,
  };
}

export async function saveAdmissionPortfolio(portfolio: AdmissionPortfolio) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error('Authentication required');
  const { error } = await supabase.from('admission_portfolios').upsert({
    user_id: userData.user.id,
    ielts: portfolio.ielts ? Number(portfolio.ielts.replace(',', '.')) : null,
    sat_score: portfolio.satScore ? Number(portfolio.satScore) : null,
    honors: portfolio.honors.trim(),
    major: portfolio.major.trim(),
    extracurriculars: portfolio.extracurriculars.trim(),
    extracurricular_feedback: portfolio.extracurricularFeedback.trim(),
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
