import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";

import { LoginPage } from '../login/login';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";


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
    private database: AngularFireDatabase,
    private auth: AuthService,
    private user: UserService,

  ) {
    this.userId = user.id;
    this.houseId = user.houseId;
  }

  reportBug(){
    console.log('Report bug');
  }

  leaveHouse() {
    this.database.object<any>(`/users/${this.userId}/houseId`)
      .remove();
    this.database.object<any>(`/houses/${this.houseId}/users/${this.userId}`)
      .remove();
    this.navCtrl.setRoot(LoginPage);
  };

  logout() {
    this.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
