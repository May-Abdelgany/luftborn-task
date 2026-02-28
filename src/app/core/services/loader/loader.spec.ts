import { TestBed } from '@angular/core/testing';
import { Loader } from './loader';

describe('Loader Service', () => {
  let service: Loader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Loader],
    });

    service = TestBed.inject(Loader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* ================= INITIAL STATE ================= */

  it('should have default loading state as false', () => {
    expect(service.loading()).toBeFalse();
  });

  /* ================= SHOW ================= */

  it('should set loading to true when show is called', () => {
    service.show();

    expect(service.loading()).toBeTrue();
  });

  /* ================= HIDE ================= */

  it('should set loading to false when hide is called', () => {
    service.show();

    expect(service.loading()).toBeTrue();

    service.hide();

    expect(service.loading()).toBeFalse();
  });
});
