import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { LoginPage } from "../login/login";
import { TabsPage } from "../tabs/tabs";


@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {

  houseListRef: AngularFireList<any>;
  house = { name: '', details: '' }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private auth: AuthService,
  ) {
    this.houseListRef = this.database.list<any>('/houses');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');
  }

  goLogin() {
    this.navCtrl.pop({ animate: false });
  }

  createHouse() {
    const newHouseRef = this.houseListRef.push({});
    const userId = this.auth.currentUserId;
    const houseDefault = 'House ' + newHouseRef.key.substring(0, 5);
    newHouseRef.set({
      id: newHouseRef.key,
      name: this.house.name || houseDefault,
      // image: '',
    }).then(_ => {
      if (this.house.details) this.setHouseDetails(newHouseRef.key);
      const newUserRef = this.database.object(`/houses/${newHouseRef.key}/users/${userId}`);
      newUserRef.update({
        id: userId,
        name: this.auth.currentUserName,
      });
    });
    this.database.object<any>(`/users/${userId}`)
      .update({
        houseId: newHouseRef.key
      });
    this.navCtrl.setRoot(TabsPage);
  }

  setHouseDetails(id: string) {
    const houseDetails = this.database.list<any>(`/houses/${id}/details`);
    const details = this.house.details.split('\n');
    for (let detail of details) {
      const newDetailRef = houseDetails.push({});
      newDetailRef.set({
        text: detail
      });
    }
  }

}
