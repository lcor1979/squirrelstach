import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import {LocalStorageService} from "angular2-localstorage/LocalStorageEmitter";

import { Nav, AuthService }   from './shared/index';
import { HomeComponent }   from './home/index';
import { ListComponent }   from './list/index'; 
import { DetailsComponent }   from './details/index'; 



	@Component({
		moduleId: module.id,
		selector: 'sqs-app',
		templateUrl: 'app.component.html',
		styleUrls: ['app.component.css'],
		directives: [Nav, ROUTER_DIRECTIVES],
		providers: [LocalStorageService, AuthService]
	})
	@RouteConfig([
		{ path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
		{ path: '/list', name: 'List', component: ListComponent },
		{ path: '/details', name: 'Details', component: DetailsComponent }
	]) 
	export class AppComponent implements OnInit, OnDestroy { 

		subscription; 
		userIsLogged: boolean;
		zone: NgZone;

		constructor(
			private storageService: LocalStorageService, 
			private authService: AuthService, 
			zone: NgZone) {
			this.userIsLogged = false;
			this.zone = zone;
		}

		ngOnInit() {
			this.subscription = this.authService.addUserLoggedHandler((user) => this.zone.run(() => this.updateUserStatus(user)));
			this.authService.startAuthentication();
		}

		private updateUserStatus(user) {
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
		}
	}