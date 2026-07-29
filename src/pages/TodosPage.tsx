import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { SmoothLink } from '../components/SmoothLink';
import { TodoColumn } from '../components/TodoColumn';
import { TodoCategoryCreator } from '../components/TodoCategoryCreator';
import { useLanguage } from '../lib/language';
import {
  loadCustomTodoCategories,
  loadTodos,
  type TodoCategoryDefinition,
  type TodoItem,
} from '../lib/todos';
import { supabase } from '../lib/supabase';

export function TodosPage() {
  const { language } = useLanguage();
  const [items, setItems] = useState<TodoItem[]>([]);
  const [customCategories, setCustomCategories] = useState<TodoCategoryDefinition[]>([]);
  const [status, setStatus] = useState<'loading' | 'guest' | 'ready' | 'error'>('loading');
  const isRussian = language === 'ru';

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setStatus('guest');
        return;
      }
      try {
        const [todoItems, savedCategories] = await Promise.all([
          loadTodos(),
          loadCustomTodoCategories(),
        ]);
        setItems(todoItems);
        setCustomCategories(savedCategories);
        setStatus('ready');
      } catch {
        setStatus('error');
      }
    });
  }, []);

  const builtInCategories: TodoCategoryDefinition[] = [
    { key: 'work', name: isRussian ? 'Работа' : 'Work', icon: '◼', kind: 'builtin' },
    { key: 'study', name: isRussian ? 'Учёба' : 'Study', icon: '◆', kind: 'builtin' },
    { key: 'personal', name: isRussian ? 'Личная жизнь' : 'Personal', icon: '♥', kind: 'builtin' },
  ];
  const categories = [...builtInCategories, ...customCategories];

  const changeCategory = (categoryKey: string, categoryItems: TodoItem[]) => {
    setItems((current) => [
      ...current.filter((item) => item.categoryKey !== categoryKey),
      ...categoryItems,
    ]);
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro todo-intro">
        <div>
          <p className="eyebrow">{isRussian ? 'Поставь галочку' : 'Tick the box'}</p>
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
        <>
          <TodoCategoryCreator
            isRussian={isRussian}
            onCreate={(category) => setCustomCategories((current) => [...current, category])}
          />
          <div className="todo-board">
            {categories.map((category) => (
              <TodoColumn
                category={category}
                items={items.filter((item) => item.categoryKey === category.key)}
                key={category.key}
                onChange={(next) => changeCategory(category.key, next)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
