import type { CoffeeOrder } from '../../lib/coffeeGame';

type Props = {
  isRussian: boolean;
  order: CoffeeOrder;
};

export function CoffeeOrderIcons({ isRussian, order }: Props) {
  const name = order.ingredient === 'sugar'
    ? (isRussian ? 'кубик сахара' : 'sugar cube')
    : (isRussian ? 'порция сиропа' : 'syrup shot');
  return (
    <span className="coffee-order-icons" role="img" aria-label={`${order.amount} × ${name}`}>
      {Array.from({ length: order.amount }, (_, index) => (
        <i className={`coffee-order-icon ${order.ingredient}`} key={index} />
      ))}
    </span>
  );
}
