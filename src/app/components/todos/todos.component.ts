import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  taskService = inject(TaskService);
  baseUrl = environment.baseUrl + 'api/todos';
  todos: any = [];
  error = '';

  task = {
    title: '',
    description: '',
    due_date: '',
    category: '',
    prio: 1,
    status: '',
    assigned_to: [''],
    subtasks: [''],
  };

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    this.loadTasks();
  }

  loadTodos() {
    const url = environment.baseUrl + 'api/todos/';
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    return lastValueFrom(
      this.http.get(url, {
        headers: headers,
      })
    );
  }
  loadTasks() {
    this.taskService.getAll().subscribe((data) => {
      this.todos = data;
    });
  }

  addTask() {
    this.taskService.create(this.task).subscribe((res) => {
      console.log('Task added', res);
    });
    this.loadTasks();
  }
  deleteTask(taskId: number) {
    this.taskService.delete(taskId).subscribe((response) => {
      // Wenn die Aufgabe erfolgreich gelöscht wurde, lade die Aufgabenliste erneut
      this.loadTasks();
    });
  }
}
