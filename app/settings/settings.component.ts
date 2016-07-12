import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Control, ControlGroup } from '@angular/common';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { MaterializeDirective } from 'angular2-materialize';

import { I18nService, I18nPipe, Translation }  from '../i18n/index';
import { NutsService, NavService, NavigationItem, UIService, Settings, Stash } from '../shared/index';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
	templateUrl: 'settings.component.html',
	styleUrls: ['settings.component.css'],
	pipes: [I18nPipe]
})
export class SettingsComponent implements OnInit, OnDestroy { 

    form: ControlGroup;

	constructor(private navService: NavService,
		private nutsService: NutsService,
		private i18n: I18nService,
		private uiService: UIService, 
        builder: FormBuilder) {
        this.form = builder.group({
            "currentStash": new Control(this.settings.currentStash ? this.settings.currentStash.id : null)
        });
    }

    get settings(): Settings {
    	return this.nutsService.settings;
    }

    ngOnInit() {
		this.navService.changeNavigationItems([
			new NavigationItem(this, 'arrow_back', ['Home']),
			new NavigationItem(this, 'done', null, () => this.save())
		]);    
	}

    ngOnDestroy() {
    }

    get selectedStash(): Stash {
        var selectedStashId:string = this.form.value.currentStash;

            for (var index in this.settings.stashes) {
                var stash:Stash = this.settings.stashes[index];
                if (stash && selectedStashId == stash.id) {
                    return stash;
                }
            }

           return null;
    }

    save(): void {
        this.settings.currentStash = this.selectedStash;
    	this.nutsService.updateSettings((settings: Settings, error: string) => this.settingsUptated(settings, error));
    }

    protected settingsUptated(settings:Settings, error:string) {
		if (error) {
			console.log('Error during settings update: ' + error);
			this.uiService.displayToast(this.i18n.getMessage('message.settings.save.error'));
		}
		else {
            (<Control>this.form.controls['currentStash']).updateValue(settings.currentStash ? settings.currentStash.id : null);
			this.uiService.displayToast(this.i18n.getMessage('message.settings.saved'));
		}
    }
}