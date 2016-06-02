import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { NutsService }   from '../shared/index';
import { FilterNutsPipe }   from './filter-nuts.pipe';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
    providers: [NutsService],
	templateUrl: 'list.component.html',
	styleUrls: ['list.component.css'],
	pipes: [FilterNutsPipe]
})
export class ListComponent implements OnInit { 

	searchValue: string;
	category: string;
	nuts;
	selectedNut;

	constructor(private nutsService: NutsService) {
    }

	removeCategory() {
		this.category = null;
	}

	setCategory(category:string) {
		this.category = category;
	}

	hasCategory():boolean {
		return this.category != null;
	}

	getNuts() {
		this.nutsService.getNuts().then(nuts => this.nuts = nuts);
	}
	ngOnInit() {
		this.getNuts();
	}
	onSelect(nut) { this.selectedNut = nut; }

}
