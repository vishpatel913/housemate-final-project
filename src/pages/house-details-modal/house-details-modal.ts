import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";

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
    const houseDetails = this.database.list<any>(`/houses/${this.house.id}/details`);
    const details = this.house.details.split('\n');
    console.log(details);
    houseDetails.remove();
    for (let detail of details) {
      const newDetailRef = houseDetails.push({});
      newDetailRef.set({
        text: detail
      });
    }
    this.closeModal();
  }

  closeModal() {
    const house = {
      details: 'Buy beer'
    };
    this.viewCtrl.dismiss(house);
  }

}
