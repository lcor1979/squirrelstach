import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteParams } from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { Nut } from '../shared/model';
import { NutsService, NavService, NavigationItem }   from '../shared/index';

declare var Materialize: any;

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
	templateUrl: 'details.component.html',
	styleUrls: ['details.component.css']
})
export class DetailsComponent implements OnInit { 

	nutId;
	nut: Nut;

	private toastDisplayed: boolean;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		routeParams: RouteParams) {
		this.nut = new Nut();
		this.nutId = routeParams.get("id");
    }

    ngOnInit() {
		this.navService.changeNavigationItems([
			new NavigationItem(this, 'arrow_back', 'Home'),
			new NavigationItem(this, 'edit', null, this.edit),
			new NavigationItem(this, 'delete', null, this.delete)
		]);
		this.nutsService.getNutById(this.nutId, (nut) => this.nutLoaded(nut));
    }

    edit(): void {
		alert('edit');
    }

    delete(): void {
		alert('delete');
    }

    decrementQuantity(): void {
    	if ((this.quantity - 1) >= 0) {
			this.quantity--;
    	}
    }

    incrementQuantity(): void {
		if ((this.quantity + 1) <= 999) {
			this.quantity++;
		}
    }

    get quantity() {
		return this.nut.quantity.amount;
    }

    set quantity(value) {
		if (!isNaN(value)) { 
			this.nut.quantity.amount = value;
			this.nutsService.updateNutQuantity(this.nutId, value, (quantity:number, error:string) => this.quantitySaved(quantity, error));
		}
    }

    protected quantitySaved(quantity:number, error:string) {
    	if (error) {
			console.log('Error during quantity update: ' + error);
			this.displayToast('Error during quantity update');
    	}
    	else {
			this.displayToast('Quantity updated');
    	}
    }

    protected displayToast(text) {
		if (!this.toastDisplayed) {
			this.toastDisplayed = true;
			Materialize.toast(text, 1000, 'rounded', () => { this.toastDisplayed = false });
		}
    }

    private nutLoaded(nut: Nut) {
		this.nut = nut;
    }

}
