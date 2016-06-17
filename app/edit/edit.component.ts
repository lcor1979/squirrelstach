import { Component, OnInit, OnDestroy, ElementRef, Inject, AfterViewInit } from '@angular/core';
import {ROUTER_DIRECTIVES, RouteParams } from '@angular/router-deprecated';

import {MaterializeDirective} from 'angular2-materialize';

import { Nut } from '../shared/model';
import { NutsService, NavService, NavigationItem }   from '../shared/index';

declare var Materialize: any;
@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
	templateUrl: 'edit.component.html',
	styleUrls: ['edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit { 

	nutId;
	nut: Nut;

	categories: string[] = [
		"Apéritif",
		"Viande",
		"Légumes",
		"Accompagnements"
	];

	units: string[] = [
		"Boîte(s)",
		"Pot(s)",
		"Kg",
		"Paquet(s)",
		"Pièce(s)",
		"Sachet(s)"
	];
	
	elementRef: ElementRef;

	private toastDisplayed: boolean;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		routeParams: RouteParams,
   		@Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;
		this.nut = new Nut();
		this.nutId = routeParams.get("id");
    }

    ngOnInit() {
		this.navService.changeNavigationItems([
			new NavigationItem(this, 'cancel', ['Details', {id:this.nutId}]),
			new NavigationItem(this, 'done', null, this.save),
			new NavigationItem(this, 'delete', null, this.delete)
		]);
		this.nutsService.getNutById(this.nutId, (nut) => this.nutLoaded(nut));
    }

    save(): void {
		alert('edit');
    }

    delete(): void {
		alert('delete');
    }

    ngAfterViewInit() {		
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
