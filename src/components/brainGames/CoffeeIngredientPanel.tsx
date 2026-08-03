import type { CoffeeIngredient } from '../../lib/coffeeGame';

type Props = {
  disabled: boolean;
  isRussian: boolean;
  onAdd: (ingredient: CoffeeIngredient) => void;
  selectedId: number;
};

export function CoffeeIngredientPanel({ disabled, isRussian, onAdd, selectedId }: Props) {
  return (
    <div className="coffee-ingredient-panel">
      <div>
        <span>{isRussian ? 'Ингредиенты добавятся в' : 'Ingredients go to'}</span>
        <strong>{isRussian ? 'стакан' : 'cup'} {selectedId}</strong>
      </div>
      {(['sugar', 'chocolate'] as const).map((ingredient) => (
        <button disabled={disabled} key={ingredient} onClick={() => onAdd(ingredient)} type="button">
          <i className={ingredient} aria-hidden="true" />
          {ingredient === 'sugar'
            ? (isRussian ? 'Сахар' : 'Sugar')
            : (isRussian ? 'Шоколад' : 'Chocolate')}
        </button>
      ))}
    </div>
  );
}
