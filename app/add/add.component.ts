import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import {MaterializeDirective} from "angular2-materialize";

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { NutsService }   from '../shared/index';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
	templateUrl: 'add.component.html',
	styleUrls: ['add.component.css']
})
export class AddComponent implements OnInit { 

	constructor(protected nutsService: NutsService) {
    }

    ngOnInit() {
    }

}
