import { Itask, Task } from './../../../core/interface/itask';
import { Component, computed, inject, signal } from '@angular/core';
import { ProgressCard } from '../../../shared/components/progress-card/progress-card';
import { NavTabs } from '../../../shared/components/nav-tabs/nav-tabs';
import { TaskBoard } from '../../../shared/components/task-board/task-board';
import { Istatistics, Statistic } from '../../../core/interface/istatistics';
import { Api } from '../../../core/services/api/api';
import { Toaster } from '../../../core/services/toaster/toaster';

@Component({
  selector: 'app-home',
  imports: [ProgressCard, NavTabs, TaskBoard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly ApiService = inject(Api);
  private readonly ToasterService = inject(Toaster);
  taskType = signal<string>('All');
  prioretyType = signal<string>('All');
  statusType = signal<string>('All');
  userType = signal<string>('All');

  tasks = signal<Task[]>([]);
  statistics = signal<Statistic[]>([]);
  ngOnInit(): void {
    this.getStatictics();
    this.getTasks();
  }
  getStatictics() {
    this.ApiService.get<Istatistics>('statistics.json').subscribe((res) => {
      this.statistics.set(res.statistics);
    });
  }
  getTasks() {
    if (!localStorage.getItem('tasks')) {
      this.ApiService.get<Itask>('tasks.json').subscribe((res) => {
        this.tasks.set(res.tasks);
        localStorage.setItem('tasks', JSON.stringify(this.tasks()));
      });
    } else {
      this.tasks.set(JSON.parse(localStorage.getItem('tasks')!));
    }
  }

  getType(value: string) {
    this.taskType.set(value);
  }
  getPriorety(value: string) {
    this.prioretyType.set(value);
  }

  getStatus(value: string) {
    this.statusType.set(value);
  }
  getUser(value: string) {
    this.userType.set(value);
  }

  private matchesFilter(value: string | null, taskValue?: string) {
    if (!value || value === 'All') return true;

    return taskValue?.toLowerCase() === value.toLowerCase().replace(/\s+/g, '');
  }

  filteredTasks = computed(() => {
    return this.tasks().filter(
      (task) =>
        this.matchesFilter(this.prioretyType(), task.priority) &&
        this.matchesFilter(this.statusType(), task.status) &&
        this.matchesFilter(this.userType(), task.assignee.id),
    );
  });

  deleteTask(value: string) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== value));
    localStorage.setItem('tasks', JSON.stringify(this.tasks()));
    this.ToasterService.showSuccess('Delete Task', 'Success');
  }
  onStatusChanged(event: { taskId: string; status: string }) {
    const updatedTasks = this.tasks().map((task: Task) =>
      task.id === event.taskId ? { ...task, status: event.status } : task,
    );
    this.tasks.set(updatedTasks);
  }
}
