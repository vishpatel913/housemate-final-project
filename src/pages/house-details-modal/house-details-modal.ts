import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";

@IonicPage()
@Component({
  selector: 'page-house-details-modal',
  templateUrl: 'house-details-modal.html',
})

export class HouseDetailsModal {

  house = this.navParams.get('data'); // = { details, id, name }

  constructor(
    public navCtrl: NavController,
    public viewCtrl : ViewController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
  ) {
  }

  ionViewDidLoad() {
    const data = this.navParams.get('data');
    console.log(data);
  }

  updateHouseDetails() {
    const houseRef = this.database.object<any>(`/houses/${this.house.id}`);
    const houseDetailsRef = this.database.list<any>(`/houses/${this.house.id}/details`);
    const details = this.house.details.split('\n');
    houseRef.update({
      name: this.house.name
    })
    houseDetailsRef.remove();
    for (let detail of details) {
      const newDetailRef = houseDetailsRef.push({});
      newDetailRef.set({
        text: detail
      });
    }
    this.closeModal();
  }

  closeModal() {
    const houseData = {
      name: 'Hazelwood Ave.',
      details: 'Buy beer'
    };
    this.viewCtrl.dismiss(houseData);
  }

}
