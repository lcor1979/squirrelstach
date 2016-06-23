import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';

import { AuthService } from '../index';
import { NavService, NavigationItem } from './nav.service';


declare var jQuery: any;

@Component({
	moduleId: module.id,
    selector: 'sqs-nav',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'nav.component.html',
    styleUrls: ['nav.component.css']
})
export class Nav implements OnInit {
    private navigationItemsChangedSubscription;

    items: NavigationItem[] = [];

   elementRef: ElementRef;

   constructor(private router: Router, 
       private authService: AuthService,
       private navService: NavService,
   	@Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngOnInit() {
        this.navigationItemsChangedSubscription = this.navService.addNavigationItemsChangedHandler((items) => this.navigationChanged(items));
        jQuery(this.elementRef.nativeElement).find('.dropdown-button').dropdown({
            belowOrigin: true,
            constrain_width: false,
            alignment: 'right'
        });
    }    

    ngOnDestroy() {
        if (this.navigationItemsChangedSubscription) {
            this.navService.removeNavigationItemsChangedHandler(this.navigationItemsChangedSubscription);
        }
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
