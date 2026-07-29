import { supabase } from './supabase';

export type TodoSubtask = {
  id: string;
  todoId: string;
  title: string;
  completed: boolean;
};

type TodoSubtaskRow = {
  id: string;
  todo_id: string;
  title: string;
  completed: boolean;
};

function toTodoSubtask(row: TodoSubtaskRow): TodoSubtask {
  return { id: row.id, todoId: row.todo_id, title: row.title, completed: row.completed };
}

export async function loadTodoSubtasks() {
  const { data, error } = await supabase
    .from('todo_subtasks')
    .select('id,todo_id,title,completed')
    .order('created_at');
  if (error) throw error;
  return (data as TodoSubtaskRow[]).map(toTodoSubtask);
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
