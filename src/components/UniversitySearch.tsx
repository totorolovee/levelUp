import type { University } from '../lib/universities';
import { qsRankingSourceUrl, qsWorldRankings2027 } from '../lib/universityRankings';

type Props = {
  universities: University[];
  query: string;
  selectedId: string;
  onQueryChange: (value: string) => void;
  onSelect: (university: University) => void;
};

export function UniversitySearch({
  universities,
  query,
  selectedId,
  onQueryChange,
  onSelect,
}: Props) {
  return (
    <section className="university-browser">
      <p className="eyebrow">Шаг 4</p>
      <label className="university-search">
        Найди университет
        <input
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Например: Stanford или MIT"
          type="search"
          value={query}
        />
      </label>
      <div className="university-list">
        {universities.map((university) => (
          <button
            className={selectedId === university.id ? 'university-option selected' : 'university-option'}
            key={university.id}
            onClick={() => onSelect(university)}
            type="button"
          >
            <span>{university.shortName.slice(0, 2).toUpperCase()}</span>
            <div>
              <div className="university-option-title">
                <strong>{university.shortName}</strong>
                <small className="university-rank">QS #{qsWorldRankings2027[university.id]}</small>
              </div>
              <small>{university.location}</small>
            </div>
            <b>→</b>
          </button>
        ))}
        {universities.length === 0 && (
          <p className="university-empty">Пока такого университета нет в каталоге.</p>
        )}
      </div>
      <a className="ranking-source" href={qsRankingSourceUrl} rel="noreferrer" target="_blank">
        Мировой рейтинг QS 2027 ↗
      </a>
    </section>
  );
}
