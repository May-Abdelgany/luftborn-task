import { Component } from '@angular/core';
import { TaskForm } from "../../../shared/components/task-form/task-form";
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-task',
  imports: [TaskForm,TranslatePipe],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css',
})
export class AddTask {}
