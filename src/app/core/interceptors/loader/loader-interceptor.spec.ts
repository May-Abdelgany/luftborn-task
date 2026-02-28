import { loaderInterceptor } from './loader-interceptor';
import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Loader } from '../../services/loader/loader';
import { of, throwError } from 'rxjs';

describe('Loader Interceptor', () => {

  const loaderMock = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Loader,
          useValue: loaderMock
        }
      ]
    });
  });

  function executeInterceptor(response$: any = of({})) {
    const req = new HttpRequest('GET', '/test');

    const next: HttpHandlerFn = () => response$;

    return TestBed.runInInjectionContext(() =>
      loaderInterceptor(req, next).toPromise()
    );
  }

  it('should show loader when request starts', async () => {
    await executeInterceptor();

    expect(loaderMock.show).toHaveBeenCalled();
  });

  it('should hide loader when request completes', async () => {
    await executeInterceptor();

    expect(loaderMock.hide).toHaveBeenCalled();
  });

  it('should hide loader even when request fails', async () => {
    const errorResponse = throwError(() => new Error('Request failed'));

    try {
      await executeInterceptor(errorResponse);
    } catch {}

    expect(loaderMock.show).toHaveBeenCalled();
    expect(loaderMock.hide).toHaveBeenCalled();
  });

});
