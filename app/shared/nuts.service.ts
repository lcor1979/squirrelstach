import { Injectable } from '@angular/core';

declare var firebase: any;

@Injectable()
export class NutsService {
	getNuts(userId, callback: (snapshot:any) => void) {
		firebase.database().ref('staches/' + userId + '/nuts').orderByChild('name')
		.on('value', 
		function(snapshot) { callback(snapshot) });
	}
}