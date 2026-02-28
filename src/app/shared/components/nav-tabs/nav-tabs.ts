import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, output, signal } from '@angular/core';
import { Api } from '../../../core/services/api/api';
import { Assignee } from '../../../core/interface/itask';
import { Translate } from '../../../core/services/translate/translate';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-tabs',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './nav-tabs.html',
  styleUrl: './nav-tabs.css',
})
export class NavTabs {
  private ApiService = inject(Api);
  private translate = inject(Translate);

  currentLang = signal<string>('en');
  // Signal for active tab
  activeTab = signal('All');
  selectType = output<string>();
  selectPriorety = output<string>();
  selectStatus = output<string>();
  selectUser = output<string>();

  assigne = signal<Assignee[]>([]);
  // Tabs as a signal array
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
  // Signal for selected priority
  selectedPriority = signal('All');
  selectedStatus = signal('All');
  selectedUser = signal('All');
  ngOnInit(): void {
    this.getUsers();
    this.translate.pLang.subscribe((lang) => {
      this.currentLang.set(lang);
    });
  }
  setActiveTab(tab: string) {
    this.activeTab.set(tab);
    this.selectType.emit(this.activeTab());
  }
  setPriority($event: Event) {
    let priority = ($event.target as HTMLSelectElement).value;
    this.selectedPriority.set(priority);
    this.selectPriorety.emit(priority);
  }
  setStatus($event: Event) {
    let status = ($event.target as HTMLSelectElement).value;
    this.selectedStatus.set(status);
    this.selectStatus.emit(status);
  }

  getUsers() {
    this.ApiService.get<Assignee[]>('assignee.json').subscribe((res) => {
      this.assigne.set(res);
    });
  }

  setUser($event: Event) {
    let user = ($event.target as HTMLSelectElement).value;
    this.selectedUser.set(user);
    this.selectUser.emit(user);
  }

  setLang(lang: string) {
    this.translate.setLanguage(lang);
  }
}
