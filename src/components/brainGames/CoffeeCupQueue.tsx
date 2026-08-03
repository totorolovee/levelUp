import type { CSSProperties } from 'react';
import { OVERFLOW_FILL, type CoffeeCupState } from '../../lib/coffeeGame';
import { CoffeeOrderIcons } from './CoffeeOrderIcons';

type Props = {
  cups: CoffeeCupState[];
  disabled: boolean;
  isRussian: boolean;
  onSelect: (id: number) => void;
  selectedId: number;
};

export function CoffeeCupQueue({ cups, disabled, isRussian, onSelect, selectedId }: Props) {
  return (
    <div className="coffee-cup-queue">
      {cups.map((cup) => {
        const style = { '--mini-fill': `${Math.min(cup.fill, 100)}%` } as CSSProperties;
        return (
          <button className={`${cup.id === selectedId ? 'selected ' : ''}${cup.fill > OVERFLOW_FILL ? 'overflow' : ''}`}
            disabled={disabled} key={cup.id} onClick={() => onSelect(cup.id)} type="button">
            <span className="coffee-cup-number">{isRussian ? 'Стакан' : 'Cup'} {cup.id}</span>
            <CoffeeOrderIcons isRussian={isRussian} order={cup.order} />
            <span className="coffee-mini-cup" style={style}><i /></span>
          </button>
        );
      })}
    </div>
  );
}
