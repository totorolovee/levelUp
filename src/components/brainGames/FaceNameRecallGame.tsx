import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { BrainGameProps } from './types';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import { useAnswerFeedback } from './useAnswerFeedback';

const people = [
  { ru: 'Алекс', en: 'Alex', column: 0, row: 0 },
  { ru: 'Майя', en: 'Maya', column: 1, row: 0 },
  { ru: 'Дэниел', en: 'Daniel', column: 2, row: 0 },
  { ru: 'София', en: 'Sofia', column: 3, row: 0 },
  { ru: 'Лео', en: 'Leo', column: 0, row: 1 },
  { ru: 'Амина', en: 'Amina', column: 1, row: 1 },
  { ru: 'Ноа', en: 'Noah', column: 2, row: 1 },
  { ru: 'Зои', en: 'Zoe', column: 3, row: 1 },
];

function FacePortrait({ index, isRussian }: { index: number; isRussian: boolean }) {
  const person = people[index];
  const style = {
    backgroundPosition: `${person.column * (100 / 3)}% ${person.row * 100}%`,
  } satisfies CSSProperties;
  return (
    <div
      aria-label={isRussian ? 'Вымышленный портрет, созданный AI' : 'AI-generated fictional portrait'}
      className="face-name-portrait"
      role="img"
      style={style}
    />
  );
}

export function FaceNameRecallGame({ difficulty, isRussian, onComplete }: BrainGameProps) {
  const order = useMemo(() => people.map((_, index) => index).sort(() => Math.random() - .5), []);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'study' | 'recall'>('study');
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const personIndex = order[round];
  const person = people[personIndex];
  const options = useMemo(() => {
    const alternatives = people.map((_, index) => index)
      .filter((index) => index !== personIndex)
      .sort(() => Math.random() - .5)
      .slice(0, 3);
    return [personIndex, ...alternatives].sort(() => Math.random() - .5);
  }, [personIndex]);

  useEffect(() => {
    setPhase('study');
    const duration = Math.max(1400, 2600 - difficulty * 55);
    const timer = window.setTimeout(() => setPhase('recall'), duration);
    return () => window.clearTimeout(timer);
  }, [difficulty, round]);

  const choose = (index: number) => {
    const isCorrect = index === personIndex;
    showFeedback(isCorrect, () => {
      if (round === order.length - 1) {
        onComplete(adjustScore(100, order.length));
        return;
      }
      setRound((value) => value + 1);
    });
  };

  return (
    <section className="brain-game face-name-game">
      <p className="eyebrow">{isRussian ? 'Память · Лица и имена' : 'Memory · Face–Name Recall'}</p>
      <h1>{phase === 'study'
        ? (isRussian ? 'Познакомься и запомни имя' : 'Meet this person and remember the name')
        : (isRussian ? 'Как зовут этого человека?' : "What is this person's name?")}</h1>
      <p>{isRussian ? 'Знакомство' : 'Introduction'} {round + 1}/{order.length}</p>
      <div className="face-name-stage">
        <FacePortrait index={personIndex} isRussian={isRussian} />
        {phase === 'study' && <strong>{isRussian ? person.ru : person.en}</strong>}
      </div>
      {phase === 'recall' && (
        <div className="face-name-options">
          {options.map((index) => (
            <button disabled={isLocked} key={index} onClick={() => choose(index)} type="button">
              {isRussian ? people[index].ru : people[index].en}
            </button>
          ))}
        </div>
      )}
      {phase === 'recall' && <GameAnswerFeedback
        errorText={`${isRussian ? 'Правильное имя' : 'Correct name'}: ${isRussian ? person.ru : person.en}`}
        isRussian={isRussian}
        status={feedback}
      />}
      <small className="face-ai-note">{isRussian ? 'Все портреты вымышлены и созданы AI.' : 'All portraits are fictional and AI-generated.'}</small>
    </section>
  );
}
