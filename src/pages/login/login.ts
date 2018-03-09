import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import firebase from "firebase";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { TabsPage } from '../tabs/tabs';
import { CreatePage } from '../create/create';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private auth: AuthService,
    private user: UserService,
  ) {

  }

  ngOnInit() {

  }

  // TODO: error message plugin_not_found also fix plugman problem ffs -> plugins/cordova-universal-links-plugin/hooks/lib/ios/xcodePreferences.js
  login() {
    this.auth.signInWithFacebook().then(() => {
      // this.auth.waitForAuth().then(() => {  
      //   this.user.addCurrentUser();
      // });
      this.user.retrieveUser().subscribe(user => {
        if (!!user.houseId) {
          this.navCtrl.setRoot(TabsPage);
        }
      });
    });
  }

  logout() {
    this.auth.signOut();
  }

  create() {
    this.navCtrl.push(CreatePage);
    console.log('Create page');
  }

  join() {
    console.log('Open camera');
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

}
