import type { CSSProperties } from 'react';
import { OVERFLOW_FILL, type CoffeeOrder } from '../../lib/coffeeGame';
import { CoffeeOrderIcons } from './CoffeeOrderIcons';

type Props = {
  canStop: boolean;
  disabled: boolean;
  fill: number;
  isPouring: boolean;
  isRussian: boolean;
  onStart: () => void;
  onStop: () => void;
  order: CoffeeOrder;
};

export function CoffeeMachine({
  canStop,
  disabled,
  fill,
  isPouring,
  isRussian,
  onStart,
  onStop,
  order,
}: Props) {
  const cupStyle = { '--coffee-fill': `${Math.min(fill, 100)}%` } as CSSProperties;
  const hasOverflow = fill > OVERFLOW_FILL;

  return (
    <div className="coffee-machine">
      <div className="coffee-machine-top">
        <span className="coffee-brand">FOCUS BREW</span>
        <div className="coffee-controls">
          <button aria-label={isRussian ? 'Начать наливать кофе' : 'Start pouring coffee'}
            className="coffee-control start" disabled={disabled || isPouring}
            onClick={onStart} type="button">
            <i /><span>{isRussian ? 'Старт' : 'Start'}</span>
          </button>
          <button aria-label={isRussian ? 'Остановить или выдать заказ' : 'Stop or serve order'}
            className="coffee-control stop" disabled={!canStop}
            onClick={onStop} type="button">
            <i /><span>{isRussian ? 'Стоп' : 'Stop'}</span>
          </button>
        </div>
      </div>
      <div className="coffee-machine-bay">
        <div className="coffee-machine-order">
          <CoffeeOrderIcons isRussian={isRussian} order={order} />
        </div>
        <div className="coffee-spout"><span /></div>
        <div className={`coffee-stream${isPouring ? ' active' : ''}`} />
        <div className={`coffee-cup${hasOverflow ? ' overflow' : ''}`} style={cupStyle}>
          <div className="coffee-liquid" />
          <div className="coffee-foam" />
        </div>
        <div className="coffee-spill" />
        <div className="coffee-drip-tray" />
      </div>
    </div>
  );
}
