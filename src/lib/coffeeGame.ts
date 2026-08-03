export type CoffeeIngredient = 'sugar' | 'chocolate';

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
export const COFFEE_MACHINE_COUNT = 4;
export const POINTS_PER_ORDER = 1000;
export const OVERFLOW_FILL = 104;
export const MIN_READY_FILL = 96;

export function createCoffeeCup(id: number): CoffeeCupState {
  return {
    fill: 0,
    id,
    ingredients: { sugar: 0, chocolate: 0 },
    order: {
      amount: 1 + Math.floor(Math.random() * 3),
      ingredient: Math.random() > .5 ? 'sugar' : 'chocolate',
    },
  };
}

export function hasCorrectIngredients(cup: CoffeeCupState) {
  const other = cup.order.ingredient === 'sugar' ? 'chocolate' : 'sugar';
  return cup.ingredients[cup.order.ingredient] === cup.order.amount
    && cup.ingredients[other] === 0;
}

export function coffeeShiftScore(served: number) {
  return Math.min(100, served * 10);
}
