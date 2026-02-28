import { Component, inject, input, signal } from '@angular/core';
import { Statistic } from '../../../core/interface/istatistics';

@Component({
  selector: 'app-progress-card',
  imports: [],
  templateUrl: './progress-card.html',
  styleUrl: './progress-card.css',
})
export class ProgressCard {
  item = input.required<Statistic>();
}
