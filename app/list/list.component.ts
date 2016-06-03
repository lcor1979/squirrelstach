import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { AuthService, FirebaseDBService }   from '../shared/index';
import { FilterNutsPipe }   from './filter-nuts.pipe';

declare var firebase: any;


@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
    providers: [FirebaseDBService],
	templateUrl: 'list.component.html',
	styleUrls: ['list.component.css'],
	pipes: [FilterNutsPipe]
})
export class ListComponent implements OnInit { 

	private nutsReference;
	private nutsListener;

	searchValue: string;
	category: string;
	nuts = [];
	selectedNut;

	constructor(private authService: AuthService, private dbService: FirebaseDBService) {
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

	setupData() {
		this.nutsReference = this.dbService.getRef('staches/' + this.authService.user.uid + '/nuts'); 
		this.nutsListener = this.nutsReference.orderByChild('name').on('value', (data) => this.addNuts(data));
	}

	private addNuts(data) {
		var self = this;
		self.nuts = [];
		data.forEach(function(nut) {
			self.nuts.push(nut.val());
		});
	}

	ngOnInit() {
		this.setupData();
	}

	ngOnDestroy() {
		if (this.nutsReference && this.nutsListener) {
			this.nutsReference.off(this.nutsListener);
		}
	}

	onSelect(nut) { this.selectedNut = nut; }

}
