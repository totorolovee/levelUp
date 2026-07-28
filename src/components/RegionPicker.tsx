import type { UniversityRegion, UniversityRegionId } from '../lib/universities';

type Props = {
  regions: UniversityRegion[];
  selectedId: UniversityRegionId;
  onSelect: (region: UniversityRegion) => void;
};

export function RegionPicker({ regions, selectedId, onSelect }: Props) {
  return (
    <section className="region-picker" aria-labelledby="region-picker-title">
      <div>
        <p className="eyebrow">Шаг 3</p>
        <h2 id="region-picker-title">Выбери регион</h2>
      </div>
      <div className="region-options">
        {regions.map((region) => (
          <button
            className={region.id === selectedId ? 'region-option selected' : 'region-option'}
            key={region.id}
            onClick={() => onSelect(region)}
            type="button"
          >
            <strong>{region.name}</strong>
            <span>{region.universities.map(({ shortName }) => shortName).slice(0, 3).join(', ')}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
