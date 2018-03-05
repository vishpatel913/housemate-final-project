import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { AuthService } from "../../services/auth.service"
import firebase from "firebase";
// import MockUserData from "../../../mock-user-data.json"


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebook: Facebook,
    private database: AngularFireDatabase,
    private auth: AuthService,
  ) {

  }

  ngOnInit() {
    console.log('ionViewDidLoad LoginPage');
  }

  // TODO: error message plugin_not_found also fix plugman problem ffs -> plugins/cordova-universal-links-plugin/hooks/lib/ios/xcodePreferences.js
  login() {
    this.auth.signInWithFacebook();
    // location.reload();
  }

  logout() {
    this.auth.signOut();
  }

  isAuthed() {
    return this.auth.authenticated;
  }

  getUserDetails() {
    let userDetails = this.auth.currentUserDetails;
    return {
      name: this.auth.currentUserName,
      image: userDetails.photoURL
    }
  }

  testButton() {
    alert(JSON.stringify(this.auth.currentUserDetails));
  }

}
