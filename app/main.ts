import { bootstrap }    from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { provide }           from '@angular/core';
import { LocationStrategy,
	PathLocationStrategy  } from '@angular/common';

import { AppComponent } from './app.component';
import { AuthService, FirebaseDBService, NutsService } from './shared/index';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy,
	  { useClass: PathLocationStrategy }),
  AuthService,
  FirebaseDBService,
  NutsService
]);