import type { Stock } from '../lib/stocks';
import type { StockResearch } from '../lib/stockResearch';
import { getResearchSources } from '../lib/stockResearchSources';
import { ResearchReviewButton } from './ResearchReviewButton';

type Props = {
  isRussian: boolean;
  research: StockResearch | null;
  reviewed: boolean;
  onToggle: () => void;
  stock: Stock;
};

const metricLabels = {
  ru: {
    revenue: 'Рост выручки · 5 лет',
    eps: 'EPS · последние 12 мес.',
    fcf: 'Свободный денежный поток',
    margin: 'Операционная маржа',
    debt: 'Долг / капитал',
    roe: 'ROE',
  },
  en: {
    revenue: 'Revenue growth · 5Y',
    eps: 'EPS · trailing 12 months',
    fcf: 'Free cash flow',
    margin: 'Operating margin',
    debt: 'Debt / equity',
    roe: 'ROE',
  },
};

export function FinancialSnapshotSection(props: Props) {
  const { isRussian, onToggle, research, reviewed, stock } = props;
  const sources = getResearchSources(stock);
  const labels = metricLabels[isRussian ? 'ru' : 'en'];
  return (
    <section className="research-section financial-snapshot">
      <header><span>3</span><div><h3>Financial Snapshot</h3><small>★★★★</small></div></header>
      {research?.financials.length ? (
        <div className="financial-metrics">
          {research.financials.map((item) => (
            <article key={item.id}>
              <span>{labels[item.id]}</span>
              <strong>{item.unit.startsWith('$') ? '$' : ''}{item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}{item.unit.startsWith('$') ? item.unit.slice(1) : item.unit}</strong>
            </article>
          ))}
        </div>
      ) : <p>{isRussian ? 'Показатели сейчас недоступны — проверь графики в источнике.' : 'Metrics are unavailable—check the source charts.'}</p>}
      {sources.macrotrends && <a className="single-source-link" href={sources.macrotrends} rel="noreferrer" target="_blank">Macrotrends ↗</a>}
      <small className="source-note">{isRussian ? 'Live-показатели: Finnhub.' : 'Live metrics: Finnhub.'}</small>
      <ResearchReviewButton isRussian={isRussian} onToggle={onToggle} reviewed={reviewed} />
    </section>
  );
}

export function NewsConsensusSection(props: Props) {
  const { isRussian, onToggle, research, reviewed, stock } = props;
  const sources = getResearchSources(stock);
  return (
    <section className="research-section news-consensus">
      <header><span>4</span><div><h3>News & Consensus</h3><small>★★★★</small></div></header>
      <div className="research-news">
        {research?.news.length
          ? research.news.slice(0, 3).map((item) => (
            <a href={item.url} key={`${item.source}-${item.headline}`} rel="noreferrer" target="_blank">
              <small>{item.source}</small><strong>{item.headline}</strong>
            </a>
          ))
          : <p>{isRussian ? 'Свежие новости сейчас не загрузились.' : 'Recent news did not load.'}</p>}
      </div>
      <a className="single-source-link" href={sources.yahoo} rel="noreferrer" target="_blank">Yahoo Finance ↗</a>
      <small className="source-note">{isRussian ? 'Превью новостей: Finnhub. Всегда открывай оригинал.' : 'News previews: Finnhub. Always open the original.'}</small>
      <ResearchReviewButton isRussian={isRussian} onToggle={onToggle} reviewed={reviewed} />
    </section>
  );
}
