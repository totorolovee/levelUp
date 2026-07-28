import { useEffect, useState } from 'react';
import {
  emptyAdmissionPortfolio,
  loadAdmissionPortfolio,
  saveAdmissionPortfolio,
  type AdmissionPortfolio as Portfolio,
} from '../lib/admissionPortfolio';
import { useLanguage } from '../lib/language';
import { ExtracurricularEvaluator } from './ExtracurricularEvaluator';

export function AdmissionPortfolio() {
  const { language } = useLanguage();
  const [portfolio, setPortfolio] = useState<Portfolio>(emptyAdmissionPortfolio);
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'error'>('loading');
  const isRussian = language === 'ru';

  useEffect(() => {
    loadAdmissionPortfolio()
      .then((data) => {
        setPortfolio(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  const update = (key: keyof Portfolio, value: string) => {
    setPortfolio((current) => ({ ...current, [key]: value }));
    setStatus('ready');
  };
  const ieltsIsValid = !portfolio.ielts
    || /^(?:[0-8](?:\.[05])?|9(?:\.0)?)$/.test(portfolio.ielts);
  const satValue = Number(portfolio.satScore);
  const satIsValid = !portfolio.satScore
    || (satValue >= 400 && satValue <= 1600 && satValue % 10 === 0);

  const save = async () => {
    setStatus('saving');
    try {
      await saveAdmissionPortfolio(portfolio);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="admission-portfolio">
      <div>
        <p className="eyebrow">{isRussian ? 'Для университетов' : 'For universities'}</p>
        <h2>{isRussian ? 'Академическое портфолио' : 'Academic portfolio'}</h2>
        <p>
          {isRussian
            ? 'Собери основные данные для сравнения требований вузов.'
            : 'Keep the main details used to compare university requirements.'}
        </p>
      </div>
      <div className="portfolio-fields">
        <label>
          IELTS
          <input
            inputMode="decimal"
            onChange={(event) => {
              const value = event.target.value.replace(',', '.');
              if (value === '' || /^(?:[0-8](?:\.[05]?)?|9(?:\.0?)?)$/.test(value)) {
                update('ielts', value);
              }
            }}
            placeholder="6.5"
            value={portfolio.ielts}
          />
        </label>
        <label>
          SAT
          <input
            inputMode="numeric"
            max="1600"
            min="400"
            onChange={(event) => {
              const value = event.target.value;
              if (value === '' || (/^\d{1,4}$/.test(value) && Number(value) <= 1600)) {
                update('satScore', value);
              }
            }}
            placeholder="1400"
            step="10"
            type="number"
            value={portfolio.satScore}
          />
          {portfolio.satScore && !satIsValid && (
            <small className="field-hint error">
              {isRussian ? 'Только 400–1600, последняя цифра — 0.' : 'Use 400–1600 and end the score with 0.'}
            </small>
          )}
        </label>
        <label className="portfolio-wide">
          {isRussian ? 'Honors — награды и достижения' : 'Honors and achievements'}
          <textarea
            maxLength={2000}
            onChange={(event) => update('honors', event.target.value)}
            placeholder={isRussian ? 'Олимпиады, конкурсы, проекты…' : 'Awards, competitions, projects…'}
            rows={4}
            value={portfolio.honors}
          />
        </label>
        <label className="portfolio-wide">
          Major
          <input
            maxLength={120}
            onChange={(event) => update('major', event.target.value)}
            placeholder={isRussian ? 'Например: Computer Science' : 'For example: Computer Science'}
            value={portfolio.major}
          />
        </label>
        <ExtracurricularEvaluator
          feedback={portfolio.extracurricularFeedback}
          major={portfolio.major}
          onChange={(value) => update('extracurriculars', value)}
          onFeedback={(value) => update('extracurricularFeedback', value)}
          value={portfolio.extracurriculars}
        />
      </div>
      <button
        disabled={!ieltsIsValid || !satIsValid || status === 'loading' || status === 'saving'}
        onClick={save}
        type="button"
      >
        {status === 'saving' ? '…' : isRussian ? 'Сохранить портфолио' : 'Save portfolio'}
      </button>
      {status === 'saved' && <p className="settings-message">{isRussian ? 'Портфолио сохранено.' : 'Portfolio saved.'}</p>}
      {status === 'error' && <p className="error">{isRussian ? 'Не удалось загрузить или сохранить данные.' : 'Could not load or save the data.'}</p>}
    </section>
  );
}
