import { Injectable, NgZone } from '@angular/core';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from './model';
import { AuthService, User, FirebaseDBService }   from './index';

import * as s from 'underscore.string';

@Injectable()
export class NutsService {

	private authSubscription;
	private nutsListDescriptor: DataDescriptor;

	@SessionStorage('nut/list/searchFilter') filter: SearchFilter = {
		searchValue: "",
		category: null
	};

	currentUserId: string;

	allNuts: Nut[] = [];
	nuts: Nut[] = [];

	constructor(protected authService: AuthService, protected dbService: FirebaseDBService,
		zone: NgZone) {
		this.authSubscription = this.authService.addUserLoggedHandler((user) => zone.run(() => this.userChanged(user)));
    }

    userChanged(user:User) {
    	if (!user || (this.currentUserId != user.uid)) {
    		if (user) {
				this.currentUserId = user.uid;
				this.nutsListDescriptor = this.setupDataDescriptorReference(this.nutsListDescriptor, 'value','staches/' + this.currentUserId + '/nuts');
				this.nutsListDescriptor.on(this.nutsListDescriptor.dataReference.orderByChild('name'), (data) => this.addNuts(data));
    		}
    		else {
				this.currentUserId = null;
				if (this.nutsListDescriptor) {
					this.nutsListDescriptor.close();
					this.allNuts = [];
					this.nuts = [];
				}
    		}

    	}
    }

    setupDataDescriptorReference(dataDescriptor: DataDescriptor, listenerType:string, reference: string): DataDescriptor {
		if (dataDescriptor) {
			dataDescriptor.close();
		}
		else {
			dataDescriptor = new DataDescriptor();
		}

		dataDescriptor.dataListenerType = listenerType;
		dataDescriptor.dataReference = this.dbService.getRef(reference);

		return dataDescriptor;
    }

	close() {
		if (this.authSubscription) {
			this.authService.removeUserLoggedHandler(this.authSubscription);
		}		
		if (this.nutsListDescriptor) {
			this.nutsListDescriptor.close();
		}
	}

	removeCategory() {
		this.filter.category = null;
		this.nuts = this.filterData(this.allNuts, this.filter);
	}

	setCategory(category: string) {
		this.filter.category = category;
		this.nuts = this.filterData(this.allNuts, this.filter);
	}

	hasCategory(): boolean {
		return this.filter.category != null;
	}

	private addNuts(data) {
		var self = this;
		self.allNuts = [];
		data.forEach(function(nut) {
			var nutValue: Nut = nut.val();
			nutValue.id = nut.getKey();
			self.allNuts.push(nutValue);
		});
		self.nuts = self.filterData(self.allNuts, self.filter);
	}

	searchValueChanged(newValue: string) {
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

		return toFilter.filter(function(nut: Nut) {
			return (category ? (nut.category == category) : true) && (regexp ? regexp.test(nut.name) : true);
		});
	}
}


export interface SearchFilter {
	searchValue: string;
	category: string;
}

class DataDescriptor {
	dataReference: any;
	dataListener: any;
	dataListenerType: string;

	on(query, callback) {
		if (this.dataReference) {
			this.dataListener = query.on(this.dataListenerType, data => callback(data));
		}
	}

	close() {
		if (this.dataReference && this.dataListener) {
			this.dataReference.off(this.dataListenerType, this.dataListener);
			this.dataReference = null;
			this.dataListener = null;
			this.dataListenerType = null;
		}
	}
}
