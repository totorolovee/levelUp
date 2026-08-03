import type { CSSProperties } from 'react';
import { OVERFLOW_FILL, type CoffeeCupState } from '../../lib/coffeeGame';

type Props = {
  cup: CoffeeCupState;
  isPouring: boolean;
  isRussian: boolean;
  onDiscard: () => void;
  onSelect: () => void;
  onToggle: () => void;
  selected: boolean;
};

export function CoffeeMachine({
  cup, isPouring, isRussian, onDiscard, onSelect, onToggle, selected,
}: Props) {
  const style = { '--coffee-fill': `${Math.min(cup.fill, 100)}%` } as CSSProperties;
  const overflow = cup.fill > OVERFLOW_FILL;
  const pieces = [
    ...Array.from({ length: cup.ingredients.sugar }, () => 'sugar' as const),
    ...Array.from({ length: cup.ingredients.chocolate }, () => 'chocolate' as const),
  ];

  return (
    <article className={`coffee-station${overflow ? ' overflow' : ''}${selected ? ' selected' : ''}`}
      onClick={onSelect}>
      <header>
        <strong>{isRussian ? 'Машина' : 'Machine'} {cup.id}</strong>
        <button className={`coffee-machine-action${isPouring ? ' pouring' : ''}`}
          onClick={(event) => { event.stopPropagation(); onToggle(); }} type="button">
          <span aria-hidden="true">{isPouring ? '✓' : '💧'}</span>
          {isPouring ? (isRussian ? 'Отдать' : 'Serve') : (isRussian ? 'Налить' : 'Pour')}
        </button>
      </header>
      <div className="coffee-machine-body">
        <div className="coffee-station-spout" />
        <div className={`coffee-stream${isPouring ? ' active' : ''}`} />
        <button className="coffee-station-trash" disabled={isPouring}
          aria-label={isRussian ? 'Выбросить стакан' : 'Discard cup'}
          onClick={(event) => { event.stopPropagation(); onDiscard(); }} type="button">♲</button>
        <div className="coffee-cup" style={style}>
          <div className="coffee-liquid" />
          <div className="coffee-cup-pieces">
            {pieces.map((piece, index) => <i className={piece} key={`${piece}-${index}`} />)}
          </div>
        </div>
        <div className="coffee-spill" />
      </div>
    </article>
  );
}
