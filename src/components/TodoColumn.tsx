import { useState } from 'react';
import { useLanguage } from '../lib/language';
import {
  createTodo,
  deleteTodo,
  setTodoCompleted,
  type TodoCategoryDefinition,
  type TodoItem,
  type TodoPriority,
} from '../lib/todos';

type Props = {
  category: TodoCategoryDefinition;
  items: TodoItem[];
  onChange: (items: TodoItem[]) => void;
  onDeleteCategory: () => void;
};

const priorityOrder: Record<TodoPriority, number> = { high: 0, medium: 1, low: 2 };

export function TodoColumn({ category, items, onChange, onDeleteCategory }: Props) {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const isRussian = language === 'ru';
  const sortedItems = [...items].sort(
    (first, second) => priorityOrder[first.priority] - priorityOrder[second.priority],
  );

  const add = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const item = await createTodo(category.key, title, priority, dueDate);
      onChange([item, ...items]);
      setTitle('');
      setDueDate('');
    } finally {
      setIsSaving(false);
    }
  };

  const toggle = async (item: TodoItem) => {
    await setTodoCompleted(item.id, !item.completed);
    onChange(items.map((current) =>
      current.id === item.id ? { ...current, completed: !current.completed } : current,
    ));
  };

  const remove = async (id: string) => {
    await deleteTodo(id);
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <section className={`todo-column todo-${category.kind}`}>
      <header>
        <span>{category.icon}</span><h2>{category.name}</h2><small>{items.length}</small>
        {category.kind === 'custom' && (
          <button
            aria-label={isRussian ? 'Удалить тему' : 'Delete topic'}
            className="todo-category-delete"
            onClick={onDeleteCategory}
            type="button"
          >×</button>
        )}
      </header>
      <div className="todo-composer">
        <input
          maxLength={300}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void add();
          }}
          placeholder={language === 'ru' ? 'Добавить задачу…' : 'Add a task…'}
          value={title}
        />
        <button disabled={!title.trim() || isSaving} onClick={add} type="button">+</button>
        <select
          aria-label={isRussian ? 'Приоритет' : 'Priority'}
          onChange={(event) => setPriority(event.target.value as TodoPriority)}
          value={priority}
        >
          <option value="low">{isRussian ? 'Низкий приоритет' : 'Low priority'}</option>
          <option value="medium">{isRussian ? 'Средний приоритет' : 'Medium priority'}</option>
          <option value="high">{isRussian ? 'Высокий приоритет' : 'High priority'}</option>
        </select>
        <label className="todo-date-field">
          <span>
            {dueDate
              ? `${isRussian ? 'Дедлайн' : 'Due'}: ${new Intl.DateTimeFormat(
                isRussian ? 'ru-RU' : 'en-US',
                { day: 'numeric', month: 'long' },
              ).format(new Date(`${dueDate}T00:00:00`))}`
              : (isRussian ? 'Выбрать дедлайн' : 'Choose deadline')}
          </span>
          <input
            aria-label={isRussian ? 'Дедлайн' : 'Deadline'}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setDueDate(event.target.value)}
            type="date"
            value={dueDate}
          />
        </label>
      </div>
      <div className="todo-list">
        {sortedItems.map((item) => (
          <article className={`${item.completed ? 'completed ' : ''}priority-${item.priority}`} key={item.id}>
            <button aria-label={language === 'ru' ? 'Поставить галочку' : 'Tick the box'} className="todo-check" onClick={() => toggle(item)} type="button">
              {item.completed ? '✓' : ''}
            </button>
            <div>
              <p>{item.title}</p>
              <small>
                {isRussian
                  ? { low: 'Низкий', medium: 'Средний', high: 'Высокий' }[item.priority]
                  : { low: 'Low', medium: 'Medium', high: 'High' }[item.priority]}
                {item.dueDate && ` · ${new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
                  day: 'numeric',
                  month: 'short',
                }).format(new Date(`${item.dueDate}T00:00:00`))}`}
              </small>
            </div>
            <button aria-label={language === 'ru' ? 'Удалить' : 'Delete'} className="todo-delete" onClick={() => remove(item.id)} type="button">×</button>
          </article>
        ))}
      </div>
    </section>
  );
}
