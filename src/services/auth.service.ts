import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import AuthProvider = firebase.auth.AuthProvider;
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Facebook } from '@ionic-native/facebook';
import firebase from "firebase";
// import MockUserData from "../../mock-user-data.json"


@Injectable()
export class AuthService {

  public userProfile: any = null;
  public isAuthed: boolean;

  constructor(
    public facebook: Facebook,
    private database: AngularFireDatabase
  ) {
    // afAuth.authState.subscribe(user => {
    //   this.user = user;
    // });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userProfile = user;
        this.isAuthed = true;
      } else {
        this.userProfile = null;
        this.isAuthed = false;
      }
    });
  }

  signInWithFacebook(credentials) {
    console.log('Sign in with Facebook');
    firebase.auth().signInWithCredential(credentials).then(user => {
      // alert(JSON.stringify(info));
      this.userProfile = user;
      this.isAuthed = true;
    })
  }

  signOut() {
    this.userProfile = null;
    firebase.auth().signOut().then(function() {
      this.isAuthed = false;
      alert('Sign-out successful');
    }).catch(function(error) {
      console.log(error);
    });
  }

  getUserDetails() {
    return this.userProfile;
  }

}
