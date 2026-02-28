import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTask } from './add-task';
import { TranslateModule } from '@ngx-translate/core';
import { Translate } from '../../../core/services/translate/translate';
import { BehaviorSubject } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('AddTask', () => {
  let component: AddTask;
  let fixture: ComponentFixture<AddTask>;
  const langSubject = new BehaviorSubject<string>('en');

  const mockTranslate = {
    pLang: langSubject.asObservable(),
    setLanguage: jasmine.createSpy('setLanguage'),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddTask,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: Translate, useValue: mockTranslate },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTask);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
