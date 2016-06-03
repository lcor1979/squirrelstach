import { Component, OnInit, NgZone } from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';

import { AuthService, NutsService }   from '../shared/index';
import { FilterNutsPipe }   from './filter-nuts.pipe';

declare var firebase: any;


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
	nuts = [];
	selectedNut;

	constructor(private authService: AuthService, private nutsService: NutsService, private zone: NgZone) {
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
		firebase.database().ref('staches/' + this.authService.user.uid + '/nuts').orderByChild('name').on('value', (data) => this.addNuts(data));
	}

	private addNuts(data) {
		var self = this;
		self.nuts = [];
		data.forEach(function(nut) {
			self.nuts.push(nut.val());
		});
	}

	ngOnInit() {
		this.getNuts();
	}
	onSelect(nut) { this.selectedNut = nut; }

}
