import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  rent = 452.40;
  snaked: string = "something";
  user = "Vish";

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController
  ) {

  }

  setRent(event) {
    if (event.target.value.length > 1) {
      this.rent = event.target.value;
    }
  }

  setSnaked(event) {
    if (event.target.value.length > 2) {
      this.snaked = event.target.value;
    }
  }

  sendRent() {
    let title = 'Rent Due';
    let subtitle = `Amount due this month: £${Number(this.rent).toFixed(2)}`;
    this.notiAlert(title, subtitle);
  }

  sendSnaked() {
    let title = `Snaked Item`;
    let subtitle = `${this.user} has eaten/taken <b>${this.snaked}</b>, don't worry it'll be replaced.`;
    this.notiAlert(title, subtitle);
  }

  sendBins() {
    let title = `Bins`;
    let subtitle = `Bins need taking out`;
    this.notiAlert(title, subtitle);
  }

  notiAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['Okay']
    });
    alert.present();
  }


}
