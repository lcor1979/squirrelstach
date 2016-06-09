import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { AuthService, FirebaseDBService, DataHandler }   from '../shared/index';

import * as s from 'underscore.string';

declare var firebase: any;

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
    providers: [FirebaseDBService],
	templateUrl: 'list.component.html',
	styleUrls: ['list.component.css']
})
export class ListComponent extends DataHandler implements OnInit { 

	@SessionStorage('list/searchFilter') filter: SearchFilter = {
		searchValue: "",
		category: ""
	};

	allNuts:Nut[] = [];
	nuts: Nut[] = [];
	selectedNut:Nut;

	constructor(private authService: AuthService, protected dbService: FirebaseDBService) {		
		super(dbService);	
    }

	removeCategory() {
		this.filter.category = null;
		this.nuts = this.filterData(this.allNuts, this.filter);
	}

	setCategory(category:string) {
		this.filter.category = category;
		this.nuts = this.filterData(this.allNuts, this.filter);
	}

	hasCategory():boolean {
		return this.filter.category != null;
	}

	getDataReference(): string {
		return 'staches/' + this.authService.user.uid + '/nuts';
	}

	getDataListenerType(): string {
		return "value";
	}

	setupDataReference(dataReference): any {
		return dataReference.orderByChild('name').on(this.getDataListenerType(), (data) => this.addNuts(data));
	}

	private addNuts(data) {
		var self = this;
		self.allNuts = [];
		data.forEach(function(nut) {
			self.allNuts.push(nut.val());
		});
		self.nuts = self.filterData(self.allNuts, self.filter);
	}

	searchValueChanged(newValue:string) {
		this.filter.searchValue = s.trim(newValue);
		this.nuts = this.filterData(this.allNuts, this.filter);
	}

	private filterData(allNuts: Nut[], filter: SearchFilter): Nut[] {
		var toFilter = allNuts;
		if (!toFilter) {
			toFilter = [];
		}

		// Filter data on category and search value
		var category = filter.category;
		
		var regexp: RegExp = undefined;
		if (filter.searchValue) {
			regexp = new RegExp(filter.searchValue, 'i');
		}
		
		return toFilter.filter(function(nut:Nut) {
			return (category ? (nut.category == category) : true) && (regexp ? regexp.test(nut.name) : true);
		});
	}

	ngOnInit() {
		this.setupData();
	}

	ngOnDestroy() {
		this.closeData();
	}

	onSelect(nut) { this.selectedNut = nut; }

}


interface SearchFilter {
	searchValue: string;
	category: string;	
}
