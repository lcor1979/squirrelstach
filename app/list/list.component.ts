import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { AuthService, FirebaseDBService }   from '../shared/index';

import * as s from 'underscore.string';

declare var firebase: any;


@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
    providers: [FirebaseDBService],
	templateUrl: 'list.component.html',
	styleUrls: ['list.component.css']
})
export class ListComponent implements OnInit { 

	private nutsReference;
	private nutsListener;

	@SessionStorage('list/searchFilter') filter: SearchFilter = {
		searchValue: "",
		category: ""
	};

	allNuts:Nut[] = [];
	nuts: Nut[] = [];
	selectedNut:Nut;

	constructor(private authService: AuthService, private dbService: FirebaseDBService) {			
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

	setupData() {
		// Remove existing data handler
		this.closeData();

		// Get data reference
		this.openDataReference();

		// Add order clause
		this.nutsListener = this.nutsReference.orderByChild('name').on('value', (data) => this.addNuts(data));
	}

	private openDataReference() {
		if (!this.nutsReference) {
			this.nutsReference = this.dbService.getRef('staches/' + this.authService.user.uid + '/nuts');
		}
	}
	
	private closeData() {
		if (this.nutsReference && this.nutsListener) {
			this.nutsReference.off('value', this.nutsListener);
		}
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
