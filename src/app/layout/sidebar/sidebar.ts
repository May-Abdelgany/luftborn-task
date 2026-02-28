import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { Isidebar } from '../../core/interface/isidebar';
import { Translate } from '../../core/services/translate/translate';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private translate = inject(Translate);
  // Signal for menu items
  menuItems = signal<Isidebar[]>([
    {
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      routerLink: '/dashboard',
      image: '/dashboard.png',
    },
    {
      label: 'Tasks',
      labelAr: 'المهام',
      routerLink: '/home',
      image: '/tasks.png',
    },
    {
      label: 'Calendar',
      labelAr: 'التقويم',
      routerLink: '/calender',
      image: '/calender.png',
    },
    {
      label: 'Analytics',
      labelAr: 'التحليلات',
      routerLink: '/analytics',
      image: '/analytics.png',
    },
    {
      label: 'Team',
      labelAr: 'الفريق',
      routerLink: '/team',
      image: '/team.png',
    },
    {
      label: 'Settings',
      labelAr: 'الإعدادات',
      routerLink: '/settings',
      image: '/settings.png',
    },
  ]);
  
  currentLang = signal<string>('en');
  ngOnInit(): void {
    this.translate.pLang.subscribe((lang) => {
      this.currentLang.set(lang);
    });
  }
  setLang(lang: string) {
    this.translate.setLanguage(lang);
  }
}
