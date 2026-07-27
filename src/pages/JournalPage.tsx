import { AppHeader } from '../components/AppHeader';
import { DecisionReview } from '../components/DecisionReview';
import { SmoothLink } from '../components/SmoothLink';
import { usePortfolio } from '../lib/portfolio';
import { formatMoney } from '../lib/stocks';

export function JournalPage() {
  const { decisions, reviewDecision } = usePortfolio();

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro">
        <div>
          <p className="eyebrow">Decision Journal</p>
          <h1>Здесь видно, как ты думаешь.</h1>
          <p>Цена может обмануть. Твоя старая логика — никогда.</p>
        </div>
      </section>
      {decisions.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">↗</div>
          <h2>Чистый лист. Первое решение за тобой.</h2>
          <p>
            Выбери компанию, объясни причину покупки — и запись появится здесь.
          </p>
          <SmoothLink className="primary-link" href="/investing">
            Выбрать акцию
          </SmoothLink>
        </section>
      ) : (
        <section className="journal-list">
          {decisions.map((decision) => (
            <article className="journal-card" key={decision.id}>
              <div className="journal-meta">
                <strong>{decision.symbol}</strong>
                <span>
                  {decision.createdAt.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <h2>{decision.company}</h2>
              <p>{decision.reason}</p>
              <dl className="decision-facts">
                <div><dt>Риск</dt><dd>{decision.risk}</dd></div>
                <div><dt>Изменю мнение, если</dt><dd>{decision.invalidation}</dd></div>
                <div><dt>План</dt><dd>{decision.horizon} · уверенность {decision.confidence}/10</dd></div>
              </dl>
              <small>
                {decision.quantity} шт. · {formatMoney(decision.price)} за акцию
              </small>
              <DecisionReview
                lesson={decision.lesson}
                onSave={(lesson) => reviewDecision(decision.id, lesson)}
              />
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
