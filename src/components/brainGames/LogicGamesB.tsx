import { useMemo, useState } from 'react';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

export function PathPlannerGame({ isRussian, onComplete }: BrainGameProps) {
  const targets = useMemo(() => Array.from({ length: 10 }, (_, level) => ({
    x: 1 + Math.floor(Math.random() * Math.min(4, 2 + Math.floor(level / 3))),
    y: 1 + Math.floor(Math.random() * Math.min(4, 2 + Math.floor(level / 3))),
  })), []);
  const [level, setLevel] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [moves, setMoves] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const target = targets[level];
  const move = (dx: number, dy: number) => {
    const next = { x: Math.max(0, Math.min(4, position.x + dx)), y: Math.max(0, Math.min(4, position.y + dy)) };
    const nextMoves = moves + 1;
    if (next.x === position.x && next.y === position.y) {
      if (showFeedback(false, () => undefined)) setMoves(nextMoves);
      return;
    }
    if (next.x === target.x && next.y === target.y) {
      const ideal = target.x + target.y;
      const nextEfficiency = efficiency + Math.min(1, ideal / nextMoves);
      showFeedback(true, () => {
        if (level === targets.length - 1) onComplete(Math.round(nextEfficiency / targets.length * 100));
        else { setEfficiency(nextEfficiency); setLevel((item) => item + 1); setPosition({ x: 0, y: 0 }); setMoves(0); }
      });
    } else { setPosition(next); setMoves(nextMoves); }
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Логика · Маршрут' : 'Logic · Path planner'}</p>
    <h1>{isRussian ? 'Дойди до цели кратчайшим путём' : 'Reach the goal by the shortest path'}</h1>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{targets.length}</p>
    <div className="path-grid">{Array.from({ length: 25 }, (_, index) => {
      const x = index % 5; const y = Math.floor(index / 5);
      return <span className={x === position.x && y === position.y ? 'player' : x === target.x && y === target.y ? 'target' : ''} key={index} />;
    })}</div>
    <div className="direction-pad">
      <button disabled={isLocked} onClick={() => move(0, -1)} type="button">↑</button><button disabled={isLocked} onClick={() => move(1, 0)} type="button">→</button>
      <button disabled={isLocked} onClick={() => move(0, 1)} type="button">↓</button><button disabled={isLocked} onClick={() => move(-1, 0)} type="button">←</button>
    </div>
    <GameAnswerFeedback errorText={isRussian ? 'В этом направлении поле закончилось.' : 'The board ends in that direction.'} isRussian={isRussian} status={feedback} />
  </section>;
}

export function RotationGame({ isRussian, onComplete }: BrainGameProps) {
  const rounds = useMemo(() => Array.from({ length: 14 }, () => Math.floor(Math.random() * 4)), []);
  const [level, setLevel] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { feedback, isLocked, showFeedback } = useAnswerFeedback();
  const choose = (rotation: number) => {
    const isCorrect = rotation === rounds[level];
    const next = correct + Number(isCorrect);
    showFeedback(isCorrect, () => {
      if (level === rounds.length - 1) onComplete(Math.round(next / rounds.length * 100));
      else { setCorrect(next); setLevel((item) => item + 1); }
    });
  };
  return <section className="brain-game">
    <p className="eyebrow">{isRussian ? 'Логика · Вращение' : 'Logic · Rotation'}</p>
    <h1>{isRussian ? 'Выбери такое же направление' : 'Choose the matching direction'}</h1>
    <div className="rotation-shape" style={{ transform: `rotate(${rounds[level] * 90}deg)` }}>➤</div>
    <p>{isRussian ? 'Уровень' : 'Level'} {level + 1}/{rounds.length}</p>
    <div className="game-choice-row rotation-options">{['→', '↓', '←', '↑'].map((arrow, index) => <button disabled={isLocked} key={arrow} onClick={() => choose(index)} type="button">{arrow}</button>)}</div>
    <GameAnswerFeedback errorText={`${isRussian ? 'Правильное направление' : 'Correct direction'}: ${['→', '↓', '←', '↑'][rounds[level]]}`} isRussian={isRussian} status={feedback} />
  </section>;
}
