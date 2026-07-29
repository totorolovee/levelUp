import { useState } from 'react';
import { createTodoCategory, type TodoCategoryDefinition } from '../lib/todos';

type Props = {
  isRussian: boolean;
  onCreate: (category: TodoCategoryDefinition) => void;
};

export function TodoCategoryCreator({ isRussian, onCreate }: Props) {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const create = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setError('');
    try {
      onCreate(await createTodoCategory(name));
      setName('');
    } catch {
      setError(isRussian ? 'Не получилось создать тему.' : 'Could not create the topic.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="todo-category-creator">
      <div>
        <strong>{isRussian ? 'Своя тема' : 'Custom topic'}</strong>
        <span>{isRussian ? 'Например: спорт, проекты или путешествия' : 'For example: sport, projects, or travel'}</span>
      </div>
      <input
        maxLength={40}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') void create();
        }}
        placeholder={isRussian ? 'Название темы' : 'Topic name'}
        value={name}
      />
      <button disabled={!name.trim() || isSaving} onClick={create} type="button">
        {isRussian ? 'Создать' : 'Create'}
      </button>
      {error && <small>{error}</small>}
    </section>
  );
}
