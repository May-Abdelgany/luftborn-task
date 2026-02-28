import { Component, inject } from '@angular/core';
import * as loaderServices from '../../services/loader/loader';
@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader {
  loader = inject(loaderServices.Loader);
}
