import { MIN_READY_FILL, OVERFLOW_FILL } from '../../lib/coffeeGame';
import { CoffeeCupQueue } from './CoffeeCupQueue';
import { CoffeeIngredientShelf } from './CoffeeIngredientShelf';
import { CoffeeMachine } from './CoffeeMachine';
import { GameAnswerFeedback, type AnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { type CoffeeNotice, useCoffeeShift } from './useCoffeeShift';

function noticeText(notice: CoffeeNotice, isRussian: boolean) {
  const messages = {
    early: isRussian
      ? 'Стакан ещё не полный. Нажми красную кнопку и продолжай.'
      : 'The cup is not full yet. Press red and continue pouring.',
    overflow: isRussian
      ? 'Кофе перелился. Останови аппарат и выброси стакан в корзину слева.'
      : 'The coffee overflowed. Stop the machine and throw the cup in the bin.',
    wrong: isRussian
      ? 'Ингредиенты не совпадают со значками. Испорченный стакан можно выбросить.'
      : 'The ingredients do not match the icons. Discard the incorrect cup.',
    served: '',
  };
  return notice ? messages[notice] : '';
}

export function CoffeeAttentionGame({ isRussian, onComplete }: BrainGameProps) {
  const shift = useCoffeeShift(onComplete);
  const cup = shift.selectedCup;
  const feedback: AnswerFeedback = shift.notice === 'served'
    ? 'correct'
    : shift.notice ? 'error' : null;
  const minutes = Math.floor(shift.secondsLeft / 60);
  const time = `${minutes}:${String(shift.secondsLeft % 60).padStart(2, '0')}`;
  const isOverflow = cup.fill > OVERFLOW_FILL;
  const canStop = shift.isPouring || cup.fill >= MIN_READY_FILL;

  return (
    <section className="brain-game coffee-attention-game">
      <div className="coffee-game-heading">
        <div>
          <p className="eyebrow">{isRussian ? 'Внимание · Кофейная смена' : 'Attention · Coffee shift'}</p>
          <h1>{isRussian ? 'Успей за минуту' : 'One-minute rush'}</h1>
        </div>
        <div className="coffee-shift-stats">
          <strong>◷ {time}</strong>
          <span>✓ {shift.served}</span>
        </div>
      </div>
      <div className="coffee-workspace">
        <button className={`coffee-trash${isOverflow ? ' needed' : ''}`}
          disabled={shift.isPouring} onClick={shift.discard} type="button">
          <span aria-hidden="true">♲</span>
          <strong>{isRussian ? 'Корзина' : 'Bin'}</strong>
          <small>{isRussian ? 'Выбросить стакан' : 'Discard cup'}</small>
        </button>
        <CoffeeMachine canStop={canStop} disabled={isOverflow}
          fill={cup.fill} isPouring={shift.isPouring} isRussian={isRussian}
          onStart={shift.startPouring} onStop={shift.stopAndServe} order={cup.order} />
        <CoffeeIngredientShelf disabled={shift.isPouring}
          ingredients={cup.ingredients} isRussian={isRussian} onAdd={shift.addIngredient} />
        <CoffeeCupQueue cups={shift.cups} disabled={shift.isPouring}
          isRussian={isRussian} onSelect={shift.selectCup} selectedId={shift.selectedId} />
      </div>
      <GameAnswerFeedback errorText={noticeText(shift.notice, isRussian)}
        isRussian={isRussian} status={feedback} />
    </section>
  );
}
