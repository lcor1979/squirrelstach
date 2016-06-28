import { bootstrap }    from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { provide }           from '@angular/core';
import { LocationStrategy,
	PathLocationStrategy  } from '@angular/common';

import { AppComponent } from './app.component';
import { I18nService } from './i18n/index';
import { AuthService, FirebaseDBService, NutsService, NavService } from './shared/index';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy,
	  { useClass: PathLocationStrategy }),
  I18nService,
  AuthService,
  FirebaseDBService,
  NutsService,
  NavService
]);