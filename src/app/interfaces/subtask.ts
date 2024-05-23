export interface Subtask {
  id: number;
  description: string;
  state: boolean;
  parent_task: number;
}
