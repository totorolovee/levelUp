import type { UniversityDocumentAnalysis } from '../lib/universityDocumentAnalysis';

type Props = {
  analysis: UniversityDocumentAnalysis;
  isRussian: boolean;
};

export function DocumentAiReview({ analysis, isRussian }: Props) {
  const hasErrors = analysis.issues.some(({ severity }) => severity === 'error');
  const state = hasErrors || analysis.score < 60
    ? 'error'
    : analysis.issues.length || analysis.score < 80 ? 'warning' : 'ready';
  const label = state === 'ready'
    ? (isRussian ? 'Документ готов' : 'Document ready')
    : state === 'warning'
      ? (isRussian ? 'Нужно проверить' : 'Review needed')
      : (isRussian ? 'Нужно исправить' : 'Needs correction');
  return (
    <section className={`document-ai-review ${state}`}>
      <header>
        <span>AI</span>
        <div><strong>{label}</strong><small>{isRussian ? 'Оценка документа' : 'Document score'} · {analysis.score}/100</small></div>
      </header>
      {analysis.summary && <p>{analysis.summary}</p>}
      {analysis.issues.length > 0 ? (
        <div className="document-ai-issues">
          {analysis.issues.map((issue, index) => (
            <article className={issue.severity} key={`${issue.description}-${index}`}>
              <div>
                <strong>{issue.severity === 'error'
                  ? (isRussian ? 'Проблема' : 'Issue')
                  : (isRussian ? 'Проверь' : 'Check')}</strong>
                {issue.page && <small>{isRussian ? 'Страница' : 'Page'} {issue.page}</small>}
              </div>
              {issue.quote && <mark>“{issue.quote}”</mark>}
              <p>{issue.description}</p>
              {issue.fix && <small><b>{isRussian ? 'Как исправить:' : 'How to fix:'}</b> {issue.fix}</small>}
            </article>
          ))}
        </div>
      ) : <p className="document-ai-clear">✓ {isRussian ? 'Явных проблем не найдено.' : 'No clear issues found.'}</p>}
      <small className="document-ai-disclaimer">{isRussian
        ? 'Проверь замечания по оригиналу: ИИ может ошибаться.'
        : 'Verify annotations against the original: AI can make mistakes.'}</small>
    </section>
  );
}
