import { Component } from '@angular/core';
import { NavController, ViewController, AlertController } from 'ionic-angular';

import { AngularFireDatabase } from "angularfire2/database";

import { LoginPage } from "../login/login";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { NotificationService } from "../../services/notification.service";


@Component({
  selector: 'popover-settings',
  templateUrl: 'settings.html',
})

export class SettingsPopover {

  userId: string;
  houseId: string;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private database: AngularFireDatabase,
    private auth: AuthService,
    private user: UserService,
    private notification: NotificationService,

  ) {
    this.userId = user.id;
    this.houseId = user.houseId;
  }

  reportBug(){
    console.log('Report bug');
  }

  leaveHouse() {
    let confirmLeave = this.alertCtrl.create({
      title: 'Leave House?',
      message: 'Are you sure you want to leave this house?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Not Leaving');
            this.close();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Leaving these snakes');
            this.database.object<any>(`/users/${this.userId}/houseId`)
              .remove();
            this.database.object<any>(`/houses/${this.houseId}/users/${this.userId}`)
              .remove();
            this.notification.unsubscribeFromHouse();
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    confirmLeave.present();
  }

  logout() {
    let confirmLogout = this.alertCtrl.create({
      title: 'Logout?',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Still logged in');
            this.close();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('BuBye');
            this.auth.signOut().then(() => {
              this.navCtrl.setRoot(LoginPage);
            });
          }
        }
      ]
    });
    confirmLogout.present();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
