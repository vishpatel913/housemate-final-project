import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { AuthService } from "../../services/auth.service";
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
    private formBuilder: FormBuilder,
    private database: AngularFireDatabase,
    private auth: AuthService,
  ) {
    this.houseListRef = this.database.list<any>('/houses');
    // this.houseForm = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   details: ['']
    // });
    // [formGroup]="houseForm"
    // [formControl]="houseForm.controls['name/details']"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');
  }

  goLogin() {
    this.navCtrl.pop({ animate: false });
  }

  createHouse() {
    const newHouseRef = this.houseListRef.push({});
    const newHouseKey = newHouseRef.key;
    const userId = this.auth.currentUserId;
    newHouseRef.set({
      id: newHouseKey,
      name: this.house.name || this.defaultHouseName(newHouseKey),
    }).then(_ => {
      if (this.house.details) this.setHouseDetails(newHouseKey);
      const newUserRef = this.database.object(`/houses/${newHouseKey}/users/${userId}`);
      newUserRef.update({
        id: userId,
        name: this.auth.currentUserName,
      });
    });
    this.database.object<any>(`/users/${userId}`)
      .update({
        houseId: newHouseKey
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

  defaultHouseName(id: string) {
    let limit = id.length - 7;
    let i = Math.floor(Math.random() * limit)
    return 'House ' + id.substring(i, i + 7);
  }

}
