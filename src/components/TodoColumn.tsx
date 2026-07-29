import { useState } from 'react';
import { useLanguage } from '../lib/language';
import {
  createTodo,
  deleteTodo,
  setTodoCompleted,
  type TodoCategory,
  type TodoItem,
} from '../lib/todos';

type Props = {
  category: TodoCategory;
  items: TodoItem[];
  onChange: (items: TodoItem[]) => void;
};

const labels = {
  work: { icon: '◼', ru: 'Работа', en: 'Work' },
  study: { icon: '◆', ru: 'Учёба', en: 'Study' },
  personal: { icon: '♥', ru: 'Личная жизнь', en: 'Personal' },
};

export function TodoColumn({ category, items, onChange }: Props) {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const label = labels[category];

  const add = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const item = await createTodo(category, title);
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
    <section className={`todo-column todo-${category}`}>
      <header><span>{label.icon}</span><h2>{label[language]}</h2><small>{items.length}</small></header>
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
            <button aria-label="Tick the box" className="todo-check" onClick={() => toggle(item)} type="button">
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
