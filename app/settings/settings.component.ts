import { Component, OnInit, OnDestroy } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { MaterializeDirective } from 'angular2-materialize';

import { I18nService, I18nPipe, Translation }  from '../i18n/index';
import { NutsService, NavService, NavigationItem, UIService } from '../shared/index';

@Component({
	moduleId: module.id,
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
	templateUrl: 'settings.component.html',
	styleUrls: ['settings.component.css'],
	pipes: [I18nPipe]
})
export class SettingsComponent implements OnInit, OnDestroy { 

	constructor(private navService: NavService,
		private nutsService: NutsService,
		private i18n: I18nService,
		private uiService: UIService) {
    }

    get settings() {
    	return this.nutsService.settings;
    }

    ngOnInit() {
		this.navService.changeNavigationItems([]);
    }

    ngOnDestroy() {
    }
}