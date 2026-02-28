import { TestBed } from '@angular/core/testing';
import { Translate } from './translate';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

describe('Translate Service', () => {
  let service: Translate;

  const translateServiceMock = {
    use: jasmine.createSpy('use'),
    setFallbackLang: jasmine.createSpy('setFallbackLang'),
    getCurrentLang: jasmine.createSpy('getCurrentLang').and.returnValue('en'),
    getFallbackLang: jasmine.createSpy('getFallbackLang').and.returnValue('en'),
  };

  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    TestBed.configureTestingModule({
      providers: [
        Translate,
        {
          provide: TranslateService,
          useValue: translateServiceMock,
        },
      ],
    });

    service = TestBed.inject(Translate);
  });

  /* ================= SERVICE CREATION ================= */

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* ================= CURRENT LANGUAGE ================= */

  it('should return current language', () => {
    expect(service.currentLanguage).toBe('en');
  });

  /* ================= SET LANGUAGE ================= */

  it('should set language correctly', () => {
    service.setLanguage('ar');

    expect(translateServiceMock.use).toHaveBeenCalledWith('ar');
    expect(translateServiceMock.setFallbackLang).toHaveBeenCalledWith('ar');
  });

  /* ================= LOCAL STORAGE ================= */

  it('should save language to localStorage', () => {
    service.setLanguage('en');

    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'en');
  });

  /* ================= DIRECTION ================= */

  it('should set document direction to rtl for Arabic', () => {
    service.setLanguage('ar');

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('should set document direction to ltr for English', () => {
    service.setLanguage('en');

    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  /* ================= BEHAVIOR SUBJECT ================= */

  it('should update language observable', () => {
    const spy = jasmine.createSpy('subscriber');

    service.pLang.subscribe(spy);

    service.setLanguage('ar');

    expect(spy).toHaveBeenCalledWith('ar');
  });
});
