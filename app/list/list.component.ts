import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { AuthService, FirebaseDBService }   from '../shared/index';

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

	searchValue: string;
	category: string;
	allNuts = [];
	nuts = [];
	selectedNut;

	constructor(private authService: AuthService, private dbService: FirebaseDBService) {
    }

	removeCategory() {
		this.category = null;
		this.filterData();
	}

	setCategory(category:string) {
		this.category = category;
		this.filterData();
	}

	hasCategory():boolean {
		return this.category != null;
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
		self.filterData();
	}

	searchValueChanged(newValue:string) {
		this.searchValue = newValue;
		this.filterData();
	}

	private filterData() {
		var toFilter = this.allNuts;
		if (!toFilter) {
			toFilter = [];
		}

		// Filter data on category and search value
		var category = this.category;
		
		var regexp: RegExp = undefined;
		if (this.searchValue) {
			regexp = new RegExp(this.searchValue, 'i');
		}
		
		this.nuts = toFilter.filter(function(nut) {
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
