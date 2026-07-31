import { useEffect, useState } from 'react';
import {
  createCoffeeOrders,
  getCoffeePourRate,
  scoreCoffeeOrder,
  type CoffeeIngredient,
  type IngredientCounts,
} from '../../lib/coffeeGame';
import { GameAnswerFeedback } from './GameAnswerFeedback';
import { CoffeeMachine } from './CoffeeMachine';
import type { BrainGameProps } from './types';
import { useAnswerFeedback } from './useAnswerFeedback';

const emptyIngredients = (): IngredientCounts => ({ sugar: 0, syrup: 0 });

export function CoffeeAttentionGame({ difficulty, isRussian, onComplete }: BrainGameProps) {
  const [orders] = useState(() => createCoffeeOrders(difficulty));
  const [round, setRound] = useState(0);
  const [ingredients, setIngredients] = useState<IngredientCounts>(emptyIngredients);
  const [fill, setFill] = useState(0);
  const [isPouring, setIsPouring] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [errorText, setErrorText] = useState('');
  const { feedback, isLocked, showFeedback } = useAnswerFeedback(700, 1500);
  const order = orders[round];

  useEffect(() => {
    if (!isPouring) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = now - previous;
      previous = now;
      let isFull = false;
      setFill((value) => {
        const next = Math.min(100, value + elapsed * getCoffeePourRate(difficulty));
        isFull = next >= 100;
        return next;
      });
      if (!isFull) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [difficulty, isPouring]);

  const ingredientName = (ingredient: CoffeeIngredient) => {
    if (ingredient === 'sugar') return isRussian ? 'сахар' : 'sugar';
    return isRussian ? 'сироп' : 'syrup';
  };

  const addIngredient = (ingredient: CoffeeIngredient) => {
    if (isPouring || isLocked) return;
    setIngredients((current) => ({ ...current, [ingredient]: current[ingredient] + 1 }));
  };

  const nextRound = (score: number) => {
    if (round === orders.length - 1) {
      onComplete(Math.round(score / orders.length));
      return;
    }
    setTotalScore(score);
    setRound((value) => value + 1);
    setIngredients(emptyIngredients());
    setFill(0);
  };

  const stopAndServe = () => {
    if (!isPouring || isLocked) return;
    setIsPouring(false);
    const result = scoreCoffeeOrder(order, ingredients, fill);
    const nextScore = totalScore + result.score;
    setErrorText(isRussian
      ? `Нужно: ${order.amount} × ${ingredientName(order.ingredient)} и ${order.targetFill}% кофе. У тебя ${Math.round(fill)}%.`
      : `Needed: ${order.amount} × ${ingredientName(order.ingredient)} and ${order.targetFill}% coffee. You poured ${Math.round(fill)}%.`);
    showFeedback(result.successful, () => nextRound(nextScore), () => nextRound(nextScore));
  };

  return (
    <section className="brain-game coffee-attention-game">
      <div className="coffee-game-heading">
        <div>
          <p className="eyebrow">{isRussian ? 'Внимание · Кофейная смена' : 'Attention · Coffee shift'}</p>
          <h1>{isRussian ? 'Приготовь заказ' : 'Prepare the order'}</h1>
        </div>
        <strong>{round + 1}/{orders.length}</strong>
      </div>
      <div className="coffee-order-ticket">
        <span>{isRussian ? 'Заказ' : 'Order'} #{round + 1}</span>
        <strong>{order.amount} × {ingredientName(order.ingredient)}</strong>
        <small>{isRussian ? `Налей кофе до отметки ${order.targetFill}%` : `Pour coffee to the ${order.targetFill}% line`}</small>
      </div>
      <div className="coffee-workspace">
        <CoffeeMachine disabled={isLocked} fill={fill} isPouring={isPouring}
          isRussian={isRussian} onStart={() => setIsPouring(true)}
          onStop={stopAndServe} targetFill={order.targetFill} />
        <div className="coffee-ingredients">
          {(['sugar', 'syrup'] as const).map((ingredient) => (
            <button disabled={isPouring || isLocked} key={ingredient}
              onClick={() => addIngredient(ingredient)} type="button">
              <span className={`ingredient-jar ${ingredient}`} aria-hidden="true"><i /></span>
              <strong>{ingredientName(ingredient)}</strong>
              <small>× {ingredients[ingredient]}</small>
            </button>
          ))}
          <button className="coffee-clear" disabled={isPouring || isLocked}
            onClick={() => setIngredients(emptyIngredients())} type="button">
            {isRussian ? 'Очистить стакан' : 'Clear cup'}
          </button>
        </div>
      </div>
      <GameAnswerFeedback errorText={errorText} isRussian={isRussian} status={feedback} />
    </section>
  );
}
