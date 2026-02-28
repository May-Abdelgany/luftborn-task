import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Error {
  private _error = signal<string | null>(null);
  error = this._error.asReadonly();

  show(message: string) {
    this._error.set(message);

    setTimeout(() => this._error.set(null), 4000);
  }

  clear() {
    this._error.set(null);
  }
}
