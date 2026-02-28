import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskBoard } from './task-board';
import { Tasks } from '../../../features/services/tasks/tasks';
import { BehaviorSubject, of } from 'rxjs';
import { Translate } from '../../../core/services/translate/translate';
import { TranslateModule } from '@ngx-translate/core';

describe('TaskBoard Component', () => {
  let component: TaskBoard;
  let fixture: ComponentFixture<TaskBoard>;

  const tasksServiceMock = {
    searchText: new BehaviorSubject<string>('test'),
  };

  const mockTasks = [
    {
      id: '1',
      status: 'todo',
      title: 'Task 1',
    },
    {
      id: '2',
      status: 'done',
      title: 'Task 2',
    },
  ];
  const langSubject = new BehaviorSubject<string>('en');

  const mockTranslate = {
    pLang: langSubject.asObservable(),
    setLanguage: jasmine.createSpy('setLanguage'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskBoard, TranslateModule.forRoot()],
      providers: [
        {
          provide: Tasks,
          useValue: tasksServiceMock,
        },
        { provide: Translate, useValue: mockTranslate },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskBoard);
    component = fixture.componentInstance;

    /* ⭐ Provide required input */
    component.tasks = mockTasks as any;

    fixture.detectChanges();
  });

  /* ================= COMPONENT CREATION ================= */

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  /* ================= SEARCH TEXT ================= */

  it('should subscribe to search text on init', () => {
    component.ngOnInit();

    expect(component.searchText()).toBe('test');
  });

  /* ================= TASK FILTER ================= */

  it('should filter tasks by column', () => {
    component.tasks = mockTasks as any;

    const result = component.getTasksByColumn('todo');

    expect(result.length).toBe(1);
    expect(result[0].status).toBe('todo');
  });

  /* ================= DELETE TASK ================= */

  it('should emit delete task event', () => {
    spyOn(component.deletedTask, 'emit');

    component.deleteTask('1');

    expect(component.deletedTask.emit).toHaveBeenCalledWith('1');
  });

  /* ================= DRAG START ================= */

  it('should set dragged task id on drag start', () => {
    const event = {
      dataTransfer: {
        setData: jasmine.createSpy('setData'),
      },
    } as any;

    component.onDragStart(event, '1');

    expect(component['draggedTaskId']()).toBe('1');
  });

  /* ================= DROP EVENT ================= */

  it('should reset dragged task after drop', () => {
    const dragEvent = {
      preventDefault: jasmine.createSpy('preventDefault'),
    } as any;

    component.tasks = mockTasks as any;

    component.onDragStart({ dataTransfer: { setData: () => {} } } as any, '1');

    spyOn(component, 'updateTaskStatus');

    component.onDrop(dragEvent, 'done');

    expect(component.updateTaskStatus).toHaveBeenCalled();
    expect(component['draggedTaskId']()).toBeNull();
  });

  /* ================= STATUS UPDATE ================= */

  it('should emit status changed event', () => {
    spyOn(component.statusChanged, 'emit');

    component.updateTaskStatus('1', 'done');

    expect(component.statusChanged.emit).toHaveBeenCalledWith({
      taskId: '1',
      status: 'done',
    });
  });
});
