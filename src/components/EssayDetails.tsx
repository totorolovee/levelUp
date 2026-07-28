import { getEssayGuidance } from '../lib/essayGuidance';
import type { University } from '../lib/universities';
import { useLanguage } from '../lib/language';

export function EssayDetails({
  university,
  specialty,
}: {
  university: University;
  specialty: string;
}) {
  const { language } = useLanguage();
  const guidance = getEssayGuidance(university, language);

  return (
    <section className="essay-details">
      <h3>{guidance.title}</h3>
      <p className="essay-specialty">
        {language === 'ru' ? 'Специальность' : 'Major'}: {specialty}
      </p>
      <ul>
        {guidance.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <a href={guidance.sourceUrl} rel="noreferrer" target="_blank">
        {language === 'ru' ? 'Проверить официальные требования ↗' : 'Check official requirements ↗'}
      </a>
    </section>
  );
}
