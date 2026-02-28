import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { Translate } from './core/services/translate/translate';

describe('AppComponent', () => {

  let component: App;
  let fixture: ComponentFixture<App>;

  const langSubject = new BehaviorSubject<string>('en');

  class TranslateMock {

    pLang = langSubject.asObservable();

    setLanguage = jasmine.createSpy('setLanguage');
  }

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule
      ],
      providers: [
        {
          provide: Translate,
          useClass: TranslateMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
