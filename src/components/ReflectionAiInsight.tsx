import type { ReflectionInsight } from '../lib/reflectionInsights';

type Props = {
  insight: ReflectionInsight;
  isRussian: boolean;
};

export function ReflectionAiInsight({ insight, isRussian }: Props) {
  return (
    <section className="reflection-ai-insight">
      <header>
        <span>AI</span>
        <div>
          <p className="eyebrow">{isRussian ? 'AI-инсайт' : 'AI Insight'}</p>
          <h3>{insight.headline}</h3>
        </div>
      </header>
      <div className="insight-pattern">
        <small>{isRussian ? 'Наблюдение' : 'Pattern detected'}</small>
        <p>{insight.pattern}</p>
      </div>
      <div className="insight-confidence">
        <span>{isRussian ? 'Уверенность по объёму данных' : 'Data confidence'}</span>
        <strong>{insight.confidence}%</strong>
        <i><span style={{ width: `${insight.confidence}%` }} /></i>
      </div>
      <div className="insight-action">
        <small>{isRussian ? 'Рекомендуемое действие' : 'Suggested action'}</small>
        <p>{insight.recommendation}</p>
      </div>
      <small className="insight-disclaimer">{isRussian
        ? 'Это наблюдение, а не медицинский или профессиональный вывод.'
        : 'This is an observation, not medical or professional advice.'}</small>
    </section>
  );
}
