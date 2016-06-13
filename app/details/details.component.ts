import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteParams } from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { NutsService, NavService, NavigationItem }   from '../shared/index';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
	templateUrl: 'details.component.html',
	styleUrls: ['details.component.css']
})
export class DetailsComponent implements OnInit { 

	nutId;
	nut: Nut;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		routeParams: RouteParams) {
		this.nut = new Nut();
		this.nutId = routeParams.get("id");
    }

    ngOnInit() {
		this.navService.changeNavigationItems([
			new NavigationItem(this, 'cancel', 'Home'),
			new NavigationItem(this, 'edit', null, this.edit),
			new NavigationItem(this, 'delete', null, this.delete)
		]);
		this.nutsService.getNutById(this.nutId, (nut) => this.nutLoaded(nut));
    }

    edit(): void {
		alert('edit');
    }

    delete(): void {
		alert('delete');
    }

    private nutLoaded(nut: Nut) {
		this.nut = nut;
    }

}
