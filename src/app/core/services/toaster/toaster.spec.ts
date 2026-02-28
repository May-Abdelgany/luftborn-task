import { TestBed } from '@angular/core/testing';
import { Toaster } from './toaster';
import { ToastrService } from 'ngx-toastr';

describe('Toaster Service', () => {
  let service: Toaster;

  const toastrMock = {
    success: jasmine.createSpy('success')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Toaster,
        {
          provide: ToastrService,
          useValue: toastrMock
        }
      ]
    });

    service = TestBed.inject(Toaster);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /* ================= SUCCESS TOAST ================= */

  it('should call toastr success with correct parameters', () => {
    const message1 = 'Operation successful';
    const message2 = 'Success';

    service.showSuccess(message1, message2);

    expect(toastrMock.success).toHaveBeenCalledWith(
      message1,
      message2
    );
  });

});
