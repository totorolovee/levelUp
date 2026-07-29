import { useState } from 'react';
import { useLanguage } from '../lib/language';
import {
  createTodo,
  deleteTodo,
  setTodoCompleted,
  type TodoCategoryDefinition,
  type TodoItem,
} from '../lib/todos';

type Props = {
  category: TodoCategoryDefinition;
  items: TodoItem[];
  onChange: (items: TodoItem[]) => void;
};

export function TodoColumn({ category, items, onChange }: Props) {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const add = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const item = await createTodo(category.key, title);
      onChange([item, ...items]);
      setTitle('');
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
      <header><span>{category.icon}</span><h2>{category.name}</h2><small>{items.length}</small></header>
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
      </div>
      <div className="todo-list">
        {items.map((item) => (
          <article className={item.completed ? 'completed' : ''} key={item.id}>
            <button aria-label={language === 'ru' ? 'Поставить галочку' : 'Tick the box'} className="todo-check" onClick={() => toggle(item)} type="button">
              {item.completed ? '✓' : ''}
            </button>
            <p>{item.title}</p>
            <button aria-label={language === 'ru' ? 'Удалить' : 'Delete'} className="todo-delete" onClick={() => remove(item.id)} type="button">×</button>
          </article>
        ))}
      </div>
    </section>
  );
}
