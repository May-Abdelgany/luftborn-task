import { Component, inject, signal } from '@angular/core';
import { Tasks } from '../../features/services/tasks/tasks';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Translate } from '../../core/services/translate/translate';

@Component({
  selector: 'app-navbar',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly TasksService = inject(Tasks);
  private translate = inject(Translate);
  currentLang = signal<string>('en');

  searchQuery = signal('');
  userInitials = signal('JD');
  ngOnInit(): void {
    this.translate.pLang.subscribe((lang) => {
      this.currentLang.set(lang);
    });
  }
  onSearchChange(event: any) {
    this.searchQuery.set(event.target.value);
    this.TasksService.searchText.next(this.searchQuery());
  }
}
