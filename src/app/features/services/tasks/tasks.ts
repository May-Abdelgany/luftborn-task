import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  searchText = new BehaviorSubject<string>('');
}
