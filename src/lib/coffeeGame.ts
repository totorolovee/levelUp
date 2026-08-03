export type CoffeeIngredient = 'sugar' | 'syrup';

export type IngredientCounts = Record<CoffeeIngredient, number>;

export type CoffeeOrder = {
  amount: number;
  ingredient: CoffeeIngredient;
};

export type CoffeeCupState = {
  fill: number;
  id: number;
  ingredients: IngredientCounts;
  order: CoffeeOrder;
};

export const SHIFT_SECONDS = 60;
export const MAX_CUPS = 4;
export const OVERFLOW_FILL = 104;
export const MIN_READY_FILL = 96;

export function createCoffeeCup(id: number): CoffeeCupState {
  return {
    fill: 0,
    id,
    ingredients: { sugar: 0, syrup: 0 },
    order: {
      amount: 1 + Math.floor(Math.random() * 3),
      ingredient: Math.random() > .5 ? 'sugar' : 'syrup',
    },
  };
}

export function activeCupCount(secondsElapsed: number) {
  return Math.min(MAX_CUPS, 1 + Math.floor(secondsElapsed / 15));
}

export function hasCorrectIngredients(cup: CoffeeCupState) {
  const other = cup.order.ingredient === 'sugar' ? 'syrup' : 'sugar';
  return cup.ingredients[cup.order.ingredient] === cup.order.amount
    && cup.ingredients[other] === 0;
}

export function coffeeShiftScore(served: number) {
  return Math.min(100, served * 10);
}
