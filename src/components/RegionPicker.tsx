import type { UniversityRegion, UniversityRegionId } from '../lib/universities';
import { useLanguage } from '../lib/language';
import { getRegionName } from '../lib/universityTranslations';

type Props = {
  regions: UniversityRegion[];
  selectedIds: UniversityRegionId[];
  onSelect: (region: UniversityRegion) => void;
};

export function RegionPicker({ regions, selectedIds, onSelect }: Props) {
  const { language } = useLanguage();
  return (
    <section className="region-picker" aria-labelledby="region-picker-title">
      <div>
        <p className="eyebrow">Шаг 3</p>
        <h2 id="region-picker-title">Выбери регионы</h2>
      </div>
      <div className="region-options">
        {regions.map((region) => {
          const isSelected = selectedIds.includes(region.id);
          return (
            <button
              aria-pressed={isSelected}
              className={isSelected ? 'region-option selected' : 'region-option'}
              key={region.id}
              onClick={() => onSelect(region)}
              type="button"
            >
              <strong>
                {isSelected ? '✓ ' : ''}
                {getRegionName(region.id, region.name, language)}
              </strong>
              <span>{region.universities.map(({ shortName }) => shortName).slice(0, 4).join(', ')}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
