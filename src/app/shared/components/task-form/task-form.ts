import { Component, input, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Assignee, Task } from '../../../core/interface/itask';
import { Toaster } from '../../../core/services/toaster/toaster';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../../core/services/api/api';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskForm {
  constructor(
    private readonly fb: FormBuilder,
    private Toaster: Toaster,
    private router: Router,
    private Api: Api,
    private route: ActivatedRoute,
  ) {}
  taskForm!: FormGroup;
  tasks = signal<Task[]>([]);
  assigne = signal<Assignee[]>([]);
  formType = input.required<string>();
  taskId = signal<string>('');
  updatedTask = signal<Task | null>(null);

  ngOnInit(): void {
    this.tasks.set(JSON.parse(localStorage.getItem('tasks')!) || []);
    this.generateForm();
    this.getUsers();
    this.getTask();
  }
  getUsers() {
    this.Api.get<Assignee[]>('assignee.json').subscribe((res) => {
      this.assigne.set(res);
      if (this.formType() == 'add') {
        this.form['assignee'].setValue(this.assigne()[0].id);
      }
    });
  }
  generateForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: ['todo'],
      priority: ['medium'],
      dueDate: ['', Validators.required],
      assignee: [''],
      tags: ['', Validators.required],
      createdAt: [new Date().toISOString()],
    });
  }
  getTask() {
    if (this.formType() == 'update') {
      this.route.paramMap.subscribe((params) => {
        this.taskId.set(params.get('id') || '');
        const task = this.tasks().find((task) => task.id == this.taskId()) || null;
        this.updatedTask.set(task);
        if (task) {
          this.setValue(task);
        }
      });
    }
  }
  setValue(task: Task) {
    if (this.formType() == 'update') {
      const { id, updatedAt, ...taskWithoutId } = task;
      this.taskForm.setValue(taskWithoutId);
      this.form['assignee'].setValue(taskWithoutId.assignee.id);
    }
  }
  get form() {
    return this.taskForm.controls;
  }

  submit() {
    if (this.taskForm.invalid) return;

    const assign = this.assigne().find((user) => user.id == this.taskForm.value.assignee) || null;

    this.taskForm.value.assignee = assign;

    const baseTask = {
      ...this.taskForm.value,
      tags: this.taskForm.value.tags
        ? this.taskForm.value.tags.includes(',')
          ? this.taskForm.value.tags.split(',').map((t: string) => t.trim())
          : this.taskForm.value.tags
        : [],
      updatedAt: new Date().toISOString(),
    };

    if (this.formType() == 'add') {
      const task = {
        id: crypto.randomUUID(),
        ...baseTask,
      };

      this.tasks().push(task);

      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
      this.Toaster.showSuccess('Add Task', 'Success');
    } else {
      const task = {
        id: this.taskId(), // ✅ نحافظ على نفس الـ id
        ...baseTask,
      };

      this.tasks.set(this.tasks().map((t) => (t.id === this.taskId() ? task : t)));

      localStorage.setItem('tasks', JSON.stringify(this.tasks()));
      this.Toaster.showSuccess('Update Task', 'Success');
    }

    this.taskForm.reset({
      status: 'todo',
      priority: 'medium',
    });

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1000);
  }
}
