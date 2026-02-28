import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavTabs } from './nav-tabs';
import { Api } from '../../../core/services/api/api';
import { of } from 'rxjs';

describe('NavTabs Component', () => {
  let component: NavTabs;
  let fixture: ComponentFixture<NavTabs>;

  /* ================= MOCK API SERVICE ================= */

  const mockUsers = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Alex' },
  ];

  const apiMock = {
    get: jasmine.createSpy('get').and.returnValue(of(mockUsers)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavTabs],
      providers: [
        {
          provide: Api,
          useValue: apiMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavTabs);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  /* ================= COMPONENT CREATION ================= */

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  /* ================= NG ON INIT ================= */

  it('should load users on init', fakeAsync(() => {
    spyOn(component, 'getUsers');

    component.ngOnInit();

    expect(component.getUsers).toHaveBeenCalled();
  }));

  /* ================= TAB SELECTION ================= */

  it('should change active tab and emit event', () => {
    spyOn(component.selectType, 'emit');

    component.setActiveTab('Done');

    expect(component.activeTab()).toBe('Done');
    expect(component.selectType.emit).toHaveBeenCalledWith('Done');
  });

  /* ================= PRIORITY CHANGE ================= */

  it('should change priority', () => {
    const event = {
      target: {
        value: 'High',
      },
    } as any;

    spyOn(component.selectPriorety, 'emit');

    component.setPriority(event);

    expect(component.selectedPriority()).toBe('High');
    expect(component.selectPriorety.emit).toHaveBeenCalledWith('High');
  });

  /* ================= STATUS CHANGE ================= */

  it('should change status', () => {
    const event = {
      target: {
        value: 'Done',
      },
    } as any;

    spyOn(component.selectStatus, 'emit');

    component.setStatus(event);

    expect(component.selectedStatus()).toBe('Done');
    expect(component.selectStatus.emit).toHaveBeenCalledWith('Done');
  });

  /* ================= USER CHANGE ================= */

  it('should change user', () => {
    const event = {
      target: {
        value: '1',
      },
    } as any;

    spyOn(component.selectUser, 'emit');

    component.setUser(event);

    expect(component.selectedUser()).toBe('1');
    expect(component.selectUser.emit).toHaveBeenCalledWith('1');
  });

  /* ================= API USERS ================= */

  it('should load users from API', () => {
    component.getUsers();

    expect(apiMock.get).toHaveBeenCalledWith('assignee.json');
    expect(component.assigne().length).toBeGreaterThan(0);
  });
});
