import { Injectable } from '@angular/core';

import { NUTS } from './mock-nuts';

@Injectable()
export class NutsService {
	getNuts() {
		return Promise.resolve(NUTS);	
	}
}