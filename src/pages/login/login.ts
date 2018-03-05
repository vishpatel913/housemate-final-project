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

  // userProfile = MockUserData;
  public userProfile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public facebook: Facebook,
    private database: AngularFireDatabase,
    private auth: AuthService,
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      this.userProfile = this.auth.userProfile;
    });
  }

  ngOnInit() {
    this.userProfile = this.auth.userProfile;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  // TODO: error message plugin_not_found also fix plugman problem ffs -> plugins/cordova-universal-links-plugin/hooks/lib/ios/xcodePreferences.js
  login() {
    this.facebook.login(["email"]).then(response => {
      const credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      this.auth.signInWithFacebook(credential);
      this.userProfile = this.auth.userProfile;
      location.reload();
    }).catch((error) => { console.log(error) });
  }

  logout() {
    this.auth.signOut();
  }

  testButton() {
    alert(JSON.stringify(this.auth.userProfile));
  }

}
