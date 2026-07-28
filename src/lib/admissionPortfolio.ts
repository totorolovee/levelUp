import { supabase } from './supabase';

export type AdmissionPortfolio = {
  ielts: string;
  satScore: string;
  honors: string;
  major: string;
};

export const emptyAdmissionPortfolio: AdmissionPortfolio = {
  ielts: '',
  satScore: '',
  honors: '',
  major: '',
};

export async function loadAdmissionPortfolio() {
  const { data, error } = await supabase
    .from('admission_portfolios')
    .select('ielts,sat_score,honors,major')
    .maybeSingle();
  if (error) throw error;
  if (!data) return emptyAdmissionPortfolio;
  return {
    ielts: data.ielts === null ? '' : String(data.ielts),
    satScore: data.sat_score === null ? '' : String(data.sat_score),
    honors: data.honors,
    major: data.major,
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
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}
