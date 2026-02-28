import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskForm } from './task-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { Toaster } from '../../../core/services/toaster/toaster';
import { Api } from '../../../core/services/api/api';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Assignee, Task } from '../../../core/interface/itask';

describe('TaskForm', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  const mockAssignee: Assignee = {
    id: '1',
    name: 'John Doe',
    avatar: 'avatar.png',
    email: 'john@example.com',
  };

  const mockTask: Task = {
    id: 'task-123',
    title: 'Old Title',
    description: 'This description is long enough',
    assignee: mockAssignee,
    tags: ['old'],
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-12-12',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  const mockToaster = { showSuccess: jasmine.createSpy('showSuccess') };
  const mockApi = { get: jasmine.createSpy('get').and.returnValue(of([mockAssignee])) };

  beforeEach(async () => {
    mockRouter.navigate.calls.reset();
    mockToaster.showSuccess.calls.reset();

    await TestBed.configureTestingModule({
      imports: [TaskForm, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Toaster, useValue: mockToaster },
        { provide: Api, useValue: mockApi },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: 'task-123' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
    spyOn(localStorage, 'setItem');
  });

  describe('Submit Branch Coverage', () => {
    it('should split tags with commas and handle single tags', () => {
      fixture.componentRef.setInput('formType', 'add');
      fixture.detectChanges();

      // Case 1: Multiple tags (covers .split and .map)
      component.taskForm.patchValue({ ...mockTask, tags: 'tag1, tag2', assignee: '1' });
      component.submit();

      // Case 2: Single tag (covers the 'else' in ternary)
      component.taskForm.patchValue({ ...mockTask, tags: 'tag1', assignee: '1' });
      component.submit();

      expect(component.tasks().length).toBe(2);
      expect(mockToaster.showSuccess).toHaveBeenCalled();
    });

    it('should return early if form is invalid', () => {
      fixture.componentRef.setInput('formType', 'add');
      fixture.detectChanges();

      // Title too short makes form invalid
      component.taskForm.patchValue({ title: 'abc' });
      component.submit();

      expect(mockToaster.showSuccess).not.toHaveBeenCalled();
    });
  });

  describe('Update Mode Coverage', () => {
    it('should cover setValue and update branch in submit', fakeAsync(() => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify([mockTask]));

      fixture = TestBed.createComponent(TaskForm);
      component = fixture.componentInstance;

      fixture.componentRef.setInput('formType', 'update');
      fixture.detectChanges();

      component.taskForm.patchValue({
        title: 'New Updated Title',
        tags: 'new-tag',
        assignee: '1',
      });

      component.submit();

      const updatedTask = component.tasks().find((t) => t.id === 'task-123');

      expect(updatedTask?.title).toBe('New Updated Title');

      expect(mockToaster.showSuccess).toHaveBeenCalledWith('Update Task', 'Success');

      tick(1000);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    }));

    it('should handle task not found in update mode', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify([]));
      fixture.componentRef.setInput('formType', 'update');

      fixture.detectChanges();

      expect(component.updatedTask()).toBeNull();
    });
  });
});
