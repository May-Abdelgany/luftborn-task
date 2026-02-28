import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Error } from './error';

describe('Error Service', () => {
  let service: Error;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Error],
    });

    service = TestBed.inject(Error);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* ================= SHOW ERROR ================= */

  it('should show error message', () => {
    service.show('Test Error');

    expect(service.error()).toBe('Test Error');
  });

  /* ================= AUTO CLEAR AFTER 4s ================= */

  it('should clear error after 4 seconds', fakeAsync(() => {
    service.show('Test Error');

    expect(service.error()).toBe('Test Error');

    tick(4000);

    expect(service.error()).toBeNull();
  }));

  /* ================= MANUAL CLEAR ================= */

  it('should clear error manually', () => {
    service.show('Test Error');

    expect(service.error()).toBe('Test Error');

    service.clear();

    expect(service.error()).toBeNull();
  });
});
