import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { TabsPage } from "../tabs/tabs";


@IonicPage()
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {

  houseListRef: AngularFireList<any>;
  house = { name: '' }

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

  createHouse() {
    const newHouseRef = this.houseListRef.push({});
    newHouseRef.set({
      id: newHouseRef.key,
      name: this.house.name,
      // image: '',
    });
    const userId = this.auth.currentUserId;
    this.database.object<any>(`/users/${userId}`)
      .update({
        houseId: newHouseRef.key
      });
    this.navCtrl.setRoot(TabsPage);
  }

}
