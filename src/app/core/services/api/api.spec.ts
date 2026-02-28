import { TestBed } from '@angular/core/testing';
import { Api } from './api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('Api Service', () => {
  let service: Api;
  let httpMock: HttpTestingController;

  const baseUrl = '';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Api],
    });

    service = TestBed.inject(Api);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /* ================= GET ================= */

  it('should perform GET request', () => {
    const mockResponse = { data: 'test' };

    service.get('test-endpoint').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test-endpoint`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  /* ================= POST ================= */

  it('should perform POST request', () => {
    const body = { name: 'test' };
    const mockResponse = { success: true };

    service.post('test-endpoint', body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test-endpoint`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

  /* ================= PUT ================= */

  it('should perform PUT request', () => {
    const body = { name: 'updated' };
    const mockResponse = { success: true };

    service.put('test-endpoint', body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test-endpoint`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

  /* ================= PATCH ================= */

  it('should perform PATCH request', () => {
    const body = { name: 'patched' };
    const mockResponse = { success: true };

    service.patch('test-endpoint', body).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test-endpoint`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

  /* ================= DELETE ================= */

  it('should perform DELETE request', () => {
    const mockResponse = { success: true };

    service.delete('test-endpoint').subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/test-endpoint`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });
});
