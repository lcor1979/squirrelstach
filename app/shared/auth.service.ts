import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

declare var firebase: any;

@Injectable()
export class AuthService {

	provider;
	googleAccessToken;
	user;

	private userLoggedSubject = new Subject<any>();
	private userLogged$ = this.userLoggedSubject.asObservable();

	addUserLoggedHandler(handler):any {
		return this.userLogged$.subscribe(user => handler(user));
	}

	removeUserLoggedHandler(subscription) {
		subscription.unsubscribe();
	}

	startAuthentication() {
		this.provider = new firebase.auth.GoogleAuthProvider();
		this.userLoggedSubject.next(null);

		firebase.auth().getRedirectResult().then(result => {
			if (!result.user) {
				firebase.auth().signInWithRedirect(this.provider);
				return;
			} 

			if (result.credential) {
				// This gives you a Google Access Token. You can use it to access the Google API.
				this.googleAccessToken = result.credential.idToken;
			}
			// The signed-in user info.
			this.user = result.user;
			this.userLoggedSubject.next(this.user);
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			alert('Error: ' + errorMessage);
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});
	}
}