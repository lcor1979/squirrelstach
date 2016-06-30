import { Injectable } from '@angular/core';

import { NutsService } from '../shared/index';


@Injectable()
export class I18nService {

	constructor(private nutsService: NutsService) {
	}

	getMessage(key:string, language?:string):string {
		if (!language) {
			language = this.language;
		}


		var value:string = MESSAGES[language][key];

		if (!value) {
			value = "!!" + key + "!!";
		}

		return value;
	}	

	get units(): string[] {
		return UNITS[this.language];
	}

	get languages(): Language[] {
		return LANGUAGES;
	}

	get language(): string {
		return this.nutsService.settings.language;
	}

	set language(language: string) {
		this.nutsService.settings.language = language;
	}
}

var MESSAGES = {
	'fr': {
		'app.title': 'Squirrel Stach',
		'action.disconnect': 'Déconnexion',
		'category.general': 'Général',
		'message.item.saved': 'Elément sauvegardé',
		'message.item.save.error': 'Erreur lors de la sauvegarde',
		'label.nut.name': 'Libellé',
		'label.nut.category': 'Catégorie', 
		'label.nut.amount': 'Quantité', 
		'label.nut.unit': 'Unité', 
		'label.nut.notes': 'Notes', 
		'label.category.placeholder': 'Sélectionnez une catégorie', 
		'label.unit.placeholder': 'Sélectionnez une unité', 
		'label.notes.placeholder': 'Notez vos remarques ici...', 
	},
	'en': {
		'app.title': 'Squirrel Stach',
		'action.disconnect': 'Disconnect',
		'category.general': 'General',
		'message.item.saved': 'Item saved',
		'message.item.save.error': 'Error saving item',
		'label.nut.name': 'Label',
		'label.nut.category': 'Category', 
		'label.nut.amount': 'Amount', 
		'label.nut.unit': 'Unit', 
		'label.nut.notes': 'Notes', 
		'label.category.placeholder': 'Select category', 
		'label.unit.placeholder': 'Select unit', 
		'label.notes.placeholder': 'Type the notes here...', 
	},
};

export class Language {
	code: string;
	label: string;

	constructor(code:string, label:string) {
		this.code = code;
		this.label = label;
	}
}

var LANGUAGES = [
	new Language('fr', 'Français'),
	new Language('en', 'English'),
];

var UNITS = {
	'fr': [
		"Boîte(s)",
		"Pot(s)",
		"Kg",
		"Paquet(s)",
		"Pièce(s)",
		"Sachet(s)"
	],
	'en': [
		"Boxe(s)",
		"Pot(s)",
		"Kg",
		"Pack(s)",
		"Piece(s)",
		"Bag(s)"
	]
};