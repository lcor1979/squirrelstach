import { Injectable, ElementRef } from '@angular/core';
import { Control } from '@angular/common';

import { Subscription } from 'rxjs';

declare var jQuery:any;
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
    }
}

export class ControlEventPropagator {

	private subscriber: Subscription;

	constructor(public elementId: string,
				public control: Control, 
		        public elementRef: ElementRef) {

		this.subscriber = this.control.statusChanges.subscribe((status) => this.updateStatus(status));
	}

	getInput(): any {
		var container = jQuery(this.elementRef.nativeElement).find(this.elementId);
		var input = container ? container.find(":input.select-dropdown") : null;

		return input;		
	}

	updateStatus(statusString:string) {
		var input = this.getInput();

		if (input) {		
			if (this.control.touched) {
				input.removeClass("ng-untouched");
				input.addClass("ng-touched");
			}
			else {
				input.removeClass("ng-touched");
				input.addClass("ng-untouched");			
			}

			if (this.control.pristine) {
				input.removeClass("ng-dirty");
				input.addClass("ng-pristine");
			}
			else {
				input.removeClass("ng-pristine");
				input.addClass("ng-dirty");			
			}

			if (this.control.valid) {
				input.removeClass("ng-invalid");
				input.addClass("ng-valid");
			}
			else {
				input.removeClass("ng-valid");
				input.addClass("ng-invalid");			
			}			
		}

	}

	close() {
		if (this.subscriber) {
			this.subscriber.unsubscribe();
		}
	}
}