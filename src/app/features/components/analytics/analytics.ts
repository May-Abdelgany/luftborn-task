import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Itask, Task } from '../../../core/interface/itask';
import { Api } from '../../../core/services/api/api';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics {
  private ApiService = inject(Api);

  tasks = signal<Task[]>([]);
  priorityChartData: any;
  statusChartData: any;
  ngOnInit() {
    this.getTasks();
    this.generatePriorityChart();
    this.generateStatusChart();
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

  generatePriorityChart() {
    const priorityCount = { high: 0, medium: 0, low: 0 };

    this.tasks().forEach((t) => priorityCount[t.priority]++);

    this.priorityChartData = {
      labels: ['High', 'Medium', 'Low'],
      datasets: [
        {
          data: [priorityCount.high, priorityCount.medium, priorityCount.low],
        },
      ],
      backgroundColor: [
        '#f87171', // Todo → Red
        '#60a5fa', // In Progress → Blue
        '#34d399', // Done → Green
      ],

      borderColor: ['#ef4444', '#3b82f6', '#10b981'],

      borderWidth: 2,
    };
  }

  generateStatusChart() {
    const statusCount = { todo: 0, in_progress: 0, done: 0 };

    this.tasks().forEach((t) => statusCount[t.status]++);

    this.statusChartData = {
      labels: ['Todo', 'In Progress', 'Done'],
      datasets: [
        {
          label: 'Tasks',
          data: [statusCount.todo, statusCount.in_progress, statusCount.done],
        },
      ],
    };
  }
}
