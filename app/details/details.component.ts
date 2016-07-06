import { Component, OnInit, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';

import {SessionStorage} from "angular2-localstorage/WebStorage";

import { I18nService } from '../i18n/index';
import { Nut } from '../shared/model';
import { NutsService, NavService, NavigationItem, UIService }   from '../shared/index';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES],
	templateUrl: 'details.component.html',
	styleUrls: ['details.component.css']
})
export class DetailsComponent implements OnInit { 

	nutId;
	nut: Nut;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		private i18n: I18nService,
		private uiService: UIService,
		private router:Router,
		routeParams: RouteParams) {
		this.nut = new Nut();
		this.nutId = routeParams.get("id");
    }

    ngOnInit() {
		this.navService.changeNavigationItems([
			new NavigationItem(this, 'arrow_back', ['Home']),
			new NavigationItem(this, 'edit', ['Edit', {id: this.nutId}]),
			new NavigationItem(this, 'delete', null, this.delete)
		]);
		this.nutsService.getNutById(this.nutId, (nut) => this.nutLoaded(nut));
    }
    
    delete(): void {
		this.nutsService.deleteNut(this.nutId, (nutId: string, error: string) => this.nutDeleted(nutId, error));
    }

    protected nutDeleted(nut: Nut, error: string) {
		if (error) {
			console.log('Error during item delete: ' + error);
			this.uiService.displayToast(this.i18n.getMessage('message.item.delete.error'));
		}
		else {
			this.router.navigate(['Home']);
		}
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
			this.uiService.displayToast(this.i18n.getMessage('message.quantity.update.error'));
    	}
    	else {
			this.uiService.displayToast(this.i18n.getMessage('message.quantity.updated'));
    	}
    }

    private nutLoaded(nut: Nut) {
		this.nut = nut;
    }

}
