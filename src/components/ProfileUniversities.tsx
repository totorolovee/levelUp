import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/language';
import { loadSavedUniversities, removeSavedUniversity, type SavedUniversity } from '../lib/savedUniversities';
import { universities } from '../lib/universities';
import { getSpecialtyTranslation, getUniversityContent } from '../lib/universityTranslations';
import { universitySpecialties } from '../lib/universitySpecialties';
import { UniversityDetails } from './UniversityDetails';

export function ProfileUniversities() {
  const { language } = useLanguage();
  const [saved, setSaved] = useState<SavedUniversity[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const isRussian = language === 'ru';

  useEffect(() => {
    loadSavedUniversities().then(setSaved).catch(() => setSaved([]));
  }, []);

  const remove = async (universityId: string) => {
    await removeSavedUniversity(universityId);
    setSaved((current) => current.filter((item) => item.universityId !== universityId));
  };

  return (
    <section className="profile-universities">
      <header>
        <div>
          <p className="eyebrow">{isRussian ? 'Мой список' : 'My shortlist'}</p>
          <h2>{isRussian ? 'Выбранные университеты' : 'Saved universities'}</h2>
        </div>
        <strong>{saved.length}/5</strong>
      </header>
      {!saved.length && (
        <p>{isRussian ? 'Добавь до пяти вузов в навигаторе поступления.' : 'Add up to five universities in the admissions navigator.'}</p>
      )}
      {saved.map((item) => {
        const university = universities.find(({ id }) => id === item.universityId);
        if (!university) return null;
        const content = getUniversityContent(university, language);
        const specialty = universitySpecialties.find(({ id }) => id === item.specialtyId);
        const specialtyName = specialty
          ? getSpecialtyTranslation(specialty, language)?.name ?? specialty.name
          : item.specialtyId;
        const isExpanded = expandedId === university.id;
        return (
          <article className="saved-university-card" key={university.id}>
            <div>
              <span>{content.location}</span>
              <h3>{content.name}</h3>
              <small>{specialtyName}</small>
            </div>
            <button onClick={() => setExpandedId(isExpanded ? null : university.id)} type="button">
              {isExpanded
                ? (isRussian ? 'Скрыть требования' : 'Hide requirements')
                : (isRussian ? 'Все требования' : 'Full requirements')}
            </button>
            <button className="remove-saved-university" onClick={() => remove(university.id)} type="button">
              {isRussian ? 'Удалить' : 'Remove'}
            </button>
            {isExpanded && <UniversityDetails specialty={specialtyName} university={university} />}
          </article>
        );
      })}
    </section>
  );
}
