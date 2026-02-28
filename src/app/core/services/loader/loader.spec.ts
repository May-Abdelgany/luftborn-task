import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { loaderInterceptor } from '../../interceptors/loader/loader-interceptor';
import { Loader } from './loader';

describe('LoaderInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let loaderSpy: jasmine.SpyObj<Loader>;

  beforeEach(() => {
    loaderSpy = jasmine.createSpyObj('Loader', ['show', 'hide']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Loader, useValue: loaderSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: loaderInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call loader show and hide', () => {
    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    expect(loaderSpy.show).toHaveBeenCalled();

    req.flush({}); 

    expect(loaderSpy.hide).toHaveBeenCalled();
  });
});
