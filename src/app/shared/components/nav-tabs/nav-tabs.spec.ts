import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavTabs } from './nav-tabs';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Api } from '../../../core/services/api/api';
import { Translate } from '../../../core/services/translate/translate';
import { BehaviorSubject, of } from 'rxjs';

describe('NavTabs', () => {
  let component: NavTabs;
  let fixture: ComponentFixture<NavTabs>;

  // 1. Create a Subject to trigger the .subscribe() inside ngOnInit
  const langSubject = new BehaviorSubject<string>('en');

  // 2. Mock Api to return a value immediately
  const mockApi = {
    get: jasmine.createSpy('get').and.returnValue(of([{ id: 1, name: 'Test User' }]))
  };

  const mockTranslate = {
    pLang: langSubject.asObservable(),
    setLanguage: jasmine.createSpy('setLanguage')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavTabs, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: Api, useValue: mockApi },
        { provide: Translate, useValue: mockTranslate }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavTabs);
    component = fixture.componentInstance;

    // Trigger ngOnInit(), getUsers(), and all subscriptions
    fixture.detectChanges();
  });

  // --- NEW: Cover the signal initialization and arrays ---
  it('should initialize with correct default signals (Covers tabs and priorities lines)', () => {
    expect(component.tabs()).toBeDefined();
    expect(component.tabs().length).toBe(4);
    expect(component.priorities()).toBeDefined();
    expect(component.priorities().length).toBe(4);
    expect(component.activeTab()).toBe('All');
  });

  it('should cover ngOnInit and getUsers subscriptions', () => {
    expect(mockApi.get).toHaveBeenCalledWith('assignee.json');
    expect(component.assigne().length).toBeGreaterThan(0);

    // Trigger the pLang subscription logic
    langSubject.next('ar');
    expect(component.currentLang()).toBe('ar');
  });

  it('should cover setActiveTab and its emit', () => {
    spyOn(component.selectType, 'emit');
    component.setActiveTab('Done');

    expect(component.activeTab()).toBe('Done');
    expect(component.selectType.emit).toHaveBeenCalledWith('Done');
  });

  it('should cover setPriority and its emit', () => {
    spyOn(component.selectPriorety, 'emit');
    // Using a proper mock for the Event target
    const event = { target: { value: 'High' } } as unknown as Event;

    component.setPriority(event);

    expect(component.selectedPriority()).toBe('High');
    expect(component.selectPriorety.emit).toHaveBeenCalledWith('High');
  });

  it('should cover setStatus and its emit', () => {
    spyOn(component.selectStatus, 'emit');
    const event = { target: { value: 'In Progress' } } as unknown as Event;

    component.setStatus(event);

    expect(component.selectedStatus()).toBe('In Progress');
    expect(component.selectStatus.emit).toHaveBeenCalledWith('In Progress');
  });

  it('should cover setUser and its emit', () => {
    spyOn(component.selectUser, 'emit');
    const event = { target: { value: 'User123' } } as unknown as Event;

    component.setUser(event);

    expect(component.selectedUser()).toBe('User123');
    expect(component.selectUser.emit).toHaveBeenCalledWith('User123');
  });

  it('should cover setLang', () => {
    component.setLang('fr');
    expect(mockTranslate.setLanguage).toHaveBeenCalledWith('fr');
  });

  // --- NEW: Cover takeUntilDestroyed(this.destroyRef) ---
  it('should clean up subscriptions when destroyed (Covers destroyRef line)', () => {
    fixture.destroy(); // This triggers the DestroyRef

    // We push a value to the subject after destruction
    langSubject.next('es');

    // The currentLang should NOT be 'es' because the subscription should be dead
    // (Though in a test, the most important thing is that calling destroy() didn't crash)
    expect(component.currentLang()).not.toBe('es');
  });
});
