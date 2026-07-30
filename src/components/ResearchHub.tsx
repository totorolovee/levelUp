import { useEffect, useState } from 'react';
import type { Stock } from '../lib/stocks';
import {
  generateStockSummary,
  loadStockResearch,
  type StockResearch,
} from '../lib/stockResearch';
import { FinancialSnapshotSection, NewsConsensusSection } from './ResearchDataSections';
import { AnalystViewsSection, OfficialMaterialsSection } from './ResearchSourceSections';

type Props = {
  isRussian: boolean;
  onReady: () => void;
  stock: Stock;
};

type StepId = 'official' | 'analysts' | 'financials' | 'news';

export function ResearchHub({ isRussian, onReady, stock }: Props) {
  const [research, setResearch] = useState<StockResearch | null>(null);
  const [dataStatus, setDataStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [reviewed, setReviewed] = useState<Set<StepId>>(new Set());
  const [summary, setSummary] = useState('');
  const [summaryStatus, setSummaryStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const allReviewed = reviewed.size === 4;

  useEffect(() => {
    let active = true;
    setDataStatus('loading');
    void loadStockResearch(stock.quoteSymbol ?? stock.symbol)
      .then((data) => {
        if (!active) return;
        setResearch(data);
        setDataStatus('ready');
      })
      .catch(() => {
        if (active) setDataStatus('error');
      });
    return () => { active = false; };
  }, [stock.quoteSymbol, stock.symbol]);

  const toggle = (id: StepId) => {
    setReviewed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const createSummary = async () => {
    if (!allReviewed || summaryStatus === 'loading') return;
    setSummaryStatus('loading');
    try {
      const text = await generateStockSummary(stock, research, isRussian ? 'ru' : 'en');
      setSummary(text);
      setSummaryStatus('idle');
      onReady();
    } catch {
      setSummaryStatus('error');
    }
  };

  return (
    <section className="research-hub">
      <header className="research-hub-heading">
        <div>
          <p className="eyebrow">Research Hub</p>
          <h2>{isRussian ? 'Сначала исследование. Потом решение.' : 'Research first. Decide second.'}</h2>
        </div>
        <span>{reviewed.size}/4</span>
      </header>
      <p className="research-intro">{isRussian
        ? 'Пройди четыре типа источников. LevelUp не решает за тебя — он учит проверять инвестиционную идею.'
        : 'Review four source types. LevelUp does not decide for you—it teaches you to test an investment thesis.'}</p>
      {dataStatus === 'loading' && <p className="research-data-status">{isRussian ? 'Загружаю свежие данные…' : 'Loading recent data…'}</p>}
      {dataStatus === 'error' && <p className="research-data-status warning">{isRussian
        ? 'Live-данные не загрузились. Ссылки на первоисточники всё равно доступны.'
        : 'Live data did not load. Primary-source links are still available.'}</p>}
      <div className="research-grid">
        <OfficialMaterialsSection isRussian={isRussian} onToggle={() => toggle('official')} reviewed={reviewed.has('official')} stock={stock} />
        <AnalystViewsSection consensus={research?.consensus ?? null} isRussian={isRussian} onToggle={() => toggle('analysts')} reviewed={reviewed.has('analysts')} stock={stock} />
        <FinancialSnapshotSection isRussian={isRussian} onToggle={() => toggle('financials')} research={research} reviewed={reviewed.has('financials')} stock={stock} />
        <NewsConsensusSection isRussian={isRussian} onToggle={() => toggle('news')} research={research} reviewed={reviewed.has('news')} stock={stock} />
      </div>
      <section className="research-summary">
        <div>
          <p className="eyebrow">AI Summary</p>
          <h3>{isRussian ? 'Собери факты в одну картину' : 'Bring the evidence together'}</h3>
          <p>{isRussian
            ? 'AI использует профиль компании, доступные показатели, консенсус и заголовки. Он не заменяет оригинальные документы.'
            : 'AI uses the company profile, available metrics, consensus, and headlines. It does not replace original documents.'}</p>
        </div>
        {!summary && (
          <button disabled={!allReviewed || summaryStatus === 'loading'} onClick={createSummary} type="button">
            {summaryStatus === 'loading'
              ? (isRussian ? 'Собираю резюме…' : 'Creating summary…')
              : (isRussian ? 'Создать AI-резюме' : 'Create AI summary')}
          </button>
        )}
        {summaryStatus === 'error' && <p className="coach-error">{isRussian ? 'Не удалось создать резюме. Попробуй ещё раз.' : 'Could not create the summary. Try again.'}</p>}
        {summary && <div className="research-summary-text">{summary}</div>}
      </section>
    </section>
  );
}
