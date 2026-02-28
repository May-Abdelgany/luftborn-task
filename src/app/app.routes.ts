import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/components/home/home').then((c) => c.Home),
  },
  {
    path: 'add-task',
    loadComponent: () => import('./features/components/add-task/add-task').then((c) => c.AddTask),
  },

  {
    path: 'update-task/:id',
    loadComponent: () =>
      import('./features/components/update-task/update-task').then((c) => c.UpdateTask),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./features/components/analytics/analytics').then((c) => c.Analytics),
  },
];
