import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, PopoverController, ViewController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import { SettingsPopover } from "../settings/settings";
import { UserService } from "../../services/user.service";

@IonicPage()
@Component({
  selector: 'page-house-details',
  templateUrl: 'house-details.html',
})
export class HouseDetailsPage {

  userId: string;
  houseId: string;
  houseName: string;
  houseDetails: AngularFireObject<any>;
  houseDetailsRef = null;
  houseUsersRef = null;
  userCol3: boolean;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    private database: AngularFireDatabase,
    private user: UserService,
  ) {

  }

  ngOnInit() {
    this.userId = this.user.id;
    this.houseId = this.user.houseId;
    this.database.object<any>('/houses/' + this.houseId)
      .valueChanges().subscribe(house => {
        this.houseName = house.name;
        this.houseDetails = house.details;
      });
    this.houseDetailsRef = this.getDetails().valueChanges();
    this.houseUsersRef = this.getUsers().valueChanges();
    this.houseUsersRef.subscribe(users => {
      this.userCol3 = users.length == 4 || users.length > 6;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseDetailsPage');
  }

  getDetails() {
    return this.database.list<any>(`/houses/${this.houseId}/details`);
  }

  getUsers() {
    return this.database.list<any>(`/houses/${this.houseId}/users`);
  }

  getFirstName(name) {
    return name.split(' ')[0];
  }

  openMenu(event) {
    let popover = this.popoverCtrl.create(SettingsPopover);
    popover.present({
      ev: event
    });
  }

  openDetailsModal() {
    let detailString = "";
    for (let key in this.houseDetails) {
      detailString = detailString + this.houseDetails[key].text + '\n';
    }
    const editModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    const editModalData = {
      details: detailString,
      id: this.houseId,
      name: this.houseName
    };
    const editDetailsModal: Modal = this.modalCtrl.create('HouseDetailsModal', { data: editModalData }, editModalOptions);
    editDetailsModal.present();
  }

}
