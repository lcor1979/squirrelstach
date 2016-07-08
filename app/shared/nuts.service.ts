import { Injectable, NgZone } from '@angular/core';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from './model';
import { AuthService, User }   from './index';

import * as s from 'underscore.string';

declare var firebase: any;

@Injectable()
export class NutsService {
	static DEFAULT_USER_DATA = {
		nuts: {},
		categories: {}
	};

	static DEFAULT_SETTINGS:Settings = {
		language: 'en'
	};

	private authSubscription;
	private userRootReference;

	private settingsReference;
	private settingsDescriptor: DataDescriptor;

	private categoriesReference;
	private categoriesDescriptor: DataDescriptor;

	private nutsReference;
	private nutsListDescriptor: DataDescriptor;

	@SessionStorage('squirrelstash/nuts/searchFilter') filter: SearchFilter = {
		searchValue: "",
		category: null
	};

	currentUserId: string;

	private allNuts: Nut[] = [];
	private activeNuts: Nut[] = [];
	nuts: Nut[] = [];

	categories: String[] = [];

	@SessionStorage('squirrelstash/settings') settings:Settings = NutsService.DEFAULT_SETTINGS;

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
				this.userRootReference = this.getReference('stashes/' + this.currentUserId);

				// Setup profile
				this.userRootReference.child('profile').set({
					email: user.email,
					displayName: user.displayName
				});

				// Setup settings
				this.settingsReference = this.getReference('stashes/' + this.currentUserId + '/settings');

				// Initialize user settings if not existing
				this.settingsReference.once("value", (settings) => {
  					if (!settings.exists()) {
						settings.ref.set(NutsService.DEFAULT_SETTINGS);
  					}
				}).then(() => {
					this.settingsDescriptor = this.setupDataDescriptorReference(this.settingsDescriptor, 'value', this.settingsReference);
					this.settingsDescriptor.on(this.settingsDescriptor.dataReference.orderByKey(), (settings) => this.loadSettings(settings));
				})
				.catch((error) => { console.log("Error initializing stash: " + error); } );

				// Setup categories
				this.categoriesReference = this.getReference('stashes/' + this.currentUserId + '/data/categories');
				this.categoriesDescriptor = this.setupDataDescriptorReference(this.categoriesDescriptor, 'value', this.categoriesReference);
				this.categoriesDescriptor.on(this.categoriesDescriptor.dataReference.orderByKey(), (categories) => this.loadCategories(categories));

				// Setup nuts
				this.nutsReference = this.getReference('stashes/' + this.currentUserId + '/data/nuts');
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
					this.activeNuts = [];
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
		this.allNuts = [];
		this.activeNuts = [];
		data.forEach((nut) => {
			var nutValue: Nut = nut.val();
			nutValue.id = nut.getKey();
			this.allNuts.push(nutValue);

			// If quantity is greate than 0, add to active nuts
			if (nutValue.quantity.amount > 0) {
				this.activeNuts.push(nutValue);
			}
		});
		this.nuts = this.filterData(this.activeNuts, this.filter);
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

	private filterData(allNuts: Nut[], filter: SearchFilter, allIfNoFilter: boolean = true): Nut[] {
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
		else if (!allIfNoFilter) {
			return [];
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

	getNutsMatchingLabel(label:string) {
		return this.filterData(this.allNuts, <SearchFilter>{ searchValue: label }, false);
	}

	removeCategory() {
		this.filter.category = null;
		this.nuts = this.filterData(this.activeNuts, this.filter);
	}

	setCategory(category: string) {
		this.filter.category = category;
		this.nuts = this.filterData(this.activeNuts, this.filter);
	}

	hasCategory(): boolean {
		return this.filter.category != null;
	}

	searchValueChanged(newValue: string) {
		this.filter.searchValue = s.trim(newValue);
		this.nuts = this.filterData(this.activeNuts, this.filter);
	}

	getNutById(id, callback: (nut:Nut) => void) {
		if (this.nutsReference) {
			this.nutsReference.child(id).once('value', data => {
				var nutValue: Nut = data.val();

				if (nutValue) {
					nutValue.id = data.getKey();
				}
				callback(nutValue);
			});
		}
	}

	updateNutQuantity(id, quantity: number, callback?: (newQuantity: number, error?: string) => void) {
		if (this.nutsReference) {
			this.nutsReference.child(id + "/quantity/amount").set(quantity)
				.then(() =>	{ if (callback) { callback(quantity) }})
				.catch((error) => { if (callback) { callback(quantity, error) }});
		}

	}

	updateSettings(callback?: (updatedSettings: Settings, error?: string) => void) {
		if (this.settingsReference) {
			this.settingsReference.set(this.settings)
				.then(() => { if (callback) { callback(this.settings) }})
				.catch((error) => { if (callback) { callback(this.settings, error) }});
		}
	}

	deleteNut(nutId, callback?: (nutId: string, error?: string) => void) {
		if (this.userRootReference && this.nutsReference) {

			this.userRootReference.child("data").transaction(function(userData) {
				if (userData) {
					try {
						var previousCategory: string = null;

						// Remove nut
						if (userData.nuts) {
							var nut:Nut = userData.nuts[nutId];

							if (nut) {
								previousCategory = nut.category;
								delete userData.nuts[nutId];								
							}
						}

						// Initialize categories
						if (!userData.categories) {
							userData.categories = {};
						}

						// Update category
						if (previousCategory) {
							if (userData.categories[previousCategory]) {
								userData.categories[previousCategory]--;
								if (userData.categories[previousCategory] <= 0) {
									delete userData.categories[previousCategory];
								}
							}							
						}

						return userData;
					} catch (error) {
						console.log("Error during delete nut transaction: " + error);
						return;
					}
				}
				else {
					return null;
				}
			}, (error, commited, snapshot) => {
				if (error) {
					if (callback) {
						callback(nutId, error);
					}
				}
				else if (commited) {
					if (callback) {
						callback(nutId);
					}
				}
			}, false);
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

			this.userRootReference.child("data").transaction(function(userData) {
				if (!userData) {
					userData = NutsService.DEFAULT_USER_DATA;
				}

					try {
						// Initialize nuts
						if (!userData.nuts) {
							userData.nuts = {};
						}
						// Initialize categories
						if (!userData.categories) {
							userData.categories = {};
						}

						// Check previous category
						var previousCategory: string = null;

						if (userData.nuts[nut.id]) {
							previousCategory = userData.nuts[nut.id].category;
						} 

						// Update data
						userData.nuts[nut.id] = data;

						// Update category
						if (previousCategory) {
							if (userData.categories[previousCategory]) {
								userData.categories[previousCategory]--;
								if (userData.categories[previousCategory] <= 0) {
									delete userData.categories[previousCategory];
								}
							}							
						}

						if (!userData.categories[nut.category]) {
							userData.categories[nut.category] = 1;
						}
						else {
							userData.categories[nut.category]++;
						}

						return userData;
					} catch (error) {
						console.log("Error during save nut transaction: " + error);
						return;
					}
		
			}, (error, commited, snapshot) => {
				if (error) {
					if (callback) {
						callback(nut, error);
					}
				}
				else if (commited) {
					if (callback) {
						callback(nut);
					}
				}
			}, false);
		}
	}
}


export interface SearchFilter {
	searchValue: string;
	category: string;
}

export interface Settings {
	language: string;
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
