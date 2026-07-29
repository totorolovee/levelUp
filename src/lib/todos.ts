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

const columns = 'id,category,custom_category_id,title,completed,priority,due_date';

function toTodoItem(row: TodoRow): TodoItem {
  return {
    id: row.id,
    categoryKey: row.custom_category_id ? `custom:${row.custom_category_id}` : row.category ?? '',
    title: row.title,
    completed: row.completed,
    priority: row.priority,
    dueDate: row.due_date,
  };
}

export async function loadTodos() {
  const { data, error } = await supabase
    .from('todo_items')
    .select(columns)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as TodoRow[]).map(toTodoItem);
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
