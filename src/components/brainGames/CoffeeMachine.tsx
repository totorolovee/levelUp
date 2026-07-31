import type { CSSProperties } from 'react';

type Props = {
  disabled: boolean;
  fill: number;
  isPouring: boolean;
  isRussian: boolean;
  onStart: () => void;
  onStop: () => void;
  targetFill: number;
};

export function CoffeeMachine({
  disabled,
  fill,
  isPouring,
  isRussian,
  onStart,
  onStop,
  targetFill,
}: Props) {
  const cupStyle = {
    '--coffee-fill': `${fill}%`,
    '--target-fill': `${targetFill}%`,
  } as CSSProperties;

  return (
    <div className="coffee-machine">
      <div className="coffee-machine-top">
        <span className="coffee-brand">FOCUS BREW</span>
        <div className="coffee-controls">
          <button
            aria-label={isRussian ? 'Начать наливать кофе' : 'Start pouring coffee'}
            className="coffee-control start"
            disabled={disabled || isPouring}
            onClick={onStart}
            type="button"
          >
            <i />
            <span>{isRussian ? 'Старт' : 'Start'}</span>
          </button>
          <button
            aria-label={isRussian ? 'Остановить и выдать заказ' : 'Stop and serve order'}
            className="coffee-control stop"
            disabled={disabled || !isPouring}
            onClick={onStop}
            type="button"
          >
            <i />
            <span>{isRussian ? 'Стоп' : 'Stop'}</span>
          </button>
        </div>
      </div>
      <div className="coffee-machine-bay">
        <div className="coffee-spout"><span /></div>
        <div className={`coffee-stream${isPouring ? ' active' : ''}`} />
        <div className="coffee-cup" style={cupStyle}>
          <div className="coffee-liquid" />
          <div className="coffee-target-line" />
          <span>{Math.round(fill)}%</span>
        </div>
        <div className="coffee-drip-tray" />
      </div>
    </div>
  );
}
