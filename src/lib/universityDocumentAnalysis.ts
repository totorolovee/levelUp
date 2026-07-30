import { supabase } from './supabase';
import type { UniversityDocumentProgress } from './universityDocuments';

export type DocumentIssue = {
  severity: 'error' | 'warning';
  quote: string;
  page: string;
  description: string;
  fix: string;
};

export type UniversityDocumentAnalysis = {
  score: number;
  summary: string;
  issues: DocumentIssue[];
};

type DocumentInput = {
  key: string;
  title: string;
  saved: UniversityDocumentProgress;
};

type AiResponse = { text?: unknown };

function cleanText(value: unknown, limit: number) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function parseAnalysis(text: string, allowedKeys: Set<string>) {
  const jsonText = text.match(/\{[\s\S]*\}/)?.[0];
  if (!jsonText) throw new Error('AI did not return JSON');
  const parsed = JSON.parse(jsonText) as unknown;
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid AI analysis');
  const root = parsed as { overview?: unknown; documents?: unknown };
  if (!Array.isArray(root.documents)) throw new Error('Missing document analyses');
  const analyses: Record<string, UniversityDocumentAnalysis> = {};
  for (const value of root.documents) {
    if (!value || typeof value !== 'object') continue;
    const item = value as Record<string, unknown>;
    const key = cleanText(item.documentKey, 80);
    if (!allowedKeys.has(key)) continue;
    const rawIssues = Array.isArray(item.issues) ? item.issues : [];
    const issues = rawIssues.flatMap((issue): DocumentIssue[] => {
      if (!issue || typeof issue !== 'object') return [];
      const fields = issue as Record<string, unknown>;
      return [{
        severity: fields.severity === 'error' ? 'error' : 'warning',
        quote: cleanText(fields.quote, 240),
        page: cleanText(fields.page, 40),
        description: cleanText(fields.description, 420),
        fix: cleanText(fields.fix, 320),
      }];
    }).filter((issue) => issue.description);
    const parsedScore = typeof item.score === 'number' ? item.score : Number(item.score);
    const rawScore = Number.isFinite(parsedScore) ? parsedScore : 0;
    analyses[key] = {
      score: Math.max(0, Math.min(100, Math.round(rawScore))),
      summary: cleanText(item.summary, 500),
      issues,
    };
  }
  return { analyses, overview: cleanText(root.overview, 1200) };
}

export async function analyzeUniversityDocuments(
  documents: DocumentInput[],
  context: { language: 'ru' | 'en'; specialty: string; universityName: string },
) {
  const analyzable = documents.filter(({ saved }) =>
    Boolean(saved.filePath) && /\.(pdf|png|jpe?g)$/i.test(saved.fileName)).slice(0, 3);
  const manifest = analyzable.map(({ key, title, saved }, index) =>
    `DOCUMENT_${index + 1}: documentKey=${key}; expected type=${title}; file=${saved.fileName}`).join('\n');
  const checklist = documents.map(({ key, title, saved }) =>
    `${key}: ${saved.completed ? 'complete' : 'not complete'}; ${title}; due=${saved.dueDate || 'none'}; notes=${saved.notes || 'none'}`).join('\n');
  const prompt = [
    `University: ${context.universityName}`,
    `Major: ${context.specialty}`,
    `Attached file manifest:\n${manifest || 'No analyzable files attached.'}`,
    `Checklist:\n${checklist}`,
    'Return only the requested JSON.',
  ].join('\n\n');
  const outputLanguage = context.language === 'ru' ? 'Russian' : 'English';
  const system = [
    'You review university application PDFs and images for visible document-quality issues.',
    'Match attachments to DOCUMENT_1, DOCUMENT_2, DOCUMENT_3 in the same order.',
    `Write all human-readable fields in ${outputLanguage}.`,
    'Return valid JSON: {"overview":"short next step","documents":[{"documentKey":"exact key","score":0,"summary":"short assessment","issues":[{"severity":"error|warning","quote":"exact short visible excerpt or empty","page":"page number or empty","description":"what is wrong","fix":"how to fix it"}]}]}.',
    'Use error only for a clear missing, conflicting, unreadable, unsigned, undated, or incomplete item. Use warning for uncertainty.',
    'Never invent a quote, page, requirement, or problem. If uncertain, say so and use an empty quote.',
    'Do not repeat unnecessary personal data. Do not predict admission.',
  ].join(' ');
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: {
      filePaths: analyzable.map(({ saved }) => saved.filePath),
      prompt,
      system,
    },
  });
  if (error || typeof data?.text !== 'string') throw new Error('Document analysis unavailable');
  return parseAnalysis(data.text, new Set(analyzable.map(({ key }) => key)));
}
