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

  /* ================= SAFE ARRAY HELPER ⭐⭐⭐⭐⭐ */

  private safeArray<T>(data: T[]): T[] {
    return Array.isArray(data) ? data : [];
  }

  /* ================= STATISTICS ================= */

  getStatictics() {
    this.ApiService.get<Istatistics>('statistics.json').subscribe((res) => {
      this.statistics.set(this.safeArray(res.statistics));
    });
  }

  /* ================= TASKS ================= */

  getTasks() {
    if (!localStorage.getItem('tasks')) {
      this.ApiService.get<Itask>('tasks.json').subscribe((res) => {
        this.tasks.set(this.safeArray(res.tasks));

        localStorage.setItem('tasks', JSON.stringify(this.tasks()));
      });
    } else {
      const stored = localStorage.getItem('tasks');

      this.tasks.set(stored ? this.safeArray(JSON.parse(stored)) : []);
    }
  }

  /* ================= FILTERS ================= */

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

  /* ================= FILTER MATCH ================= */

  private matchesFilter(value: string | null, taskValue?: string) {
    if (!value || value === 'All') return true;

    return taskValue?.toLowerCase() === value.toLowerCase().replace(/\s+/g, '');
  }

  /* ================= COMPUTED FILTER ⭐⭐⭐⭐⭐ */

  filteredTasks = computed(() => {
    return this.tasks().filter(
      (task) =>
        this.matchesFilter(this.prioretyType(), task.priority) &&
        this.matchesFilter(this.statusType(), task.status) &&
        this.matchesFilter(this.userType(), task.assignee?.id),
    );
  });

  /* ================= DELETE ================= */

  deleteTask(value: string) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== value));

    localStorage.setItem('tasks', JSON.stringify(this.tasks()));

    this.ToasterService.showSuccess('Delete Task', 'Success');
  }

  /* ================= STATUS UPDATE ================= */

  onStatusChanged(event: { taskId: string; status: string }) {
    const updatedTasks = this.tasks().map((task) =>
      task.id === event.taskId ? { ...task, status: event.status } : task,
    );

    this.tasks.set(updatedTasks);
  }
}
