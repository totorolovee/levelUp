import { supabase } from './supabase';

export type TodoCategory = 'work' | 'study' | 'personal';
export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoCategoryDefinition = {
  key: string;
  name: string;
  icon: string;
  kind: 'builtin' | 'custom';
};

export type TodoItem = {
  id: string;
  categoryKey: string;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  dueDate: string | null;
  subtasks: TodoSubtask[];
};

export type TodoSubtask = {
  id: string;
  todoId: string;
  title: string;
  completed: boolean;
};

type TodoRow = {
  id: string;
  category: TodoCategory | null;
  custom_category_id: string | null;
  title: string;
  completed: boolean;
  priority: TodoPriority;
  due_date: string | null;
};

type TodoCategoryRow = { id: string; name: string };
type TodoSubtaskRow = {
  id: string;
  todo_id: string;
  title: string;
  completed: boolean;
};

const columns = 'id,category,custom_category_id,title,completed,priority,due_date';

function toTodoItem(row: TodoRow, subtasks: TodoSubtask[] = []): TodoItem {
  return {
    id: row.id,
    categoryKey: row.custom_category_id ? `custom:${row.custom_category_id}` : row.category ?? '',
    title: row.title,
    completed: row.completed,
    priority: row.priority,
    dueDate: row.due_date,
    subtasks,
  };
}

export async function loadTodos() {
  const [todoResult, subtaskResult] = await Promise.all([
    supabase.from('todo_items').select(columns).order('created_at', { ascending: false }),
    supabase.from('todo_subtasks').select('id,todo_id,title,completed').order('created_at'),
  ]);
  if (todoResult.error) throw todoResult.error;
  if (subtaskResult.error) throw subtaskResult.error;
  const subtasks = (subtaskResult.data as TodoSubtaskRow[]).map(toTodoSubtask);
  return (todoResult.data as TodoRow[]).map((row) =>
    toTodoItem(row, subtasks.filter(({ todoId }) => todoId === row.id)),
  );
}

function toTodoSubtask(row: TodoSubtaskRow): TodoSubtask {
  return { id: row.id, todoId: row.todo_id, title: row.title, completed: row.completed };
}

export async function createTodo(
  categoryKey: string,
  title: string,
  priority: TodoPriority,
  dueDate: string,
) {
  const customId = categoryKey.startsWith('custom:') ? categoryKey.slice(7) : null;
  const { data, error } = await supabase
    .from('todo_items')
    .insert({
      category: customId ? null : categoryKey,
      custom_category_id: customId,
      title: title.trim(),
      priority,
      due_date: dueDate || null,
    })
    .select(columns)
    .single();
  if (error) throw error;
  return toTodoItem(data as TodoRow);
}

export async function loadCustomTodoCategories(): Promise<TodoCategoryDefinition[]> {
  const { data, error } = await supabase
    .from('todo_categories')
    .select('id,name')
    .order('created_at');
  if (error) throw error;
  return (data as TodoCategoryRow[]).map(({ id, name }) => ({
    key: `custom:${id}`,
    name,
    icon: '●',
    kind: 'custom',
  }));
}

export async function createTodoCategory(name: string): Promise<TodoCategoryDefinition> {
  const { data, error } = await supabase
    .from('todo_categories')
    .insert({ name: name.trim() })
    .select('id,name')
    .single();
  if (error) throw error;
  const row = data as TodoCategoryRow;
  return { key: `custom:${row.id}`, name: row.name, icon: '●', kind: 'custom' };
}

export async function deleteTodoCategory(categoryKey: string) {
  const id = categoryKey.startsWith('custom:') ? categoryKey.slice(7) : '';
  if (!id) return;
  const { error } = await supabase.from('todo_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function setTodoCompleted(id: string, completed: boolean) {
  const { error } = await supabase
    .from('todo_items')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteTodo(id: string) {
  const { error } = await supabase.from('todo_items').delete().eq('id', id);
  if (error) throw error;
}

export async function createTodoSubtask(todoId: string, title: string) {
  const { data, error } = await supabase
    .from('todo_subtasks')
    .insert({ todo_id: todoId, title: title.trim() })
    .select('id,todo_id,title,completed')
    .single();
  if (error) throw error;
  return toTodoSubtask(data as TodoSubtaskRow);
}

export async function setTodoSubtaskCompleted(id: string, completed: boolean) {
  const { error } = await supabase
    .from('todo_subtasks')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteTodoSubtask(id: string) {
  const { error } = await supabase.from('todo_subtasks').delete().eq('id', id);
  if (error) throw error;
}
