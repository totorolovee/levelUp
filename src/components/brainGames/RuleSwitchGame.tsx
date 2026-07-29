import { useMemo, useState } from 'react';
import type { BrainGameProps } from './types';

const colors = ['red', 'blue'] as const;

export function RuleSwitchGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 14 }, (_, index) => ({
    rule: index % 3 === 2 ? 'word' : 'color',
    word: colors[Math.floor(Math.random() * 2)],
    ink: colors[Math.floor(Math.random() * 2)],
  })), []);
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const current = rounds[round];

  const answer = (choice: 'red' | 'blue') => {
    const expected = current.rule === 'word' ? current.word : current.ink;
    const nextCorrect = correct + Number(choice === expected);
    if (round === rounds.length - 1) onComplete(Math.round(nextCorrect / rounds.length * 100));
    else {
      setCorrect(nextCorrect);
      setRound((value) => value + 1);
    }
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
        <button onClick={() => answer('red')} type="button">{isRussian ? 'Красный' : 'Red'}</button>
        <button onClick={() => answer('blue')} type="button">{isRussian ? 'Синий' : 'Blue'}</button>
      </div>
    </section>
  );
}
