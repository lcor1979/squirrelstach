import { Injectable } from '@angular/core';

import { NutsService, UIService } from '../shared/index';


@Injectable()
export class I18nService {

	private cache:any = {};

	constructor(
		private nutsService: NutsService,
		private uiService: UIService) {
	}

	getMessage(key:string, language?:string):string {
		if (!language) {
			language = this.language;
		}


		var value:string = MESSAGES[language][key];

		if (!value) {
			value = '!!' + key + '!!';
		}

		return value;
	}

	private putInCache(key:string, language:string, value:any): void {
		if (!this.cache[key]) {
			this.cache[key] = {};
		}
		this.cache[key][language] = value;
	}	

	private getFromCache(key:string, language:string): any {
		if (this.cache[key]) {
			return this.cache[key][language];
		}

		return null;
	}

	get units(): Translation[] {
		var translations:Translation[] = this.getFromCache("units", this.language);

		if (! translations) {
			translations = [];
			var units = UNITS[this.language];
			for (let key in units) {
	      		translations.push(new Translation(key, units[key]));
	    	}			

	    	this.putInCache("units", this.language, translations);
		}		

    	return translations;
	}

	getUnitLabel(unitCode:string): string {
		if (unitCode) {
			return UNITS[this.language][unitCode];			
		}
		else {
			return null;
		}
	}

	get languages(): Translation[] {
		return LANGUAGES;
	}

	get language(): string {
		return this.nutsService.settings.language;
	}

	switchLanguage(languageCode: string) {
		this.nutsService.settings.language = languageCode;
		this.nutsService.updateSettings((updatedSettings, error) => {
			if (error) {
				this.uiService.displayToast(this.getMessage('message.settings.update.error'));
			}
		});
	}
}

var MESSAGES = {
	'fr': {
		'app.title': 'Squirrel Stash',
		'page.add.title': 'Modifier un élément dans ma réserve',
		'page.list.title': 'Contenu de ma réserve',
		'action.disconnect': 'Déconnexion',
		'category.general': 'Général',
		'message.item.saved': 'Elément sauvegardé',
		'message.item.save.error': 'Erreur lors de la sauvegarde',
		'message.quantity.updated': 'Quantité mise à jour',
		'message.quantity.update.error': 'Erreur lors de la mise à jour',
		'message.settings.update.error': 'Erreur lors de la sauvegarde des préférences',
		'label.nut.name': 'Libellé',
		'label.nut.category': 'Catégorie', 
		'label.nut.amount': 'Quantité', 
		'label.nut.unit': 'Unité', 
		'label.nut.notes': 'Notes', 
		'label.category.placeholder': 'Sélectionnez une catégorie', 
		'label.unit.placeholder': 'Sélectionnez une unité', 
		'label.notes.placeholder': 'Notez vos remarques ici...',
		'label.category.filter': 'Catégorie sélectionnée', 
		'label.category.all': 'Toutes',
	},
	'en': {
		'app.title': 'Squirrel Stash',
		'page.add.title': 'Add an item in my stash',
		'page.list.title': 'My stash\'s content',
		'action.disconnect': 'Disconnect',
		'category.general': 'General',
		'message.item.saved': 'Item saved',
		'message.item.save.error': 'Error saving item',
		'message.quantity.updated': 'Quantity update',
		'message.quantity.update.error': 'Error updating quantity',
		'message.settings.update.error': 'Error updating settings',
		'label.nut.name': 'Label',
		'label.nut.category': 'Category', 
		'label.nut.amount': 'Amount', 
		'label.nut.unit': 'Unit', 
		'label.nut.notes': 'Notes', 
		'label.category.placeholder': 'Select category', 
		'label.unit.placeholder': 'Select unit', 
		'label.notes.placeholder': 'Type the notes here...', 
		'label.category.filter': 'Selected category', 
		'label.category.all': 'All',
	},
};

export class Translation {
	code: string;
	label: string;

	constructor(code:string, label:string) {
		this.code = code;
		this.label = label;
	}
}

var LANGUAGES = [
	new Translation('fr', 'Français'),
	new Translation('en', 'English'),
];

var UNITS = {
	'fr': {
		'box': 'Boîte(s)',
		'pot': 'Pot(s)',
		'kg': 'Kg',
		'pack': 'Paquet(s)',
		'piece': 'Pièce(s)',
		'bag': 'Sachet(s)'
	},
	'en': {
		'box': 'Boxe(s)',
		'pot': 'Pot(s)',
		'kg': 'Kg',
		'pack': 'Pack(s)',
		'piece': 'Piece(s)',
		'bag': 'Bag(s)'
	}
};