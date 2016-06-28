import { Injectable, NgZone } from '@angular/core';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from './model';
import { AuthService, User }   from './index';

import * as s from 'underscore.string';

declare var firebase: any;

@Injectable()
export class NutsService {
	static DEFAULT_SETTINGS = {
		language: NutsService.DEFAULT_LANGUAGE
	};

	private authSubscription;
	private userRootReference;

	private settingsReference;
	private settingsDescriptor: DataDescriptor;

	private categoriesReference;
	private categoriesDescriptor: DataDescriptor;

	private nutsReference;
	private nutsListDescriptor: DataDescriptor;

	@SessionStorage('squirrelstach/nuts/searchFilter') filter: SearchFilter = {
		searchValue: "",
		category: null
	};

	currentUserId: string;

	private allNuts: Nut[] = [];
	nuts: Nut[] = [];

	categories: String[] = [];

	@SessionStorage('squirrelstach/settings') settings = NutsService.DEFAULT_SETTINGS;

	constructor(private authService: AuthService,
		zone: NgZone) {
		this.authSubscription = this.authService.addUserLoggedHandler((user) => zone.run(() => this.userChanged(user)));
	}

	private getReference(path) {
		return firebase.database().ref(path);
	}

    private userChanged(user: User) {
    	if (!user || (this.currentUserId != user.uid)) {
    		if (user) {
				this.currentUserId = user.uid;
				this.userRootReference = this.getReference('staches/' + this.currentUserId);

				this.settingsReference = this.getReference('staches/' + this.currentUserId + '/settings');
				this.settingsDescriptor = this.setupDataDescriptorReference(this.settingsDescriptor, 'value', this.settingsReference);
				this.settingsDescriptor.on(this.settingsDescriptor.dataReference.orderByKey(), (settings) => this.loadSettings(settings));

				this.categoriesReference = this.getReference('staches/' + this.currentUserId + '/categories');
				this.categoriesDescriptor = this.setupDataDescriptorReference(this.categoriesDescriptor, 'value', this.categoriesReference);
				this.categoriesDescriptor.on(this.categoriesDescriptor.dataReference.orderByKey(), (categories) => this.loadCategories(categories));

				this.nutsReference = this.getReference('staches/' + this.currentUserId + '/nuts');
				this.nutsListDescriptor = this.setupDataDescriptorReference(this.nutsListDescriptor, 'value', this.nutsReference);
				this.nutsListDescriptor.on(this.nutsListDescriptor.dataReference.orderByChild('name'), (data) => this.addNuts(data));


    		}
    		else {
				this.currentUserId = null;
				this.userRootReference = null;

				this.settingsReference = null;
				if (this.settingsDescriptor) {
					this.settingsDescriptor.close();
					this.settings = NutsService.DEFAULT_SETTINGS;
				}

				this.categoriesReference = null;
				if (this.categoriesDescriptor) {
					this.categoriesDescriptor.close();
					this.categories = [];
				}

				this.nutsReference = null;
				if (this.nutsListDescriptor) {
					this.nutsListDescriptor.close();
					this.allNuts = [];
					this.nuts = [];
				}
    		}

    	}
    }

    private setupDataDescriptorReference(dataDescriptor: DataDescriptor, listenerType: string, reference): DataDescriptor {
		if (dataDescriptor) {
			dataDescriptor.close();
		}
		else {
			dataDescriptor = new DataDescriptor();
		}

		dataDescriptor.dataListenerType = listenerType;
		dataDescriptor.dataReference = reference;

		return dataDescriptor;
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

	private loadCategories(categories) {
		this.categories = [];
		categories.forEach((category) => {
			this.categories.push(category.key);
		});
	}

	private loadSettings(settings) {
		settings.forEach((setting) => {
			this.settings[setting.key] = setting.val();
		});
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

	searchValueChanged(newValue: string) {
		this.filter.searchValue = s.trim(newValue);
		this.nuts = this.filterData(this.allNuts, this.filter);
	}

	getNutById(id, callback: (nut:Nut) => void) {
		if (this.nutsReference) {
			this.nutsReference.child(id).once('value', data => {
				var nutValue: Nut = data.val();
				nutValue.id = data.getKey();
				callback(nutValue);
			});
		}
	}

	updateNutQuantity(id, quantity: number, callback?: (newQuantity: number, error?: string) => void) {
		if (this.nutsReference) {
			this.nutsReference.child(id + "/quantity/amount").set(quantity)
				.then(() =>	callback(quantity))
				.catch((error) => callback(quantity, error));
		}

	}

	saveNut(nut: Nut, callback?: (nut: Nut, error?: string) => void) {
		if (this.userRootReference && this.nutsReference) {
			var data = {
				name: nut.name,
				category: nut.category,
				quantity: {
					amount: nut.quantity.amount,
					unit: nut.quantity.unit
				},
				notes: nut.notes
			};

			if (!nut.id) {
				var newNutKey = this.nutsReference.push().key;
				nut.id = newNutKey;
			}

			this.userRootReference.transaction(function(userRoot) {
				if (userRoot) {
					try {
						// Check previous category
						var previousCategory = null;

						if (userRoot.nuts[nut.id]) {
							previousCategory = userRoot.nuts[nut.id].category;
						} 

						// Update data
						userRoot.nuts[nut.id] = data;

						// Update category
						if (userRoot.categories[previousCategory]) {
							userRoot.categories[previousCategory]--;
							if (userRoot.categories[previousCategory] <= 0) {
								delete userRoot.categories[previousCategory];
							}
						}

						if (!userRoot.categories[nut.category]) {
							userRoot.categories[nut.category] = 1;
						}
						else {
							userRoot.categories[nut.category]++;
						}

						return userRoot;
					} catch (error) {
						console.log("Error during save nut transaction: " + error);
						return;
					}
				}
				else {
					return null;
				}
			}, (error, commited, snapshot) => {
				if (error) {
					callback(nut, error);
				}
				else if (commited) {
					callback(nut);
				}
			}, false);
		}
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
			this.dataListener = null;
			this.dataListenerType = null;
		}
	}
}
