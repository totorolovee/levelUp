import type { Stock } from '../lib/stocks';
import type { StockResearch } from '../lib/stockResearch';
import { getResearchSources } from '../lib/stockResearchSources';
import { ResearchReviewButton } from './ResearchReviewButton';

type SectionProps = {
  isRussian: boolean;
  reviewed: boolean;
  onToggle: () => void;
  stock: Stock;
};

export function OfficialMaterialsSection(props: SectionProps) {
  const { isRussian, reviewed, onToggle, stock } = props;
  const sources = getResearchSources(stock, isRussian);
  return (
    <section className="research-section official-materials">
      <header><span>1</span><div><h3>{isRussian ? 'Официальные материалы компании' : 'Official Company Materials'}</h3><small>★★★★★ · {isRussian ? 'обязательно' : 'required'}</small></div></header>
      <p>{isRussian
        ? 'Начни с документов, за которые отвечает сама компания.'
        : 'Start with documents the company is accountable for.'}</p>
      <div className="research-links">
        {sources.official.map((item) => (
          <a href={item.url} key={item.label} rel="noreferrer" target="_blank">
            <span>↗</span><strong>{item.label}</strong><small>{item.source}</small>
          </a>
        ))}
      </div>
      <ResearchReviewButton isRussian={isRussian} onToggle={onToggle} reviewed={reviewed} />
    </section>
  );
}

type AnalystProps = SectionProps & {
  consensus: StockResearch['consensus'] | null;
};

export function AnalystViewsSection(props: AnalystProps) {
  const { consensus, isRussian, reviewed, onToggle, stock } = props;
  const sources = getResearchSources(stock, isRussian);
  const views = [
    ['🟢', isRussian ? 'Позитивный сценарий' : 'Bull Case', isRussian ? 'Найди аргументы роста бизнеса.' : 'Find the business growth argument.'],
    ['🟡', isRussian ? 'Нейтральный взгляд' : 'Neutral View', isRussian ? 'Сравни цену, качество и неопределённость.' : 'Compare price, quality, and uncertainty.'],
    ['🔴', isRussian ? 'Негативный сценарий' : 'Bear Case', isRussian ? 'Найди причины, почему идея может не сработать.' : 'Find why the thesis could fail.'],
  ];
  return (
    <section className="research-section analyst-views">
      <header><span>2</span><div><h3>{isRussian ? 'Мнения аналитиков' : 'Analyst Views'}</h3><small>★★★★★ · {isRussian ? 'обязательно' : 'required'}</small></div></header>
      <div className="analyst-cases">
        {views.map(([icon, title, copy]) => <article key={title}><b>{icon} {title}</b><p>{copy}</p></article>)}
      </div>
      {consensus && (
        <div className="consensus-counts">
          <span>🟢 {consensus.bullish}</span><span>🟡 {consensus.neutral}</span><span>🔴 {consensus.bearish}</span>
        </div>
      )}
      <div className="source-buttons">
        <a href={sources.seekingAlpha} rel="noreferrer" target="_blank">Seeking Alpha ↗</a>
        <a href={sources.morningstar} rel="noreferrer" target="_blank">Morningstar ↗</a>
      </div>
      <small className="source-note">{isRussian
        ? 'Счётчики — агрегированный консенсус Finnhub, а не рекомендация LevelUp.'
        : 'Counts are aggregated Finnhub consensus, not a LevelUp recommendation.'}</small>
      <ResearchReviewButton isRussian={isRussian} onToggle={onToggle} reviewed={reviewed} />
    </section>
  );
}
