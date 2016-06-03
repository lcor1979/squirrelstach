import { Injectable } from '@angular/core';

declare var firebase: any;

@Injectable()
export class FirebaseDBService {

	database;

	constructor() {
		this.database = firebase.database();
	}

	getRef(path:string) {
		return this.database.ref(path);
	}
}