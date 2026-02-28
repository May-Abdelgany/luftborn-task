import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController
} from '@angular/common/http/testing';
import { loaderInterceptor } from './loader-interceptor';
import { Loader } from '../../services/loader/loader';

describe('loaderInterceptor (Functional)', () => {

  let http: HttpClient;
  let httpMock: HttpTestingController;
  let loaderSpy: jasmine.SpyObj<Loader>;

  beforeEach(() => {

    loaderSpy = jasmine.createSpyObj('Loader', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Loader, useValue: loaderSpy },

        // ✅ الطريقة الصحيحة مع Functional Interceptor
        provideHttpClient(
          withInterceptors([loaderInterceptor])
        ),

        provideHttpClientTesting()
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call loader show when request starts', () => {

    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    expect(loaderSpy.show).toHaveBeenCalled();

    req.flush({});
  });

  it('should call loader hide when request completes', () => {

    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    req.flush({});

    expect(loaderSpy.hide).toHaveBeenCalled();
  });

  it('should call both show and hide', () => {

    http.get('/test').subscribe();

    const req = httpMock.expectOne('/test');

    expect(loaderSpy.show).toHaveBeenCalled();

    req.flush({});

    expect(loaderSpy.hide).toHaveBeenCalled();
  });

});
