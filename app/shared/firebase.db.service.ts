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

export abstract class DataHandler {
	private dataReference;
	private dataListener;

	constructor(protected dbService: FirebaseDBService) {

	}

	abstract getDataReference(): string;
	abstract getDataListenerType(): string;
	abstract setupDataReference(dataReference): any;

	setupData() {
		// Remove existing data handler
		this.closeData();

		// Get data reference
		this.openDataReference();

		// Add order clause
		this.dataListener = this.setupDataReference(this.dataReference);
	}


	closeData() {
		if (this.dataReference && this.dataListener) {
			this.dataReference.off(this.getDataListenerType(), this.dataListener);
		}
	}

	private openDataReference() {
		if (!this.dataReference) {
			this.dataReference = this.dbService.getRef(this.getDataReference());
		}
	}
}