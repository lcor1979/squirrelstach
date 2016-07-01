import { Injectable } from '@angular/core';

declare var Materialize: any;

@Injectable()
export class UIService {

	private toastDisplayed: boolean;

	constructor() {
	}

    displayToast(text: string) {
		if (!this.toastDisplayed) {
			this.toastDisplayed = true;
			Materialize.toast(text, 1000, 'rounded', () => { this.toastDisplayed = false });
		}
    }}
