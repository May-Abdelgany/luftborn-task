import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { Navbar } from './navbar';
import { Tasks } from '../../features/services/tasks/tasks';
import { Translate } from '../../core/services/translate/translate';
import { Subject } from 'rxjs';
import { provideRouter } from '@angular/router';

@Pipe({
  name: 'translate',
  standalone: true,
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('Navbar Component', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  let mockSearchText: jasmine.SpyObj<any>;
  let mockLangSubject: Subject<string>;

  beforeEach(async () => {
    mockSearchText = jasmine.createSpyObj('searchText', ['next']);
    mockLangSubject = new Subject<string>();

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideRouter([]),
        {
          provide: Tasks,
          useValue: {
            searchText: mockSearchText,
          },
        },
        {
          provide: Translate,
          useValue: {
            pLang: mockLangSubject.asObservable(),
          },
        },
      ],
    })
      .overrideComponent(Navbar, {
        set: {
          imports: [MockTranslatePipe],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    mockLangSubject.complete();
  });

  // ✅ This covers ngOnInit subscribe block
  it('should subscribe to pLang and update currentLang', () => {
    fixture.detectChanges(); // triggers ngOnInit

    mockLangSubject.next('ar');

    expect(component.currentLang()).toBe('ar');
  });

  // ✅ This covers onSearchChange fully
  it('should update searchQuery and emit searchText', () => {
    fixture.detectChanges();

    const mockEvent = {
      target: { value: 'Angular' },
    };

    component.onSearchChange(mockEvent);

    expect(component.searchQuery()).toBe('Angular');
    expect(mockSearchText.next).toHaveBeenCalledWith('Angular');
  });

  it('should cover ngOnInit subscription', () => {
    fixture.detectChanges(); // ✅ triggers ngOnInit

    mockLangSubject.next('ar');

    expect(component.currentLang()).toBe('ar');
  });

  it('should cover onSearchChange method', () => {
    fixture.detectChanges();

    const event = {
      target: { value: 'test-search' },
    };

    component.onSearchChange(event);

    expect(component.searchQuery()).toBe('test-search');
    expect(mockSearchText.next).toHaveBeenCalledWith('test-search');
  });
});
