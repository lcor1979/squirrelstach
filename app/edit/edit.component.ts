import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
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
export class EditComponent implements OnInit { 

	nutId;

	units: string[] = [
		"Boîte(s)",
		"Pot(s)",
		"Kg",
		"Paquet(s)",
		"Pièce(s)",
		"Sachet(s)"
	];
	
	private toastDisplayed: boolean;

	form: ControlGroup;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		routeParams: RouteParams, builder: FormBuilder) {
		this.nutId = routeParams.get("id");

		this.form = builder.group({
            "name": new Control("", Validators.required),
            "category": new Control("Général", Validators.required),
            "quantity": builder.group({
				"amount": new Control("", Validators.compose([Validators.required, Validators.pattern("[0-9]{1,3}")])),
				"unit": new Control("", Validators.required)
			}),            
            "notes": new Control("")
        });
    }

    ngOnInit() {
		this.navService.changeNavigationItems([
			new NavigationItem(this, 'cancel', ['Details', { id: this.nutId }]),
			new NavigationItem(this, 'done', null, () => this.save(), () => { return this.isDirtyAndValid() }),
			new NavigationItem(this, 'delete', null, () => this.delete(), () => { return this.nutId })
		]);
		if (this.nutId) {
			this.nutsService.getNutById(this.nutId, (nut) => this.nutLoaded(nut));
		}
    }

    get categories() : String[] {
    	return this.nutsService.categories;
    }

	/* Form has been modified and is valid */
    isDirtyAndValid() {
		return this.form.dirty && this.form.valid;
    }

    save(): void {
		if (this.isDirtyAndValid()) {

			var nut: Nut = new Nut();
			nut.id = this.nutId;
			nut.name = this.form.controls['name'].value;
			nut.category = this.form.controls['category'].value;
			nut.quantity.amount = (<ControlGroup>this.form.controls['quantity']).controls['amount'].value;
			nut.quantity.unit = (<ControlGroup>this.form.controls['quantity']).controls['unit'].value;
			nut.notes = this.form.controls['notes'].value;

			this.nutsService.saveNut(nut, (nut: Nut, error: string) => this.nutSaved(nut, error));
		}
    }

    protected nutSaved(nut: Nut, error: string) {
		if (error) {
			console.log('Error during item update: ' + error);
			this.displayToast('Error saving item');
		}
		else {
			this.displayToast('Item saved');
		}
    } 

    delete(): void {
		alert('delete');
    }

    protected displayToast(text) {
		if (!this.toastDisplayed) {
			this.toastDisplayed = true;
			Materialize.toast(text, 1000, 'rounded', () => { this.toastDisplayed = false });
		}
    }

    private nutLoaded(nut: Nut) {
		(<Control>this.form.controls['name']).updateValue(nut.name);
		(<Control>this.form.controls['category']).updateValue(nut.category);
		(<Control>(<ControlGroup>this.form.controls['quantity']).controls['amount']).updateValue(nut.quantity.amount);
		(<Control>(<ControlGroup>this.form.controls['quantity']).controls['unit']).updateValue(nut.quantity.unit);
		(<Control>this.form.controls['notes']).updateValue(nut.notes);
    }

}
