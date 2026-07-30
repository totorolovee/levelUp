import { useState } from 'react';
import {
  updateTodo,
  type TodoItem,
  type TodoPriority,
} from '../lib/todos';
import { FriendlyDatePicker } from './FriendlyDatePicker';

type Props = {
  isRussian: boolean;
  item: TodoItem;
  onCancel: () => void;
  onSave: (item: TodoItem) => void;
};

export function TodoTaskEditor({ isRussian, item, onCancel, onSave }: Props) {
  const [title, setTitle] = useState(item.title);
  const [priority, setPriority] = useState<TodoPriority>(item.priority);
  const [dueDate, setDueDate] = useState(item.dueDate ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!title.trim() || isSaving) return;
    setIsSaving(true);
    setError('');
    try {
      const updated = await updateTodo(item.id, title, priority, dueDate);
      onSave({ ...updated, subtasks: item.subtasks });
    } catch {
      setError(isRussian
        ? 'Не удалось сохранить. Проверь интернет и попробуй ещё раз.'
        : 'Could not save. Check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="todo-task-editor">
      <input
        aria-label={isRussian ? 'Название задачи' : 'Task title'}
        maxLength={300}
        onChange={(event) => setTitle(event.target.value)}
        value={title}
      />
      <select
        aria-label={isRussian ? 'Приоритет' : 'Priority'}
        onChange={(event) => setPriority(event.target.value as TodoPriority)}
        value={priority}
      >
        <option value="low">{isRussian ? 'Низкий приоритет' : 'Low priority'}</option>
        <option value="medium">{isRussian ? 'Средний приоритет' : 'Medium priority'}</option>
        <option value="high">{isRussian ? 'Высокий приоритет' : 'High priority'}</option>
      </select>
      <div className="todo-editor-deadline">
        <FriendlyDatePicker
          ariaLabel={isRussian ? 'Дедлайн' : 'Deadline'}
          onChange={setDueDate}
          value={dueDate}
        />
        {dueDate && (
          <button onClick={() => setDueDate('')} type="button">
            {isRussian ? 'Убрать дату' : 'Clear date'}
          </button>
        )}
      </div>
      <div className="todo-editor-actions">
        <button onClick={onCancel} type="button">{isRussian ? 'Отмена' : 'Cancel'}</button>
        <button disabled={!title.trim() || isSaving} onClick={save} type="button">
          {isSaving ? '…' : (isRussian ? 'Сохранить' : 'Save')}
        </button>
      </div>
      {error && <p className="todo-editor-error" role="alert">{error}</p>}
    </div>
  );
}
