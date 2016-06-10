import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { NutsService, SearchFilter }   from '../shared/index';

import * as s from 'underscore.string';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
	templateUrl: 'list.component.html',
	styleUrls: ['list.component.css']
})
export class ListComponent extends implements OnInit, OnDestroy { 

	selectedNut:Nut;

	constructor(protected nutsService: NutsService) {		
    }

	removeCategory() {
		this.nutsService.removeCategory();
	}

	setCategory(category:string) {
		this.nutsService.setCategory(category);
	}

	hasCategory():boolean {
		return this.nutsService.hasCategory();
	}

	get filter(): SearchFilter {
		return this.nutsService.filter;
	}

	get nuts(): Nut[] {
		return this.nutsService.nuts;
	}

	searchValueChanged(newValue:string) {
		this.nutsService.searchValueChanged(newValue);
	}

	ngOnInit() {
	}

	ngOnDestroy() {
	}

	onSelect(nut) { this.selectedNut = nut; }

}
