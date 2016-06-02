import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import { AuthService } from '../index';


declare var jQuery: any;

@Component({
	moduleId: module.id,
    selector: 'sqs-nav',
    directives: [ROUTER_DIRECTIVES],
    templateUrl: 'nav.component.html',
    styleUrls: ['nav.component.css']
})
export class Nav implements OnInit {
   elementRef: ElementRef;

   constructor(private router: Router, 
     private authService: AuthService, 
   	@Inject(ElementRef) elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    ngOnInit() {
        jQuery(this.elementRef.nativeElement).find('.button-collapse').sideNav();
        jQuery(this.elementRef.nativeElement).find('.dropdown-button').dropdown();
    }

    isActive(route:String):boolean {
		  return this.router.isRouteActive(this.router.generate([route]));
    }
}