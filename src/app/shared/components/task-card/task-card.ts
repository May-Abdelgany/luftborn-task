import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Task } from '../../../core/interface/itask';
import { RouterLink } from '@angular/router';
import { Modal } from '../modal/modal';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-task-card',
  imports: [NgClass, RouterLink, Modal, TranslatePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  task = input.required<Task>();
  deletedTask = output<string>();
  deleteTask(id: string) {
    this.deletedTask.emit(id);
  }
}
