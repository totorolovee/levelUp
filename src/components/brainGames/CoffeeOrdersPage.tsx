import type { CoffeeCupState } from '../../lib/coffeeGame';
import { CoffeeOrderIcons } from './CoffeeOrderIcons';

type Props = {
  cups: CoffeeCupState[];
  isRussian: boolean;
  onOpenMachines: () => void;
  started: boolean;
};

export function CoffeeOrdersPage({ cups, isRussian, onOpenMachines, started }: Props) {
  return (
    <section className="coffee-orders-page">
      <div className="coffee-orders-intro">
        <p className="eyebrow">{isRussian ? 'Страница 1 · Заказы' : 'Page 1 · Orders'}</p>
        <h2>{isRussian ? 'Запомни четыре рецепта' : 'Remember four recipes'}</h2>
        <p>{isRussian
          ? 'Номер карточки совпадает с номером кофемашины.'
          : 'Each card number matches its coffee machine.'}</p>
      </div>
      <div className="coffee-order-grid">
        {cups.map((cup) => (
          <article key={cup.id}>
            <span>{cup.id}</span>
            <CoffeeOrderIcons isRussian={isRussian} order={cup.order} />
          </article>
        ))}
      </div>
      <button className="coffee-open-machines" onClick={onOpenMachines} type="button">
        {started
          ? (isRussian ? 'Вернуться к машинам' : 'Back to machines')
          : (isRussian ? 'Начать минутную смену' : 'Start one-minute shift')} →
      </button>
    </section>
  );
}
