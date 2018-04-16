import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { NotificationService } from "../../services/notification.service";
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
    public loadingCtrl: LoadingController,
    private database: AngularFireDatabase,
    private barcodeScanner: BarcodeScanner,
    private auth: AuthService,
    private user: UserService,
    private notification: NotificationService,
  ) {

  }

  // TODO: error message plugin_not_found also fix plugman problem ffs -> plugins/cordova-universal-links-plugin/hooks/lib/ios/xcodePreferences.js
  login() {
    this.auth.signInWithFacebook().then(() => {
      let loading = this.loadingCtrl.create({
        content: 'Logging in...'
      });
      loading.present();
      this.user.retrieveUser().subscribe(userDetails => {
        if (!!userDetails.houseId) {
          this.user.houseId = userDetails.houseId;
          this.navCtrl.setRoot(TabsPage);
        }
        loading.dismiss();
      });
    });
  }

  logout() {
    this.auth.signOut();
  }

  create() {
    console.log('Create page');
    this.navCtrl.push(CreatePage, {}, { animate: false });
  }

  scanHouseCode() {
    console.log('Join house');
    this.barcodeScanner.scan().then(barcodeData => {
      const houseId = barcodeData.text;
      this.database.object(`/users/${this.user.id}`)
        .update({
          houseId: houseId,
        }).then(() => {
          this.user.houseId = houseId;
          this.notification.subscribeToHouse(houseId);
          const newUserRef = this.database.object(`/houses/${houseId}/users/${this.user.id}`);
          newUserRef.update({
            id: this.user.id,
            name: this.user.name,
            image: this.user.image
          });
        });
      this.navCtrl.setRoot(TabsPage);
    }, (err) => {
      alert('Unable to open camera, check app permissions');
    });
  }

  isAuthed(): boolean {
    return this.auth.authenticated;
  }

  getUserDetails() {
    return {
      name: this.user.name,
      image: this.user.image
    }
  }

}
