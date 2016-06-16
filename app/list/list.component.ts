import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { NutsService, SearchFilter, NavService, NavigationItem }   from '../shared/index';

import * as s from 'underscore.string';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
	templateUrl: 'list.component.html',
	styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit, OnDestroy { 

	selectedNut:Nut;

	constructor(private nutsService: NutsService,
				private navService: NavService) {		
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
		this.navService.changeNavigationItems([ 
		new NavigationItem(this, 'add', ['Add'])
		]);
	}

	ngOnDestroy() {
	}

	onSelect(nut) { this.selectedNut = nut; }

}
