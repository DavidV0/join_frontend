import { Contact } from '../interfaces/contact';
import { Subtask } from '../interfaces/subtask';

export interface Task {
  id: number;
  title: string;
  description: string;
  due_date: string;
  category: string;
  prio: number;
  status: string;
  assigned_to: Contact[];
  subtasks: Subtask[];
}
