import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';


import { loaderInterceptor } from './core/interceptors/loader/loader-interceptor';
import { errorInterceptor } from './core/interceptors/error/error-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([loaderInterceptor, errorInterceptor])),
    provideAnimations(),
    provideToastr(),
    provideZonelessChangeDetection(),

    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
    }),
    provideRouter(routes, withViewTransitions(),
      withHashLocation(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })),
  ],
};
