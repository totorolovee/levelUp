export type CoffeeIngredient = 'sugar' | 'syrup';

export type CoffeeOrder = {
  ingredient: CoffeeIngredient;
  amount: number;
  targetFill: number;
};

export type IngredientCounts = Record<CoffeeIngredient, number>;

export function createCoffeeOrders(difficulty: number, count = 8): CoffeeOrder[] {
  const maxAmount = difficulty >= 7 ? 3 : 2;
  return Array.from({ length: count }, (_, index) => ({
    ingredient: (index + Math.floor(Math.random() * 2)) % 2 === 0 ? 'sugar' : 'syrup',
    amount: 1 + Math.floor(Math.random() * maxAmount),
    targetFill: 74 + Math.floor(Math.random() * 15),
  }));
}

export function getCoffeePourRate(difficulty: number) {
  return Math.min(0.039, 0.024 + difficulty * 0.00075);
}

export function scoreCoffeeOrder(
  order: CoffeeOrder,
  ingredients: IngredientCounts,
  fill: number,
) {
  const ingredientsCorrect = ingredients[order.ingredient] === order.amount
    && ingredients[order.ingredient === 'sugar' ? 'syrup' : 'sugar'] === 0;
  const fillError = Math.abs(fill - order.targetFill);
  const fillScore = Math.max(0, Math.round(45 - fillError * 3));
  return {
    fillError,
    ingredientsCorrect,
    score: fillScore + (ingredientsCorrect ? 55 : 0),
    successful: ingredientsCorrect && fillError <= 6,
  };
}
