import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { RouterTestingModule } from '@angular/router/testing';
import { Tasks } from '../../features/services/tasks/tasks';
import { Translate } from '../../core/services/translate/translate';
import { of, Subject } from 'rxjs';

describe('Navbar Component', () => {

  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  let tasksSpy: jasmine.SpyObj<Tasks>;
  let translateSpy: jasmine.SpyObj<Translate>;

  beforeEach(async () => {

    tasksSpy = jasmine.createSpyObj('Tasks', [], {
      searchText: new Subject<string>()
    });

    translateSpy = jasmine.createSpyObj('Translate', [], {
      pLang: of('en')
    });

    await TestBed.configureTestingModule({
      imports: [
        Navbar,
        RouterTestingModule
      ],
      providers: [
        { provide: Tasks, useValue: tasksSpy },
        { provide: Translate, useValue: translateSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});
