import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  house = { name: '', details: '' }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private database: AngularFireDatabase,
    private auth: AuthService,
    private user: UserService,
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
    newHouseRef.set({
      id: newHouseKey,
      name: this.house.name || this.defaultHouseName(newHouseKey),
    }).then(_ => {
      if (this.house.details) this.setHouseDetails(newHouseKey);
      const newUserRef = this.database.object(`/houses/${newHouseKey}/users/${this.user.id}`);
      newUserRef.update({
        id: this.user.id,
        name: this.user.name,
        image: this.user.image
      });
    });
    this.database.object<any>(`/users/${this.user.id}`)
      .update({
        houseId: newHouseKey
      });
    this.user.houseId = newHouseKey;
    this.navCtrl.setRoot(TabsPage);
  }

  setHouseDetails(id: string) {
    const houseDetailsRef = this.database.list<any>(`/houses/${id}/details`);
    const details = this.house.details.split('\n');
    for (let detail of details) {
      const newDetailRef = houseDetailsRef.push({});
      newDetailRef.set({
        text: detail
      });
    }
  }

  defaultHouseName(id: string): string {
    let limit = id.length - 7;
    let i = Math.floor(Math.random() * limit)
    return 'House ' + id.substring(i, i + 7);
  }

}
