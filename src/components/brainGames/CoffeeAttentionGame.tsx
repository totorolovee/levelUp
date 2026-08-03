import { useState } from 'react';
import { CoffeeMachine } from './CoffeeMachine';
import { CoffeeOrdersPage } from './CoffeeOrdersPage';
import { GameAnswerFeedback, type AnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { type CoffeeNotice, useCoffeeShift } from './useCoffeeShift';

type CoffeeView = 'machines' | 'orders';

function noticeText(notice: CoffeeNotice, isRussian: boolean) {
  if (!notice) return '';
  const machine = isRussian ? `Машина ${notice.machineId}: ` : `Machine ${notice.machineId}: `;
  const messages = {
    early: isRussian ? 'стакан ещё не полный — продолжай наливать.' : 'the cup is not full yet — keep pouring.',
    overflow: isRussian ? 'кофе перелился — выброси стакан.' : 'the coffee overflowed — discard the cup.',
    wrong: isRussian ? 'рецепт неверный — проверь страницу заказов.' : 'the recipe is wrong — check the orders page.',
    served: '',
  };
  return machine + messages[notice.type];
}

export function CoffeeAttentionGame({ isRussian, onComplete }: BrainGameProps) {
  const [view, setView] = useState<CoffeeView>('orders');
  const shift = useCoffeeShift(onComplete);
  const feedback: AnswerFeedback = shift.notice?.type === 'served'
    ? 'correct' : shift.notice ? 'error' : null;
  const minutes = Math.floor(shift.secondsLeft / 60);
  const time = `${minutes}:${String(shift.secondsLeft % 60).padStart(2, '0')}`;
  const openMachines = () => { shift.startShift(); setView('machines'); };

  return (
    <section className="brain-game coffee-attention-game">
      <div className="coffee-game-heading">
        <div>
          <p className="eyebrow">{isRussian ? 'Внимание · Кофейная смена' : 'Attention · Coffee shift'}</p>
          <h1>{isRussian ? 'Четыре кофемашины' : 'Four coffee machines'}</h1>
        </div>
        <div className="coffee-shift-stats"><strong>◷ {time}</strong><span>✓ {shift.served}</span></div>
      </div>
      <div className="coffee-page-tabs" aria-label={isRussian ? 'Страницы игры' : 'Game pages'} role="tablist">
        <button className={view === 'orders' ? 'active' : ''}
          onClick={() => setView('orders')} type="button">1 · {isRussian ? 'Заказы' : 'Orders'}</button>
        <button className={view === 'machines' ? 'active' : ''}
          onClick={openMachines} type="button">2 · {isRussian ? 'Кофемашины' : 'Machines'}</button>
      </div>
      {view === 'orders'
        ? <CoffeeOrdersPage cups={shift.cups} isRussian={isRussian}
            onOpenMachines={openMachines} started={shift.started} />
        : <div className="coffee-machine-grid">
            {shift.cups.map((cup) => (
              <CoffeeMachine cup={cup} isPouring={shift.pouringIds.includes(cup.id)}
                isRussian={isRussian} key={cup.id}
                onAdd={(ingredient) => shift.addIngredient(cup.id, ingredient)}
                onDiscard={() => shift.discard(cup.id)}
                onToggle={() => shift.toggleMachine(cup.id)} />
            ))}
          </div>}
      <GameAnswerFeedback errorText={noticeText(shift.notice, isRussian)}
        isRussian={isRussian} status={feedback} />
    </section>
  );
}
