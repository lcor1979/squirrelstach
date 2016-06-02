import { Component, OnInit } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Nav, AuthService }   from './shared/index';
import { HomeComponent }   from './home/index';
import { ListComponent }   from './list/index'; 
import { DetailsComponent }   from './details/index'; 



	@Component({
		moduleId: module.id,
		selector: 'sqs-app',
		templateUrl: 'app.component.html',
		directives: [Nav, ROUTER_DIRECTIVES],
		providers: [AuthService]
	})
	@RouteConfig([
		{ path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
		{ path: '/list', name: 'List', component: ListComponent },
		{ path: '/details', name: 'Details', component: DetailsComponent }
	]) 
	export class AppComponent implements OnInit { 
		
		constructor(private authService: AuthService) {
			
		}

		ngOnInit() {
			this.authService.signIn();
		}
	}