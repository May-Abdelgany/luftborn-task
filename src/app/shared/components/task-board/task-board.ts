import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Task } from '../../../core/interface/itask';
import { TaskCard } from '../task-card/task-card';
import { SearchPipe } from '../../../core/pipes/search-pipe';
import { Tasks } from '../../../features/services/tasks/tasks';
import { Translate } from '../../../core/services/translate/translate';

@Component({
  selector: 'app-task-board',
  imports: [TaskCard, SearchPipe],
  templateUrl: './task-board.html',
  styleUrl: './task-board.css',
})
export class TaskBoard {
  private readonly TasksService = inject(Tasks);
  private translate = inject(Translate);

  searchText = signal<string>('');
  type = input<string>('');
  deletedTask = output<string>();
  tasks = input.required<Task[]>();
  draggedTaskId = signal<string | null>(null);
  statusChanged = output<{ taskId: string; status: string }>();
  columns = signal([
    {
      value: 'todo',
      label: { en: 'TO DO', ar: 'قيد التنفيذ' },
    },
    {
      value: 'progress',
      label: { en: 'IN PROGRESS', ar: 'قيد العمل' },
    },
    {
      value: 'done',
      label: { en: 'DONE', ar: 'منتهي' },
    },
  ]);
  currentLang = signal<string>('en');

  ngOnInit(): void {
    this.getSerchText();
    this.translate.pLang.subscribe((lang) => {
      this.currentLang.set(lang);
    });
  }
  getTasksByColumn(column: string) {
    return this.tasks().filter(
      (t) => t.status.toLocaleLowerCase() === column.replace(/\s+/g, '').toLocaleLowerCase(),
    );
  }
  getSerchText() {
    this.TasksService.searchText.subscribe((res) => {
      this.searchText.set(res);
    });
  }
  deleteTask($event: string) {
    this.deletedTask.emit($event);
  }

  onDragStart(event: DragEvent, taskId: string) {
    this.draggedTaskId.set(taskId);
    event.dataTransfer?.setData('text/plain', taskId);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // REQUIRED
  }

  onDrop(event: DragEvent, column: string) {
    event.preventDefault();

    const taskId = this.draggedTaskId();
    if (!taskId) return;

    this.updateTaskStatus(taskId, column);
    this.draggedTaskId.set(null);
  }

  updateTaskStatus(taskId: string, column: string) {
    this.statusChanged.emit({ taskId, status: column.replace(/\s+/g, '').toLowerCase() });
  }
}
