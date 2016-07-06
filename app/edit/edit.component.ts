import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { ROUTER_DIRECTIVES, RouteParams } from '@angular/router-deprecated';

import { MaterializeDirective } from 'angular2-materialize';

import { I18nService, I18nPipe, Translation }  from '../i18n/index';
import { Nut } from '../shared/model';
import { NutsService, NavService, NavigationItem, UIService } from '../shared/index';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
	templateUrl: 'edit.component.html',
	styleUrls: ['edit.component.css'],
	pipes: [I18nPipe]
})
export class EditComponent implements OnInit { 

	nutId;
	form: ControlGroup;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		private i18n: I18nService,
		private uiService: UIService,
		routeParams: RouteParams, builder: FormBuilder) {
		this.nutId = routeParams.get("id");

		var label:string = "";
		var category:string = "";
		var amount:string  "";

		// Default values for new element
		if (!this.nutId) {
			label = routeParams.get("label");
			category = this.i18n.getMessage('category.general');
			amount = 1;
		}


		this.form = builder.group({
            "name": new Control(label, Validators.required),
            "category": new Control(category, Validators.required),
            "quantity": builder.group({
				"amount": new Control(amount, Validators.compose([Validators.required, Validators.pattern("[0-9]{1,3}")])),
				"unit": new Control("", Validators.required)
			}),            
            "notes": new Control("")
        });
    }

    ngOnInit() {

    	var goBackRoute = null;
    	if (this.nutId) {
			goBackRoute	= ['Details', { id: this.nutId }];
    	}
    	else {
			goBackRoute	= ['Home'];    		
    	}
    	

		this.navService.changeNavigationItems([
			new NavigationItem(this, 'cancel', goBackRoute),
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

    get units() : Translation[] {
    	return this.i18n.units;
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
			this.uiService.displayToast(this.i18n.getMessage('message.item.save.error'));
		}
		else {
			this.uiService.displayToast(this.i18n.getMessage('message.item.saved'));
		}
    } 

    delete(): void {
		alert('delete');
    }

    private nutLoaded(nut: Nut) {
		(<Control>this.form.controls['name']).updateValue(nut.name);
		(<Control>this.form.controls['category']).updateValue(nut.category);
		(<Control>(<ControlGroup>this.form.controls['quantity']).controls['amount']).updateValue(nut.quantity.amount);
		(<Control>(<ControlGroup>this.form.controls['quantity']).controls['unit']).updateValue(nut.quantity.unit);
		(<Control>this.form.controls['notes']).updateValue(nut.notes);
    }

}
