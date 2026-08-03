import type { CoffeeIngredient, IngredientCounts } from '../../lib/coffeeGame';

type Props = {
  disabled: boolean;
  ingredients: IngredientCounts;
  isRussian: boolean;
  onAdd: (ingredient: CoffeeIngredient) => void;
};

export function CoffeeIngredientShelf({ disabled, ingredients, isRussian, onAdd }: Props) {
  const name = (ingredient: CoffeeIngredient) => ingredient === 'sugar'
    ? (isRussian ? 'Сахар' : 'Sugar')
    : (isRussian ? 'Сироп' : 'Syrup');
  return (
    <div className="coffee-ingredients">
      {(['sugar', 'syrup'] as const).map((ingredient) => (
        <button disabled={disabled} key={ingredient} onClick={() => onAdd(ingredient)} type="button">
          <span className={`ingredient-jar ${ingredient}`} aria-hidden="true"><i /></span>
          <strong>{name(ingredient)}</strong>
          <small>× {ingredients[ingredient]}</small>
        </button>
      ))}
    </div>
  );
}
