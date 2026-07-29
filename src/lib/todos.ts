import { supabase } from './supabase';

export type TodoCategory = 'work' | 'study' | 'personal';

export type TodoItem = {
  id: string;
  category: TodoCategory;
  title: string;
  completed: boolean;
};

type TodoRow = {
  id: string;
  category: TodoCategory;
  title: string;
  completed: boolean;
};

const columns = 'id,category,title,completed';

export async function loadTodos() {
  const { data, error } = await supabase
    .from('todo_items')
    .select(columns)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as TodoRow[];
}

export async function createTodo(category: TodoCategory, title: string) {
  const { data, error } = await supabase
    .from('todo_items')
    .insert({ category, title: title.trim() })
    .select(columns)
    .single();
  if (error) throw error;
  return data as TodoRow;
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
