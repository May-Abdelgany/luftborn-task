import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Translate {
  private translate = inject(TranslateService);
  pLang: BehaviorSubject<string> = new BehaviorSubject<string>(this.currentLanguage);
  setLanguage(lang: string = 'en'): void {
    this.translate.use(lang);
    this.translate.setFallbackLang(lang);
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.pLang.next(lang);
  }
  get currentLanguage(): string {
    return this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en';
  }
}
