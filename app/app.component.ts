import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import {LocalStorageService} from "angular2-localstorage/LocalStorageEmitter";

import { Nav, NavService, AuthService, NutsService, User }   from './shared/index';
import { AddComponent }   from './add/index';
import { ListComponent }   from './list/index'; 
import { DetailsComponent }   from './details/index'; 
import { EditComponent }   from './edit/index'; 



	@Component({
		moduleId: module.id,
		selector: 'sqs-app',
		templateUrl: 'app.component.html',
		styleUrls: ['app.component.css'],
		directives: [Nav, ROUTER_DIRECTIVES],
		providers: [LocalStorageService]
	})
	@RouteConfig([
		{ path: '/', name: 'Home', component: ListComponent, useAsDefault: true },
		{ path: '/add', name: 'Add', component: AddComponent },
		{ path: '/details/:id', name: 'Details', component: DetailsComponent },
		{ path: '/edit/:id', name: 'Edit', component: EditComponent }
	]) 
	export class AppComponent implements OnInit, OnDestroy { 

		subscription; 
		userIsLogged: boolean;
		zone: NgZone;

		constructor(
			private storageService: LocalStorageService, 
			private authService: AuthService, 
			private nutsService: NutsService,
			private navService: NavService,
			zone: NgZone) {
			this.userIsLogged = false;
			this.zone = zone;
		}

		ngOnInit() {
			this.subscription = this.authService.addUserLoggedHandler((user) => this.zone.run(() => this.updateUserStatus(user)));
			this.authService.startAuthentication();
		}

		private updateUserStatus(user: User) {			
			if (user) {
				this.userIsLogged = true;
			}
			else {
				this.userIsLogged = false;
			}
		}

		ngOnDestroy() {
			if (this.subscription) {
				this.authService.removeUserLoggedHandler(this.subscription);
			}
			if (this.nutsService) {
				this.nutsService.close();
			}
		}
	}