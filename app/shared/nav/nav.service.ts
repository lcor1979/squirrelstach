import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class NavService {
	private navigationItems:NavigationItem[] = [];

	private navigationItemsChangedSubject = new Subject<any>();
	private navigationItemsChanged$ = this.navigationItemsChangedSubject.asObservable();

	addNavigationItemsChangedHandler(handler :(items:NavigationItem[]) => void): any {
		return this.navigationItemsChanged$.subscribe(items => handler(items));
	}

	removeNavigationItemsChangedHandler(subscription) {
		subscription.unsubscribe();
	}

	changeNavigationItems(items: NavigationItem[]) {
		this.navigationItems = items;
		this.navigationItemsChangedSubject.next(this.navigationItems);
	}

}


export class NavigationItem {
	owner: any;
	icon: string;

	route: string;
	handler: () => void;

	constructor(owner: any, icon: string, route: string, handler?: () => void) {
		this.owner = owner;
		this.icon = icon;
		this.route = route;
		this.handler = handler;
	}
}