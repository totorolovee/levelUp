import { getEssayGuidance } from '../lib/essayGuidance';
import type { University } from '../lib/universities';

export function EssayDetails({
  university,
  specialty,
}: {
  university: University;
  specialty: string;
}) {
  const guidance = getEssayGuidance(university);

  return (
    <section className="essay-details">
      <h3>{guidance.title}</h3>
      <p className="essay-specialty">Специальность: {specialty}</p>
      <ul>
        {guidance.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <a href={guidance.sourceUrl} rel="noreferrer" target="_blank">
        Проверить официальные требования ↗
      </a>
    </section>
  );
}
