import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Translate } from '../../core/services/translate/translate';
import { BehaviorSubject } from 'rxjs';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let langSubject: BehaviorSubject<string>;
  let mockTranslateService: any;

  beforeEach(async () => {
    // 1. Reset the Subject for every test to 'en'
    langSubject = new BehaviorSubject<string>('en');

    // 2. Create the mock object with spies
    mockTranslateService = {
      pLang: langSubject.asObservable(),
      setLanguage: jasmine.createSpy('setLanguage')
    };

    await TestBed.configureTestingModule({
      imports: [
        Sidebar,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        // 3. Inject the mock
        { provide: Translate, useValue: mockTranslateService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    // ngOnInit is called here
    fixture.detectChanges();
  });

  // --- Coverage for ngOnInit() ---
  it('should update currentLang signal when pLang emits (ngOnInit coverage)', () => {
    // Act: Emit a new value from the mocked service
    langSubject.next('ar');

    // Assert: Check if the signal was updated inside the subscription
    expect(component.currentLang()).toBe('ar');
  });

  // --- Coverage for setLang() ---
  it('should call translate.setLanguage when setLang is executed', () => {
    // Act: Call the component method
    component.setLang('fr');

    // Assert: Verify the service method was called
    expect(mockTranslateService.setLanguage).toHaveBeenCalledWith('fr');
  });

  // --- Check initial state ---
  it('should initialize with currentLang "en"', () => {
    expect(component.currentLang()).toBe('en');
  });


});
