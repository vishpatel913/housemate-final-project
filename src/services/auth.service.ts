import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFireDatabase } from "angularfire2/database";
import { Facebook } from '@ionic-native/facebook';

import { MockUserData } from './mock-user-data';


@Injectable()
export class AuthService {

  userDetails: any = null;

  constructor(
    platform: Platform,
    public facebook: Facebook,
    private database: AngularFireDatabase,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userDetails = user;
      } else {
        this.userDetails = null;
        this.userDetails = platform.is('cordova') ? null : MockUserData;
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

  // Returns current user photo url
  get currentUserPhotoUrl(): string {
    return this.authenticated ? this.userDetails.photoURL : '';
  }

  signInWithFacebook() {
    console.log('Sign in with Facebook');
    return this.facebook.login(["email"]).then(response => {
      const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(credential).then(userData => {
        this.userDetails = userData;
        this.updateCurrentUser();
      });
    }).catch(error => {
      alert(error);
    });
  }

  signOut() {
    firebase.auth().signOut().then(() => {
      this.userDetails = null;
      console.log('Sign-out successful');
    }).catch(error => {
      console.log(error);
    });
  }

  updateCurrentUser() {
    const newUserRef = this.database.object(`/users/${this.currentUserId}/`);
    newUserRef.update({
      id: this.currentUserId,
      name: this.currentUserName,
      photoURL: this.currentUserPhotoUrl,
    });
  }

}
