import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import {SessionStorage} from "angular2-localstorage/WebStorage";

declare var firebase: any;

@Injectable()
export class AuthService {

	private provider;
	@SessionStorage('squirrelstash/auth/sessionId') private googleAccessToken: string;

	// The current user
	private userLoggedSubject = new Subject<any>();
	private userLogged$ = this.userLoggedSubject.asObservable();
	user: User;

	/**
	 * Handler called when logged in user change
	 */
	addUserLoggedHandler(handler):any {
		return this.userLogged$.subscribe(user => handler(user));
	}

	/**
	 * Remove handler called when logged in user change
	 */
	removeUserLoggedHandler(subscription) {
		subscription.unsubscribe();
	}

	/**
	 * Disconnect user and invalidate session token
	 */
	disconnect() {
		firebase.auth().signOut().then(() => {
			this.setLoggedUser(null);
			this.googleAccessToken = null; // Invalidate session token
			firebase.auth().signInWithRedirect(this.provider);
		}, function(error) {
			console.log("Error during disconnect: " + error);
		});
	}
	
	/**
	 * Start authentication process
	 */
	startAuthentication() {
		if (!this.provider) {
			this.provider = new firebase.auth.GoogleAuthProvider();
		}

		// Clear current user
		this.setLoggedUser(null);

		// Check if we have a session token
		if (this.googleAccessToken) {

			// Create a credential based on the token
			var credential = firebase.auth.GoogleAuthProvider.credential(this.googleAccessToken);

			// Sign in with credential
			firebase.auth().signInWithCredential(credential)
				.then(user => this.setLoggedUser(user))
				.catch(error => { 
					console.log("Error during authentication with credential: " + error);
					this.googleAccessToken = null;
					this.redirectToAuthentication();
				});
		}
		// No credential, redirect to authentication
		else {
			this.redirectToAuthentication();
		}		
	}

	protected setLoggedUser(user) {
		this.user = user;
		this.userLoggedSubject.next(this.user);
	}

	protected redirectToAuthentication() {

		// Add redirect result handler
		firebase.auth().getRedirectResult().then(result => {

			// If handler called with null => No logged user, trigger signInWithRedirect
			if (!result.user) {
				firebase.auth().signInWithRedirect(this.provider);
				return;
			}

			// If result has a credential, save the session token
			if (result.credential) {
				this.googleAccessToken = result.credential.idToken;
			}

			// Set the current user
			this.setLoggedUser(result.user);
		}).catch(function(error) {
			console.log("Error during authentication with redirect: " + error);
		});
	}
}


export interface User {
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    photoURL: string;
    refreshToken: string;
}