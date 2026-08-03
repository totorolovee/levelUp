import { useState } from 'react';
import { CoffeeMachine } from './CoffeeMachine';
import { CoffeeIngredientPanel } from './CoffeeIngredientPanel';
import { CoffeeOrdersPage } from './CoffeeOrdersPage';
import { GameAnswerFeedback, type AnswerFeedback } from './GameAnswerFeedback';
import type { BrainGameProps } from './types';
import { type CoffeeNotice, useCoffeeShift } from './useCoffeeShift';

type CoffeeView = 'machines' | 'orders';

function noticeText(notice: CoffeeNotice, isRussian: boolean) {
  if (!notice) return '';
  const machine = isRussian ? `Машина ${notice.machineId}: ` : `Machine ${notice.machineId}: `;
  const messages = {
    early: isRussian ? 'стакан сдан слишком рано — очки не начислены.' : 'the cup was served too early — no points awarded.',
    overflow: isRussian ? 'кофе перелился — выброси стакан.' : 'the coffee overflowed — discard the cup.',
    wrong: isRussian ? 'рецепт неверный — стакан очищен без очков.' : 'the recipe was wrong — the cup was cleared with no points.',
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
        <div className="coffee-shift-stats">
          <strong>◷ {time}</strong><span>★ {shift.points}</span>
          {shift.notice?.type === 'served' && <em>+1000</em>}
        </div>
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
        : <div className="coffee-machine-console">
            <div className="coffee-machine-grid">
              {shift.cups.map((cup) => (
                <CoffeeMachine cup={cup} isPouring={shift.pouringIds.includes(cup.id)}
                  isRussian={isRussian} key={cup.id}
                  onDiscard={() => shift.discard(cup.id)}
                  onSelect={() => shift.selectMachine(cup.id)}
                  onToggle={() => shift.toggleMachine(cup.id)}
                  selected={shift.selectedId === cup.id} />
              ))}
            </div>
            <CoffeeIngredientPanel
              disabled={shift.pouringIds.includes(shift.selectedId)}
              isRussian={isRussian} onAdd={shift.addIngredient}
              selectedId={shift.selectedId} />
          </div>}
      <GameAnswerFeedback errorText={noticeText(shift.notice, isRussian)}
        isRussian={isRussian} status={feedback} />
    </section>
  );
}
