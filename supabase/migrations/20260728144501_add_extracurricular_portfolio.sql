alter table public.admission_portfolios
add column extracurriculars text not null default ''
  check (char_length(extracurriculars) <= 3000),
add column extracurricular_feedback text not null default ''
  check (char_length(extracurricular_feedback) <= 3000);
