import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class Toaster {
  toastr = inject(ToastrService);

  showSuccess(message1: string, message2: string) {
    this.toastr.success(message1, message2);
  }
}
