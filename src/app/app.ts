import { Component, inject, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Translate } from './core/services/translate/translate';
import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { Loader } from "./core/components/loader/loader";

@Component({
  selector: 'app-root',
  imports: [Navbar, Sidebar, RouterOutlet, Loader],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('luftborn-task');
  pLang = signal<string>('en');
  private translate: Translate = inject(Translate);
  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.setLanguage(savedLang);
    this.translate.pLang.subscribe((lang) => {
      this.pLang.set(lang);
    });
  }
}
