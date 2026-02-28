import { Component } from '@angular/core';
import { TaskForm } from '../../../shared/components/task-form/task-form';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-update-task',
  imports: [TaskForm, TaskForm,TranslatePipe],
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
})
export class UpdateTask {}
