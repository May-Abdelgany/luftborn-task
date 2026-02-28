import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Error } from '../../services/error/error';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Something went wrong';

      if (error.status === 0) {
        message = 'Network error. Please check your connection.';
      } else if (error.status === 400) {
        message = error.error?.message || 'Bad request.';
      } else if (error.status === 401) {
        message = 'Unauthorized access.';
      } else if (error.status === 403) {
        message = 'Forbidden request.';
      } else if (error.status === 404) {
        message = 'Resource not found.';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }

      toastr.error(message, 'Error');

      return throwError(() => error);
    }),
  );
};
