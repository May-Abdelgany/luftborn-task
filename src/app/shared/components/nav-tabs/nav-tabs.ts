import { Component, inject, output, signal, OnInit, DestroyRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Api } from '../../../core/services/api/api';
import { Assignee } from '../../../core/interface/itask';
import { Translate } from '../../../core/services/translate/translate';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-nav-tabs',
  standalone: true,
  imports: [TranslatePipe, RouterLink],
  templateUrl: './nav-tabs.html',
  styleUrl: './nav-tabs.css',
})
export class NavTabs implements OnInit {
  private apiService = inject(Api);
  private translate = inject(Translate);
  private destroyRef = inject(DestroyRef); // Handles cleanup for 100% lifecycle coverage

  currentLang = signal<string>('en');
  activeTab = signal('All');
  assigne = signal<Assignee[]>([]);
  selectedPriority = signal('All');
  selectedStatus = signal('All');
  selectedUser = signal('All');

  // Outputs
  selectType = output<string>();
  selectPriorety = output<string>();
  selectStatus = output<string>();
  selectUser = output<string>();

  tabs = signal([
    { en: 'All', ar: 'الكل' },
    { en: 'To Do', ar: 'قيد التنفيذ' },
    { en: 'In Progress', ar: 'قيد العمل' },
    { en: 'Done', ar: 'منتهي' },
  ]);

  priorities = signal([
    { en: 'All', ar: 'الكل' },
    { en: 'High', ar: 'عالي' },
    { en: 'Medium', ar: 'متوسط' },
    { en: 'Low', ar: 'منخفض' },
  ]);

  ngOnInit(): void {
    this.getUsers();

    // Using takeUntilDestroyed ensures the subscription is covered and cleaned up
    this.translate.pLang
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((lang) => {
        this.currentLang.set(lang);
      });
  }

  getUsers(): void {
    this.apiService.get<Assignee[]>('assignee.json')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.assigne.set(res);
      });
  }

  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
    this.selectType.emit(tab);
  }

  setPriority(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedPriority.set(value);
    this.selectPriorety.emit(value);
  }

  setStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedStatus.set(value);
    this.selectStatus.emit(value);
  }

  setUser(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedUser.set(value);
    this.selectUser.emit(value);
  }

  setLang(lang: string): void {
    this.translate.setLanguage(lang);
  }
}
