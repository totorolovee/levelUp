import { useState } from 'react';
import {
  deleteTodo,
  setTodoCompleted,
  type TodoItem,
} from '../lib/todos';
import {
  createTodoSubtask,
  deleteTodoSubtask,
  setTodoSubtaskCompleted,
} from '../lib/todoSubtasks';
import { TaskConfetti } from './TaskConfetti';
import { TodoTaskEditor } from './TodoTaskEditor';

type Props = {
  isRussian: boolean;
  item: TodoItem;
  onRemove: () => void;
  onUpdate: (item: TodoItem) => void;
};

const priorityLabels = {
  ru: { low: 'Низкий', medium: 'Средний', high: 'Высокий' },
  en: { low: 'Low', medium: 'Medium', high: 'High' },
};

export function TodoTaskCard({ isRussian, item, onRemove, onUpdate }: Props) {
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [confettiRun, setConfettiRun] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const language = isRussian ? 'ru' : 'en';

  const toggleTask = async () => {
    const completed = !item.completed;
    await setTodoCompleted(item.id, completed);
    onUpdate({ ...item, completed });
    if (completed) setConfettiRun((current) => current + 1);
  };

  const removeTask = async () => {
    await deleteTodo(item.id);
    onRemove();
  };

  const addSubtask = async () => {
    if (!subtaskTitle.trim()) return;
    setIsAdding(true);
    try {
      const subtask = await createTodoSubtask(item.id, subtaskTitle);
      onUpdate({ ...item, subtasks: [...item.subtasks, subtask] });
      setSubtaskTitle('');
    } finally {
      setIsAdding(false);
    }
  };

  const toggleSubtask = async (id: string, completed: boolean) => {
    await setTodoSubtaskCompleted(id, completed);
    onUpdate({
      ...item,
      subtasks: item.subtasks.map((subtask) =>
        subtask.id === id ? { ...subtask, completed } : subtask),
    });
  };

  const removeSubtask = async (id: string) => {
    await deleteTodoSubtask(id);
    onUpdate({ ...item, subtasks: item.subtasks.filter((subtask) => subtask.id !== id) });
  };

  return (
    <article className={`${item.completed ? 'completed ' : ''}${isEditing ? 'editing ' : ''}priority-${item.priority}`}>
      <TaskConfetti run={confettiRun} />
      <button aria-label={isRussian ? 'Выполнить задачу' : 'Complete task'} className="todo-check" onClick={toggleTask} type="button">
        {item.completed ? '✓' : ''}
      </button>
      <div className="todo-task-body">
        {isEditing ? (
          <TodoTaskEditor
            isRussian={isRussian}
            item={item}
            onCancel={() => setIsEditing(false)}
            onSave={(updated) => {
              onUpdate(updated);
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <p>{item.title}</p>
            <small>
              {priorityLabels[language][item.priority]}
              {item.dueDate && ` · ${new Intl.DateTimeFormat(isRussian ? 'ru-RU' : 'en-US', {
                day: 'numeric',
                month: 'short',
              }).format(new Date(`${item.dueDate}T00:00:00`))}`}
            </small>
          </>
        )}
        <div className="todo-subtasks">
          {item.subtasks.map((subtask) => (
            <div className={subtask.completed ? 'completed' : ''} key={subtask.id}>
              <button onClick={() => toggleSubtask(subtask.id, !subtask.completed)} type="button">
                {subtask.completed ? '✓' : ''}
              </button>
              <span>{subtask.title}</span>
              <button onClick={() => removeSubtask(subtask.id)} type="button">×</button>
            </div>
          ))}
          <label>
            <input
              maxLength={200}
              onChange={(event) => setSubtaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void addSubtask();
              }}
              placeholder={isRussian ? 'Добавить подзадачу…' : 'Add a subtask…'}
              value={subtaskTitle}
            />
            <button disabled={!subtaskTitle.trim() || isAdding} onClick={addSubtask} type="button">+</button>
          </label>
        </div>
      </div>
      <button
        aria-label={isRussian ? 'Изменить задачу' : 'Edit task'}
        className="todo-edit"
        onClick={() => setIsEditing((current) => !current)}
        type="button"
      >
        <span aria-hidden="true">✎</span>
        <strong>{isRussian ? 'Изменить' : 'Edit'}</strong>
      </button>
      <button aria-label={isRussian ? 'Удалить' : 'Delete'} className="todo-delete" onClick={removeTask} type="button">×</button>
    </article>
  );
}
