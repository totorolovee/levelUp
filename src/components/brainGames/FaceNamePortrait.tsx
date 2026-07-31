import type { CSSProperties } from 'react';
import type { FaceNameProfile } from '../../lib/faceNamePeople';

type Props = {
  isRussian: boolean;
  person: FaceNameProfile;
};

export function FaceNamePortrait({ isRussian, person }: Props) {
  const columns = person.sprite === 'base' ? 4 : 3;
  const style = {
    backgroundPosition: `${person.column * (100 / (columns - 1))}% ${person.row * 100}%`,
  } satisfies CSSProperties;

  return (
    <div
      aria-label={isRussian ? 'Вымышленный портрет, созданный AI' : 'AI-generated fictional portrait'}
      className={`face-name-portrait ${person.sprite}`}
      role="img"
      style={style}
    />
  );
}
