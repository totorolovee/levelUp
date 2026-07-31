import { useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { faceNamePeople } from '../../lib/faceNamePeople';
import type { BrainGameProps } from './types';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import { useAnswerFeedback } from './useAnswerFeedback';

const normalizeName = (value: string) =>
  value.trim().toLocaleLowerCase().replace(/[.,!?'"’\-—\s]/g, '');

function FacePortrait({ index, isRussian }: { index: number; isRussian: boolean }) {
  const person = faceNamePeople[index];
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
  const peopleCount = Math.min(8, 5 + Math.floor((difficulty - 1) / 4));
  const introOrder = useMemo(() => (
    faceNamePeople.map((_, index) => index).sort(() => Math.random() - .5).slice(0, peopleCount)
  ), [peopleCount]);
  const recallOrder = useMemo(() => [...introOrder].sort(() => Math.random() - .5), [introOrder]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [introIndex, setIntroIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<'intro' | 'recall'>('intro');
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const personIndex = phase === 'intro' ? introOrder[introIndex] : recallOrder[round];
  const person = faceNamePeople[personIndex];

  const beginRecall = () => {
    flushSync(() => setPhase('recall'));
    inputRef.current?.focus();
  };

  const submitName = (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || isLocked) return;
    const isCorrect = [person.name.ru, person.name.en]
      .some((name) => normalizeName(answer) === normalizeName(name));
    showFeedback(isCorrect, () => {
      if (round === recallOrder.length - 1) {
        onComplete(adjustScore(100, recallOrder.length));
        return;
      }
      setRound((value) => value + 1);
      setAnswer('');
      inputRef.current?.focus();
    }, () => {
      setAnswer('');
      inputRef.current?.focus();
    });
  };

  return (
    <section className={`brain-game face-name-game face-name-${phase}`}>
      <p className="eyebrow">{isRussian ? 'Память · Лица и имена' : 'Memory · Face–Name Recall'}</p>
      <h1>{phase === 'intro'
        ? (isRussian ? 'Познакомься с персонажами' : 'Meet the people')
        : (isRussian ? 'Вспомни имя' : 'Recall the name')}</h1>
      <p>{phase === 'intro'
        ? `${isRussian ? 'Знакомство' : 'Introduction'} ${introIndex + 1}/${introOrder.length}`
        : `${isRussian ? 'Проверка памяти' : 'Memory check'} ${round + 1}/${recallOrder.length}`}</p>
      <div className="face-name-stage">
        <FacePortrait index={personIndex} isRussian={isRussian} />
        {phase === 'intro' && <strong>{isRussian ? person.name.ru : person.name.en}</strong>}
      </div>
      <div className="face-name-dialogue">
        <span aria-hidden="true">{phase === 'intro' ? '👋' : '💬'}</span>
        <p>{isRussian
          ? (phase === 'intro' ? person.intro.ru : person.recall.ru)
          : (phase === 'intro' ? person.intro.en : person.recall.en)}</p>
      </div>
      {phase === 'intro' && (
        <button
          className="face-name-next"
          onClick={() => introIndex === introOrder.length - 1
            ? beginRecall()
            : setIntroIndex((value) => value + 1)}
          type="button"
        >
          {introIndex === introOrder.length - 1
            ? (isRussian ? 'Начать проверку' : 'Start memory check')
            : (isRussian ? 'Следующее знакомство' : 'Meet the next person')} →
        </button>
      )}
      {phase === 'recall' && <>
        <form className="face-name-recall-form" onSubmit={submitName}>
          <label htmlFor="face-name-answer">{isRussian ? 'Напиши имя' : 'Type the name'}</label>
          <div>
            <input
              aria-invalid={feedback === 'error'}
              autoCapitalize="words"
              autoComplete="off"
              autoFocus
              enterKeyHint={round === recallOrder.length - 1 ? 'done' : 'next'}
              id="face-name-answer"
              inputMode="text"
              name="face-name-answer"
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={isRussian ? 'Имя персонажа…' : "Person's name…"}
              readOnly={isLocked}
              ref={inputRef}
              spellCheck={false}
              value={answer}
            />
            <button disabled={!answer.trim() || isLocked} type="submit">
              {isRussian ? 'Ответить' : 'Answer'}
            </button>
          </div>
        </form>
        <GameAnswerFeedback
          errorText={isRussian ? person.correction.ru : person.correction.en}
          isRussian={isRussian}
          status={feedback}
        />
      </>}
      <small className="face-ai-note">{isRussian ? 'Все портреты вымышлены и созданы AI.' : 'All portraits are fictional and AI-generated.'}</small>
    </section>
  );
}
