import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Analytics } from './analytics';
import { Api } from '../../../core/services/api/api';
import { of } from 'rxjs';

describe('Analytics Component', () => {
  let component: Analytics;
  let fixture: ComponentFixture<Analytics>;

  const mockApiResponse = {
    tasks: [
      { priority: 'high', status: 'todo' },
      { priority: 'medium', status: 'in_progress' },
      { priority: 'low', status: 'done' },
    ],
  };

  const apiMock = {
    get: jasmine.createSpy('get').and.returnValue(of(mockApiResponse)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analytics],
      providers: [
        {
          provide: Api,
          useValue: apiMock,
        },
      ],
    }).compileComponents();
  });

  /* ================= API PATH ================= */

  it('should load tasks from API when localStorage is empty', fakeAsync(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'tasks') return null;
      return null;
    });

    spyOn(localStorage, 'setItem');

    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;

    fixture.detectChanges();
    tick();

    expect(apiMock.get).toHaveBeenCalled();
    expect(component.tasks().length).toBeGreaterThan(0);
  }));

  /* ================= LOCAL STORAGE PATH ================= */

  it('should load tasks from localStorage if exists', () => {
    const storedTasks = [{ priority: 'high', status: 'todo' }];

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'tasks') {
        return JSON.stringify(storedTasks);
      }
      return null;
    });

    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.tasks().length).toBe(1);
  });

  /* ================= PRIORITY CHART ================= */

  it('should generate priority chart data', () => {
    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;

    component.tasks.set([
      { priority: 'high', status: 'todo' },
      { priority: 'medium', status: 'todo' },
      { priority: 'low', status: 'done' },
    ] as any);

    component.generatePriorityChart();

    expect(component.priorityChartData.datasets[0].data).toEqual([1, 1, 1]);
  });

  /* ================= STATUS CHART ================= */

  it('should generate status chart data', () => {
    component.tasks.set([{ status: 'todo' }, { status: 'in_progress' }, { status: 'done' }] as any);

    component.generateStatusChart();

    expect(component.statusChartData.datasets[0].data).toEqual([1, 1, 1]);
  });
});
