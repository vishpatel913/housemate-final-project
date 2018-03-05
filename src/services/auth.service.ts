import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Facebook } from '@ionic-native/facebook';


@Injectable()
export class AuthService {

  userDetails: firebase.User = null;

  constructor(
    public facebook: Facebook,
    private database: AngularFireDatabase,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userDetails = user;
      } else {
        this.userDetails = null;
      }
    });
  }

  // Returns true if user is logged in
  get authenticated(): boolean {
    return this.userDetails !== null;
  }

  // Returns current user data
  get currentUserDetails(): any {
    return this.authenticated ? this.userDetails : null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.userDetails.uid : '';
  }

  // Returns current user display name
  get currentUserName(): string {
    return this.authenticated ? this.userDetails.displayName : 'Guest';
  }

  signInWithFacebook() {
    console.log('Sign in with Facebook');
    this.facebook.login(["email"]).then(response => {
      const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(credential).then(user => {
        this.userDetails = user;
      })
    }).catch((error) => { console.log(error) });
    // TODO: will need loading screen/trick for delay
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      this.userDetails = null;
      alert('Sign-out successful');
    }).catch(error => {
      console.log(error);
    });
  }

}
