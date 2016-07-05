import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { I18nService, I18nPipe } from '../i18n/index';
import { Nut } from '../shared/model';
import { NutsService, SearchFilter, NavService, NavigationItem }   from '../shared/index';

import * as s from 'underscore.string';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
	templateUrl: 'add.component.html',
	styleUrls: ['add.component.css'],
	pipes: [I18nPipe]
})
export class AddComponent implements OnInit, OnDestroy { 

	filter: SearchFilter;
	nuts: Nut[] = [];

	constructor(private nutsService: NutsService,
				private navService: NavService,
				private i18n: I18nService) {		
    }

	searchValueChanged(newValue:string) {
		this.filter.searchValue = newValue;
		this.nuts = this.nutsService.filterData(this.nutsService.allNuts, this.filter, false);
	}

	displayAddRow(): boolean {
		return this.nuts.length > 0 && (this.nuts.length > 1 || s.capitalize(this.nuts[0].name) != s.capitalize(this.filter.searchValue));
	}

	ngOnInit() {
		this.filter = {
			searchValue: "",
			category: null
		};
	}

	ngOnDestroy() {
	}

}
