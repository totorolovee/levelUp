import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { SmoothLink } from '../components/SmoothLink';
import { TodoColumn } from '../components/TodoColumn';
import { useLanguage } from '../lib/language';
import { loadTodos, type TodoCategory, type TodoItem } from '../lib/todos';
import { supabase } from '../lib/supabase';

const categories: TodoCategory[] = ['work', 'study', 'personal'];

export function TodosPage() {
  const { language } = useLanguage();
  const [items, setItems] = useState<TodoItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'guest' | 'ready' | 'error'>('loading');
  const isRussian = language === 'ru';

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setStatus('guest');
        return;
      }
      try {
        setItems(await loadTodos());
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    });
  }, []);

  const changeCategory = (category: TodoCategory, categoryItems: TodoItem[]) => {
    setItems((current) => [
      ...current.filter((item) => item.category !== category),
      ...categoryItems,
    ]);
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro todo-intro">
        <div>
          <p className="eyebrow">Tick the box</p>
          <h1>{isRussian ? 'Всё важное — в одном месте.' : 'Everything important, in one place.'}</h1>
          <p>{isRussian ? 'Работа, учёба и личная жизнь без хаоса.' : 'Work, study, and personal life without the chaos.'}</p>
        </div>
      </section>
      {status === 'loading' && <p>{isRussian ? 'Загрузка…' : 'Loading…'}</p>}
      {status === 'error' && <p className="coach-error">{isRussian ? 'Не удалось загрузить задачи.' : 'Could not load tasks.'}</p>}
      {status === 'guest' && (
        <section className="empty-state">
          <h2>{isRussian ? 'Сначала войди' : 'Sign in first'}</h2>
          <SmoothLink className="primary-link" href="/login">{isRussian ? 'Войти' : 'Sign in'}</SmoothLink>
        </section>
      )}
      {status === 'ready' && (
        <div className="todo-board">
          {categories.map((category) => (
            <TodoColumn
              category={category}
              items={items.filter((item) => item.category === category)}
              key={category}
              onChange={(next) => changeCategory(category, next)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
