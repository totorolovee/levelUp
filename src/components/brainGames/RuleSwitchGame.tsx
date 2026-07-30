import { useMemo, useState } from 'react';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

const colors = ['red', 'blue'] as const;

export function RuleSwitchGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 14 }, (_, index) => ({
    rule: index % 3 === 2 ? 'word' : 'color',
    word: colors[Math.floor(Math.random() * 2)],
    ink: colors[Math.floor(Math.random() * 2)],
  })), []);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { adjustScore, feedback, isLocked, showFeedback } = useAnswerFeedback();
  const current = rounds[round];

  const answer = (choice: 'red' | 'blue') => {
    const expected = current.rule === 'word' ? current.word : current.ink;
    const isCorrect = choice === expected;
    const nextCorrect = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (round === rounds.length - 1) {
        onComplete(adjustScore(Math.round(nextCorrect / rounds.length * 100), rounds.length));
        return;
      }
      setCorrect(nextCorrect);
      setRound((value) => value + 1);
    });
  };

  return (
    <section className="brain-game">
      <p className="eyebrow">{isRussian ? 'Внимание · Смена правил' : 'Attention · Rule switch'}</p>
      <h1>{current.rule === 'word'
        ? (isRussian ? 'Выбери значение слова' : 'Choose the word meaning')
        : (isRussian ? 'Выбери цвет текста' : 'Choose the ink color')}</h1>
      <p>{isRussian ? 'Уровень' : 'Level'} {round + 1}/{rounds.length}</p>
      <div className={`rule-word ${current.ink}`}>{current.word === 'red' ? (isRussian ? 'КРАСНЫЙ' : 'RED') : (isRussian ? 'СИНИЙ' : 'BLUE')}</div>
      <div className="game-choice-row">
        <button disabled={isLocked} onClick={() => answer('red')} type="button">{isRussian ? 'Красный' : 'Red'}</button>
        <button disabled={isLocked} onClick={() => answer('blue')} type="button">{isRussian ? 'Синий' : 'Blue'}</button>
      </div>
      <GameAnswerFeedback
        errorText={`${isRussian ? 'Правильный ответ' : 'Correct answer'}: ${
          expectedLabel(current.rule === 'word' ? current.word : current.ink, isRussian)}`}
        isRussian={isRussian}
        status={feedback}
      />
    </section>
  );
}

function expectedLabel(color: 'red' | 'blue', isRussian: boolean) {
  if (color === 'red') return isRussian ? 'красный' : 'red';
  return isRussian ? 'синий' : 'blue';
}
