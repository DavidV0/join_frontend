import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-kanban-board-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './kanban-board-component.component.html',
  styleUrl: './kanban-board-component.component.scss',
})
export class KanbanBoardComponent implements OnInit {
  todos: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  selectedTask: Task | null = null;
  taskForm: FormGroup;
  isPopupOpen = false;

  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      prio: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      status: ['todo', Validators.required],
      assigned_to: [[]],
      subtasks: [[]],
    });
  }

  ngOnInit(): void {
    this.apiService.getTodos().subscribe((data) => {
      this.categorizeTasks(data);
    });
  }

  categorizeTasks(tasks: Task[]): void {
    this.todos = tasks.filter((task) => task.status === 'todo');
    this.inProgress = tasks.filter((task) => task.status === 'in_progress');
    this.done = tasks.filter((task) => task.status === 'done');
  }

  openPopup(task: Task): void {
    this.selectedTask = task;
    this.isPopupOpen = true;
    this.taskForm.patchValue(task);
  }

  closePopup(): void {
    this.isPopupOpen = false;
    this.selectedTask = null;
  }

  saveChanges(): void {
    if (this.taskForm.valid && this.selectedTask) {
      const updatedTask = { ...this.selectedTask, ...this.taskForm.value };
      this.apiService.updateTodo(updatedTask.id, updatedTask).subscribe(() => {
        this.closePopup();
        this.ngOnInit(); // Reload tasks
      });
    }
  }

  deleteTask(taskId: number): void {
    this.apiService.deleteTodo(taskId).subscribe(() => {
      this.closePopup();
      this.ngOnInit(); // Reload tasks
    });
  }
}
