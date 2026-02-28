import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskForm } from './task-form';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Api } from '../../../core/services/api/api';
import { Toaster } from '../../../core/services/toaster/toaster';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('TaskForm Component', () => {

  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  const apiMock = {
    get: jasmine.createSpy('get').and.returnValue(of({
      tasks: []
    }))
  };

  const toasterMock = {
    showSuccess: jasmine.createSpy('showSuccess')
  };

  const routeMock = {
    paramMap: of({
      get: () => '1'
    })
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        TaskForm,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Api, useValue: apiMock },
        { provide: Toaster, useValue: toasterMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;

    // ⭐ CRITICAL PART (Must be before detectChanges)
    fixture.componentRef.setInput('formType', 'add');

    fixture.detectChanges();
  });

  /* ================= TESTS ================= */

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    expect(component.taskForm).toBeTruthy();
  });

  it('should call submit', fakeAsync(() => {

    spyOn(localStorage, 'setItem');

    component.taskForm.setValue({
      title: 'Test Task',
      description: 'Test Description Long Text',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString(),
      assignee: '1',
      tags: 'tag1',
      createdAt: new Date().toISOString()
    });

    component.submit();

    tick(1000);

    expect(toasterMock.showSuccess).toHaveBeenCalled();
  }));

});
