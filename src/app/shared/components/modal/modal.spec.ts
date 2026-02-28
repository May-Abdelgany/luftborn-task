import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';
import { TranslateModule } from '@ngx-translate/core';
import { Translate } from '../../../core/services/translate/translate';
import { BehaviorSubject } from 'rxjs';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;
  const langSubject = new BehaviorSubject<string>('en');

  const mockTranslate = {
    pLang: langSubject.asObservable(),
    setLanguage: jasmine.createSpy('setLanguage'),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal, TranslateModule.forRoot()],
      providers: [{ provide: Translate, useValue: mockTranslate }],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('id', '123');
    fixture.componentRef.setInput('buttonName', 'Delete');

    fixture.detectChanges();
  });

  it('should emit id when action is called', () => {
    spyOn(component.deletedTask, 'emit');

    component.action('123');

    expect(component.deletedTask.emit).toHaveBeenCalledWith('123');
  });
});
