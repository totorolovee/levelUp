import type { CSSProperties } from 'react';
import { OVERFLOW_FILL, type CoffeeCupState, type CoffeeIngredient } from '../../lib/coffeeGame';

type Props = {
  cup: CoffeeCupState;
  isPouring: boolean;
  isRussian: boolean;
  onAdd: (ingredient: CoffeeIngredient) => void;
  onDiscard: () => void;
  onToggle: () => void;
};

export function CoffeeMachine({ cup, isPouring, isRussian, onAdd, onDiscard, onToggle }: Props) {
  const style = { '--coffee-fill': `${Math.min(cup.fill, 100)}%` } as CSSProperties;
  const overflow = cup.fill > OVERFLOW_FILL;
  const pieces = [
    ...Array.from({ length: cup.ingredients.sugar }, () => 'sugar' as const),
    ...Array.from({ length: cup.ingredients.chocolate }, () => 'chocolate' as const),
  ];

  return (
    <article className={`coffee-station${overflow ? ' overflow' : ''}`}>
      <header>
        <strong>{isRussian ? 'Машина' : 'Machine'} {cup.id}</strong>
        <button className={`coffee-machine-action${isPouring ? ' pouring' : ''}`}
          onClick={onToggle} type="button">
          <span aria-hidden="true">{isPouring ? '✓' : '💧'}</span>
          {isPouring ? (isRussian ? 'Отдать' : 'Serve') : (isRussian ? 'Налить' : 'Pour')}
        </button>
      </header>
      <div className="coffee-machine-body">
        <div className="coffee-station-spout" />
        <div className={`coffee-stream${isPouring ? ' active' : ''}`} />
        <button className="coffee-station-trash" disabled={isPouring}
          aria-label={isRussian ? 'Выбросить стакан' : 'Discard cup'}
          onClick={onDiscard} type="button">♲</button>
        <div className="coffee-cup" style={style}>
          <div className="coffee-liquid" />
          <div className="coffee-cup-pieces">
            {pieces.map((piece, index) => <i className={piece} key={`${piece}-${index}`} />)}
          </div>
        </div>
        <div className="coffee-spill" />
      </div>
      <div className="coffee-station-ingredients">
        {(['sugar', 'chocolate'] as const).map((ingredient) => (
          <button disabled={isPouring} key={ingredient} onClick={() => onAdd(ingredient)} type="button">
            <i className={ingredient} aria-hidden="true" />
            {ingredient === 'sugar'
              ? (isRussian ? 'Сахар' : 'Sugar')
              : (isRussian ? 'Шоколад' : 'Chocolate')}
          </button>
        ))}
      </div>
    </article>
  );
}
