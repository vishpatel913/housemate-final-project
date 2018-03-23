import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";

@IonicPage()
@Component({
  selector: 'page-house-details-modal',
  templateUrl: 'house-details-modal.html',
})

export class HouseDetailsModal {

  @ViewChild('detailInput') detailInput: ElementRef;
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

  resize() {
    var element = this.detailInput['_elementRef'].nativeElement.getElementsByTagName('textarea')[0];
    var scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.detailInput['_elementRef'].nativeElement.style.overflow = 'hidden';
    this.detailInput['_elementRef'].nativeElement.style.height = 'auto';
    this.detailInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';
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
