import { useMemo, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import {
  faceNameNames,
  faceNameProfiles,
  type FaceNameProfile,
  type LocalizedText,
} from '../../lib/faceNamePeople';
import { FaceNamePortrait } from './FaceNamePortrait';
import type { BrainGameProps } from './types';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import { useAnswerFeedback } from './useAnswerFeedback';

const normalizeName = (value: string) =>
  value.trim().toLocaleLowerCase().replace(/[.,!?'"’\-—\s]/g, '');

function shuffled<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

type SessionPerson = FaceNameProfile & { name: LocalizedText };

export function FaceNameRecallGame({ difficulty, isRussian, onComplete }: BrainGameProps) {
  const peopleCount = Math.min(faceNameProfiles.length, Math.max(5, difficulty + 4));
  const sessionPeople = useMemo<SessionPerson[]>(() => {
    const names = shuffled(faceNameNames);
    return shuffled(faceNameProfiles).slice(0, peopleCount)
      .map((profile, index) => ({ ...profile, name: names[index] }));
  }, [peopleCount]);
  const recallOrder = useMemo(
    () => shuffled(sessionPeople.map((_, index) => index)),
    [sessionPeople],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [introIndex, setIntroIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [phase, setPhase] = useState<'intro' | 'recall'>('intro');
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback(1000, 2500);
  const person = sessionPeople[phase === 'intro' ? introIndex : recallOrder[round]];

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
      <div className="face-name-level-rule">
        <strong>{isRussian ? 'Уровень' : 'Level'} {difficulty} · {peopleCount} {isRussian ? 'лиц' : 'faces'}</strong>
        <span>{isRussian
          ? 'Следующий уровень откроется, только если вспомнишь все имена без ошибок.'
          : 'Recall every name without a mistake to unlock the next level.'}</span>
      </div>
      <p>{phase === 'intro'
        ? `${isRussian ? 'Знакомство' : 'Introduction'} ${introIndex + 1}/${sessionPeople.length}`
        : `${isRussian ? 'Проверка памяти' : 'Memory check'} ${round + 1}/${recallOrder.length}`}</p>
      <div className="face-name-stage">
        <FaceNamePortrait person={person} isRussian={isRussian} />
      </div>
      <div className="face-name-dialogue">
        <span aria-hidden="true">{phase === 'intro' ? '👋' : '💬'}</span>
        <p>{phase === 'intro'
          ? (isRussian
            ? `Привет! Меня зовут ${person.name.ru}. ${person.intro.ru}`
            : `Hi! My name is ${person.name.en}. ${person.intro.en}`)
          : (isRussian ? person.recall.ru : person.recall.en)}</p>
      </div>
      {phase === 'intro' && (
        <button
          className="face-name-next"
          onClick={() => introIndex === sessionPeople.length - 1
            ? beginRecall()
            : setIntroIndex((value) => value + 1)}
          type="button"
        >
          {introIndex === sessionPeople.length - 1
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
          errorText={isRussian
            ? `Я ${person.name.ru} — ${person.role.ru}.`
            : `I am ${person.name.en} — ${person.role.en}.`}
          isRussian={isRussian}
          status={feedback}
        />
      </>}
      <small className="face-ai-note">{isRussian ? 'Все портреты вымышлены и созданы AI.' : 'All portraits are fictional and AI-generated.'}</small>
    </section>
  );
}
