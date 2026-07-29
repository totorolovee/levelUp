import type { TodoCategoryDefinition, TodoItem } from '../lib/todos';

type Props = {
  categories: TodoCategoryDefinition[];
  isRussian: boolean;
  items: TodoItem[];
  onSelect: (category: TodoCategoryDefinition) => void;
};

export function TodoTopicPicker({ categories, isRussian, items, onSelect }: Props) {
  return (
    <section className="todo-topic-picker">
      <header>
        <div>
          <p className="eyebrow">{isRussian ? 'Твои темы' : 'Your topics'}</p>
          <h2>{isRussian ? 'Выбери, на чём сосредоточиться' : 'Choose what to focus on'}</h2>
        </div>
        <span>{categories.length}</span>
      </header>
      <div>
        {categories.map((category) => {
          const topicItems = items.filter(({ categoryKey }) => categoryKey === category.key);
          const completed = topicItems.filter((item) => item.completed).length;
          const progress = topicItems.length ? Math.round(completed / topicItems.length * 100) : 0;
          return (
            <button key={category.key} onClick={() => onSelect(category)} type="button">
              <i>{category.icon}</i>
              <span>
                <strong>{category.name}</strong>
                <small>
                  {topicItems.length
                    ? (isRussian
                      ? `${completed} из ${topicItems.length} выполнено`
                      : `${completed} of ${topicItems.length} completed`)
                    : (isRussian ? 'Пока нет задач' : 'No tasks yet')}
                </small>
              </span>
              <b>{progress}%</b>
              <em><span style={{ width: `${progress}%` }} /></em>
              <u>→</u>
            </button>
          );
        })}
      </div>
    </section>
  );
}
