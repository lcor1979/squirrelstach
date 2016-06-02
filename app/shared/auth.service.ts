import { Injectable } from '@angular/core';

declare var firebase: any;

@Injectable()
export class AuthService {

	provider;
	googleAccessToken;
	user;

	signIn() {
		this.provider = new firebase.auth.GoogleAuthProvider();

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