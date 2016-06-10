import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteParams } from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { NutsService }   from '../shared/index';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
	templateUrl: 'details.component.html',
	styleUrls: ['details.component.css']
})
export class DetailsComponent implements OnInit { 

	nutId;
	nut: Nut;

	constructor(protected nutsService: NutsService,
		routeParams: RouteParams) {
		this.nut = new Nut();
		this.nutId = routeParams.get("id");
    }

    ngOnInit() {
		this.nutsService.getNutById(this.nutId, (nut) => this.nutLoaded(nut));
    }

    private nutLoaded(nut:Nut) {
		this.nut = nut;
    }

}
