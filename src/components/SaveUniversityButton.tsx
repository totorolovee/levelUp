import { useEffect, useState } from 'react';
import { useLanguage } from '../lib/language';
import {
  loadSavedUniversities,
  removeSavedUniversity,
  saveUniversity,
  type SavedUniversity,
} from '../lib/savedUniversities';
import type { UniversitySpecialty } from '../lib/universitySpecialties';

type Props = {
  universityId: string;
  specialty: UniversitySpecialty;
};

export function SaveUniversityButton({ universityId, specialty }: Props) {
  const { language } = useLanguage();
  const [saved, setSaved] = useState<SavedUniversity[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const isRussian = language === 'ru';
  const isSelected = saved.some((item) => item.universityId === universityId);

  useEffect(() => {
    loadSavedUniversities().then(setSaved).catch(() => setError(
      isRussian ? 'Не удалось загрузить список вузов.' : 'Could not load your university list.',
    ));
  }, [isRussian]);

  const toggle = async () => {
    setIsSaving(true);
    setError('');
    try {
      if (isSelected) {
        await removeSavedUniversity(universityId);
        setSaved((current) => current.filter((item) => item.universityId !== universityId));
      } else {
        if (saved.length >= 5) {
          setError(isRussian ? 'Можно сохранить максимум 5 вузов.' : 'You can save up to 5 universities.');
          return;
        }
        await saveUniversity(universityId, specialty.id);
        setSaved((current) => [...current, { universityId, specialtyId: specialty.id }]);
      }
    } catch {
      setError(isRussian ? 'Не удалось изменить список.' : 'Could not update your list.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="save-university">
      <button disabled={isSaving} onClick={toggle} type="button">
        {isSelected
          ? (isRussian ? 'Убрать из профиля' : 'Remove from profile')
          : (isRussian ? `Добавить в профиль · ${saved.length}/5` : `Add to profile · ${saved.length}/5`)}
      </button>
      {error && <small>{error}</small>}
    </div>
  );
}
