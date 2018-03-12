import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from "angularfire2/database";
import firebase from "firebase";
import { AddUserPage } from "../add-user/add-user"
import { UserService } from "../../services/user.service"
import { AuthService } from "../../services/auth.service"


@IonicPage()
@Component({
  selector: 'page-house-details',
  templateUrl: 'house-details.html',
})
export class HouseDetailsPage {

  houseId;
  houseName;
  houseDetails;
  houseDetailsRef = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private database: AngularFireDatabase,
    private user: UserService,
    private auth: AuthService,
  ) {

  }

  ngOnInit() {
    this.user.retrieveUser().subscribe(user => {
      this.houseId = user.houseId;
      this.database.object<any>('/houses/' + this.houseId)
      .valueChanges().subscribe(house => {
        this.houseName = house.name;
        this.houseDetails = house.details;
        this.houseDetailsRef = this.getDetails().valueChanges();
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseDetailsPage');
  }

  getDetails() {
    return this.database.list<any>(`/houses/${this.houseId}/details`);
  }

  addUser() {
    this.navCtrl.push(AddUserPage);
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
