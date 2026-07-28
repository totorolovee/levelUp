import { supabase } from './supabase';

type AiResponse = { text?: unknown };

export async function evaluateExtracurriculars(
  extracurriculars: string,
  major: string,
  language: 'ru' | 'en',
) {
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: {
      prompt: [
        `Intended major: ${major || 'not specified'}`,
        'Extracurricular activities:',
        extracurriculars,
      ].join('\n'),
      system: [
        'Ты консультант подростка по подготовке портфолио для университетов.',
        'Оцени extracurricular activities по конкретности, длительности, инициативе,',
        'лидерству, реальному вкладу и измеримому результату.',
        'Не придумывай факты, не обещай поступление и не сравнивай ребёнка с другими.',
        'Сначала назови 2 сильные стороны, затем 2 конкретных улучшения.',
        language === 'ru' ? 'Ответь кратко по-русски.' : 'Reply briefly in English.',
      ].join(' '),
    },
  });
  if (error || typeof data?.text !== 'string') {
    throw new Error('AI evaluation failed');
  }
  return data.text.trim().slice(0, 3000);
}
