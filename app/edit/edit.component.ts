import { Component, OnInit, OnDestroy, Inject, ElementRef } from '@angular/core';
import { FormBuilder, Validators, ControlGroup, Control } from '@angular/common';
import { ROUTER_DIRECTIVES, Router, RouteParams } from '@angular/router-deprecated';

import { Subscription } from 'rxjs';

import { MaterializeDirective } from 'angular2-materialize';

import { I18nService, I18nPipe, Translation }  from '../i18n/index';
import { Nut } from '../shared/model';
import { NutsService, NavService, NavigationItem, UIService } from '../shared/index';

declare var jQuery:any;

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
	templateUrl: 'edit.component.html',
	styleUrls: ['edit.component.css'],
	pipes: [I18nPipe]
})
export class EditComponent implements OnInit, OnDestroy { 

	nutId;
	form: ControlGroup;
	
	private unitEventPropagator: ControlEventPropagator;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		private i18n: I18nService,
		private uiService: UIService,
		private router: Router,
		routeParams: RouteParams, 
		builder: FormBuilder,
		@Inject(ElementRef) elementRef: ElementRef) {
		this.form = builder.group({
           	"name": new Control("", Validators.required),
           	"category": new Control("", Validators.required),
           	"quantity": builder.group({
				"amount": new Control("", Validators.compose([Validators.required, Validators.pattern("[0-9]{1,3}")])),
				"unit": new Control("", Validators.required)
			}),            
           	"notes": new Control("")
        });

        this.unitEventPropagator = new ControlEventPropagator("#unitContainer", (<Control>(<ControlGroup>this.form.controls['quantity']).controls['unit']), elementRef);

		this.initializeForm(routeParams.get("id"), routeParams.get("label"));
    }

    private initializeForm(nutId: string, defaultLabel?: string) {
		this.nutId = nutId;

		var label:string = "";
		var category:string = "";
		var amount:string = "";

		// Default values for new element
		if (!this.nutId) {
			label = defaultLabel ? defaultLabel : "";
			category = this.i18n.getMessage('category.general');
			amount = "1";
		}

		this.setFormValues(
			{ 
				name: label, 
				category: category, 
				quantity: { 
					amount: amount, 
					unit: ""}, 
				notes: ""
			}
		);
    }

    private setFormValues(nut: any) {
    	(<Control>this.form.controls['name']).updateValue(nut.name);
		(<Control>this.form.controls['category']).updateValue(nut.category);
		(<Control>(<ControlGroup>this.form.controls['quantity']).controls['amount']).updateValue(nut.quantity.amount);
		(<Control>(<ControlGroup>this.form.controls['quantity']).controls['unit']).updateValue(nut.quantity.unit);
		(<Control>this.form.controls['notes']).updateValue(nut.notes);    		

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

    ngOnDestroy() {
    	if (this.unitEventPropagator) {
    		this.unitEventPropagator.close();
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
			if (!this.nutId) {
				this.nutId = nut.id;				
			}
			this.uiService.displayToast(this.i18n.getMessage('message.item.saved'));
		}
    } 

    delete(): void {
		this.nutsService.deleteNut(this.nutId, (nutId: string, error: string) => this.nutDeleted(nutId, error));
    }

    protected nutDeleted(nutId: string, error: string) {
		if (error) {
			console.log('Error during item delete: ' + error);
			this.uiService.displayToast(this.i18n.getMessage('message.item.delete.error'));
		}
		else {
			this.router.navigate(['Home']);
		}
    } 

    private nutLoaded(nut: Nut) {
    	if (nut) {
			this.setFormValues(nut); 		
    	}
    	else {
			console.log('Cannot find nut with id: ' + this.nutId);
			this.uiService.displayToast(this.i18n.getMessage('message.item.load.error'));  
			this.initializeForm(null); 		
    	}
    }
}

class ControlEventPropagator {

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