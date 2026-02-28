import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Loader } from './loader';
import { signal, WritableSignal } from '@angular/core';
import * as loaderServices from '../../services/loader/loader';

describe('Loader', () => {
  let component: Loader;
  let fixture: ComponentFixture<Loader>;

  const loaderServiceMock: Partial<loaderServices.Loader> = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide'),
    loading: signal<boolean>(false) as WritableSignal<boolean>,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loader],
      providers: [
        {
          provide: Loader,
          useValue: loaderServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Loader);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loader show', () => {
    component.loader.show();
    expect(loaderServiceMock.show).toHaveBeenCalled();
  });

  it('should change loading signal', () => {
    const loadingSignal = loaderServiceMock.loading as WritableSignal<boolean>;

    loadingSignal.set(true);

    expect(loadingSignal()).toBeTrue();
  });
});
