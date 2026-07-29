import { useEffect, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { SmoothLink } from '../components/SmoothLink';
import { TodoColumn } from '../components/TodoColumn';
import { TodoCategoryCreator } from '../components/TodoCategoryCreator';
import { TodoTopicPicker } from '../components/TodoTopicPicker';
import { useLanguage } from '../lib/language';
import {
  loadCustomTodoCategories,
  loadTodos,
  deleteTodoCategory,
  type TodoCategoryDefinition,
  type TodoItem,
} from '../lib/todos';
import { supabase } from '../lib/supabase';

export function TodosPage() {
  const { language } = useLanguage();
  const [items, setItems] = useState<TodoItem[]>([]);
  const [customCategories, setCustomCategories] = useState<TodoCategoryDefinition[]>([]);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);
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
  const selectedCategory = categories.find(({ key }) => key === selectedCategoryKey);

  const changeCategory = (categoryKey: string, categoryItems: TodoItem[]) => {
    setItems((current) => [
      ...current.filter((item) => item.categoryKey !== categoryKey),
      ...categoryItems,
    ]);
  };

  const removeCategory = async (category: TodoCategoryDefinition) => {
    const confirmed = window.confirm(isRussian
      ? `Удалить тему «${category.name}» и все задачи в ней?`
      : `Delete “${category.name}” and all its tasks?`);
    if (!confirmed) return;
    await deleteTodoCategory(category.key);
    setSelectedCategoryKey(null);
    setCustomCategories((current) => current.filter(({ key }) => key !== category.key));
    setItems((current) => current.filter(({ categoryKey }) => categoryKey !== category.key));
  };

  return (
    <main className="shell">
      <AppHeader />
      <section className="page-intro todo-intro">
        <div>
          <p className="eyebrow">{isRussian ? 'Задачи' : 'Tasks'}</p>
          <h1>{isRussian ? 'Наведи порядок в делах.' : 'Bring order to your day.'}</h1>
          <p>{isRussian ? 'Выбери тему и сосредоточься только на ней.' : 'Choose a topic and focus on one thing at a time.'}</p>
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
          {!selectedCategory && (
            <>
              <TodoCategoryCreator
                isRussian={isRussian}
                onCreate={(category) => setCustomCategories((current) => [...current, category])}
              />
              <TodoTopicPicker
                categories={categories}
                isRussian={isRussian}
                items={items}
                onSelect={(category) => setSelectedCategoryKey(category.key)}
              />
            </>
          )}
          {selectedCategory && (
            <section className="todo-topic-view">
              <button className="todo-topic-back" onClick={() => setSelectedCategoryKey(null)} type="button">
                ← {isRussian ? 'Все темы' : 'All topics'}
              </button>
              <div className="todo-topic-title">
                <span>{selectedCategory.icon}</span>
                <div>
                  <p>{isRussian ? 'Сейчас в фокусе' : 'Current focus'}</p>
                  <h2>{selectedCategory.name}</h2>
                </div>
              </div>
              <TodoColumn
                category={selectedCategory}
                items={items.filter((item) => item.categoryKey === selectedCategory.key)}
                key={selectedCategory.key}
                onChange={(next) => changeCategory(selectedCategory.key, next)}
                onDeleteCategory={() => void removeCategory(selectedCategory)}
              />
            </section>
          )}
        </>
      )}
    </main>
  );
}
