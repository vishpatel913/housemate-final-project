import { Injectable } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFireDatabase } from "angularfire2/database";
import { Facebook } from '@ionic-native/facebook';

import { MockUserData } from './mock-user-data';


@Injectable()
export class AuthService {

  userDetails: any = null;

  constructor(
    platform: Platform,
    private toastCtrl: ToastController,
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

  // Opens up native facebook login popup
  // and authenticates user using credentials
  // returned as a Promise
  signInWithFacebook(): Promise<void> {
    console.log('Sign in with Facebook');
    return this.facebook.login(["email"]).then(response => {
      const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInWithCredential(credential).then(userData => {
        this.userDetails = userData;
        this.authConfirmationToast();
        this.updateCurrentUser();
      });
    }).catch(error => {
      alert(JSON.stringify(error));
    });
  }

  // Signs out using firebase auth
  signOut() {
    return firebase.auth().signOut().then(() => {
      this.userDetails = null;
      this.authConfirmationToast();
    }).catch(error => {
      console.log(error);
    });
  }

  // Update or add the current user to database
  updateCurrentUser() {
    const newUserRef = this.database.object(`/users/${this.currentUserId}/`);
    newUserRef.update({
      id: this.currentUserId,
      name: this.currentUserName,
      photoURL: this.currentUserPhotoUrl,
    });
  }

  // Display auth message for sign in/out confirmation
  authConfirmationToast() {
    let toastOptions = {
      message: '',
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Hide',
    };
    toastOptions.message = this.userDetails
      ? `Successfully signed in as ${this.currentUserName}`
      : 'Successfully signed out';
    this.toastCtrl.create(toastOptions).present();
  }

}
