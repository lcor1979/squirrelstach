import { Injectable } from '@angular/core';

import { NutsService } from '../shared/index';


@Injectable()
export class I18nService {

	constructor(private nutsService: NutsService) {
	}

	getMessage(key:string, language?:string):string {
		if (!language) {
			language = this.nutsService.settings.language;
		}


		var value:string = MESSAGES[language][key];

		if (!value) {
			value = "!!" + key + "!!";
		}

		return value;
	}	

	get units(): string[] {
		return UNITS[this.nutsService.settings.language];
	}
}

var MESSAGES = {
	'fr': {
		'category.general': 'Général',
		'message.item.saved': 'Elément sauvegardé',
	},
	'en': {
		'category.general': 'General',
		'message.item.saved': 'Item saved',
	},
}

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