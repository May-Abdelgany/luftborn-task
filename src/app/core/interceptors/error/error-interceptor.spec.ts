import { errorInterceptor } from './error-interceptor';
import { HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('Error Interceptor', () => {
  const toastrMock = {
    error: jasmine.createSpy('error'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ToastrService,
          useValue: toastrMock,
        },
      ],
    });
  });

  function createHttpError(status: number, message?: string) {
    return new HttpErrorResponse({
      status,
      error: { message },
    });
  }

  function executeInterceptor(error?: HttpErrorResponse) {
    const req = new HttpRequest('GET', '/test');

    const next: HttpHandlerFn = () => {
      if (error) {
        return throwError(() => error);
      }
      return of({} as any);
    };

    return TestBed.runInInjectionContext(() => errorInterceptor(req, next)).toPromise();
  }

  it('should pass request when no error occurs', async () => {
    await expectAsync(executeInterceptor()).toBeResolved();
  });

  it('should handle network error (status 0)', async () => {
    const error = createHttpError(0);

    await executeInterceptor(error).catch(() => {});

    expect(toastrMock.error).toHaveBeenCalledWith(
      'Network error. Please check your connection.',
      'Error',
    );
  });

  it('should handle bad request (400)', async () => {
    const error = createHttpError(400, 'Bad data');

    await executeInterceptor(error).catch(() => {});

    expect(toastrMock.error).toHaveBeenCalledWith('Bad data', 'Error');
  });

  it('should handle unauthorized (401)', async () => {
    const error = createHttpError(401);

    await executeInterceptor(error).catch(() => {});

    expect(toastrMock.error).toHaveBeenCalledWith('Unauthorized access.', 'Error');
  });

  it('should handle forbidden (403)', async () => {
    const error = createHttpError(403);

    await executeInterceptor(error).catch(() => {});

    expect(toastrMock.error).toHaveBeenCalledWith('Forbidden request.', 'Error');
  });

  it('should handle not found (404)', async () => {
    const error = createHttpError(404);

    await executeInterceptor(error).catch(() => {});

    expect(toastrMock.error).toHaveBeenCalledWith('Resource not found.', 'Error');
  });

  it('should handle server error (500+)', async () => {
    const error = createHttpError(500);

    await executeInterceptor(error).catch(() => {});

    expect(toastrMock.error).toHaveBeenCalledWith('Server error. Please try again later.', 'Error');
  });
});
