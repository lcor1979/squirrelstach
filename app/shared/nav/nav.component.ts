import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router-deprecated';

import { MaterializeDirective } from 'angular2-materialize';

import { I18nService, I18nPipe, Translation } from '../../i18n/index';
import { AuthService } from '../index';
import { NavService, NavigationItem } from './nav.service';

@Component({
	moduleId: module.id,
    selector: 'sqs-nav',
    directives: [ROUTER_DIRECTIVES, MaterializeDirective],
    templateUrl: 'nav.component.html',
    styleUrls: ['nav.component.css'],
    pipes: [I18nPipe]
})
export class Nav implements OnInit {
    private navigationItemsChangedSubscription;

    items: NavigationItem[] = [];

   elementRef: ElementRef;

   constructor(
       private router: Router, 
       private authService: AuthService,
       private navService: NavService,
       private i18n: I18nService,
   	   @Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngOnInit() {
        this.navigationItemsChangedSubscription = this.navService.addNavigationItemsChangedHandler((items) => this.navigationChanged(items));
    }    

    ngOnDestroy() {
        if (this.navigationItemsChangedSubscription) {
            this.navService.removeNavigationItemsChangedHandler(this.navigationItemsChangedSubscription);
        }
    }

    switchLanguage(code:string) {
        this.i18n.switchLanguage(code);
    }

    navigationChanged(items:NavigationItem[]):void {
        // We cannot change the reference of this.items here because it will cause an error in the Angular change detection
        this.items.splice(0, this.items.length);
        Array.prototype.push.apply(this.items, items);
    }

    isActive(route:String):boolean {
		  return this.router.isRouteActive(this.router.generate([route]));
    }

    execute(item:NavigationItem): void {
        if (item.isEnabled()) {
            item.handler();
        }
    }

    isDisabled(item:NavigationItem): boolean {
        return !item.isEnabled();
    }
}
