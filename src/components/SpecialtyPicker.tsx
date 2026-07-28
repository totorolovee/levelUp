import type { UniversitySpecialty } from '../lib/universitySpecialties';
import { useLanguage } from '../lib/language';
import { getSpecialtyTranslation } from '../lib/universityTranslations';

type Props = {
  specialties: UniversitySpecialty[];
  selectedId: string;
  onSelect: (specialty: UniversitySpecialty) => void;
};

export function SpecialtyPicker({ specialties, selectedId, onSelect }: Props) {
  const { language } = useLanguage();

  return (
    <section className="choice-step" aria-labelledby="specialty-picker-title">
      <div>
        <p className="eyebrow">Шаг 2</p>
        <h2 id="specialty-picker-title">Выбери специальность</h2>
      </div>
      <div className="specialty-options">
        {specialties.map((specialty) => (
          <button
            className={specialty.id === selectedId ? 'specialty-option selected' : 'specialty-option'}
            key={specialty.id}
            onClick={() => onSelect(specialty)}
            type="button"
          >
            <strong>{getSpecialtyTranslation(specialty, language)?.name ?? specialty.name}</strong>
            <span>
              {getSpecialtyTranslation(specialty, language)?.description
                ?? specialty.description}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
