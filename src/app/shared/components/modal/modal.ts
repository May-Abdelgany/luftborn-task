import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  imports: [TranslatePipe],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  deletedTask = output<string>();
  id = input.required<string>();
  buttonName = input.required<string>();
  action(id: string) {
    this.deletedTask.emit(id);
  }
}
