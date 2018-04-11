import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase } from "angularfire2/database";
import { AddUserPage } from "../add-user/add-user"
import { UserService } from "../../services/user.service"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  houseId: string;
  houseName: string;
  todoItems;
  doneItems;
  doneItemsBool: boolean;
  showDoneItems: boolean = false;
  toggleButtonText: string = "Show Completed";

  constructor(
    public navCtrl: NavController,
    public facebook: Facebook,
    private modalCtrl: ModalController,
    private database: AngularFireDatabase,
    private user: UserService,
  ) {

  }

  ngOnInit() {
    this.houseId = this.user.houseId;
    this.database.object<any>('/houses/' + this.houseId)
      .valueChanges().subscribe(house => {
        this.houseName = house.name;
      });
    this.todoItems = this.getItems(false).valueChanges();
    this.doneItems = this.getItems(true).valueChanges();
    this.doneItems.subscribe(data => {
      if (data.length > 0) {
        this.doneItemsBool = true;
        this.clearOldItems();
      } else this.doneItemsBool = false;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Welcome');
  }

  getItems(done: boolean) {
    return this.database.list<any>(`/houses/${this.houseId}/items`, ref => ref.orderByChild('done').equalTo(done));
  }

  openAddItem() {
    const addModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    let addModalData = {
      id: "",
      text: "",
      new: true,
      createdby: this.user.id,
      houseId: this.houseId,
      category: 'general',
    };
    const addItemModal: Modal = this.modalCtrl.create('ItemModal', { data: addModalData }, addModalOptions);
    addItemModal.present();
  }

  toggleShowDone() {
    this.showDoneItems = !this.showDoneItems;
    this.toggleButtonText = this.showDoneItems ? "Completed" : "Show Completed"
  }

  addUser() {
    this.navCtrl.push(AddUserPage);
  }

  deleteItem(item) {
    this.database.object<any>(`/houses/${this.houseId}/items/${item.id}`)
      .remove();
  }

  clearOldItems() {
    let now = Math.floor(Date.now() / 1000);
    this.getItems(true).valueChanges()
      .subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          // deletes done items after 3 days
          if (now - snapshot.timedone > 86400 * 3) {
            this.deleteItem(snapshot);
          }
        });
      })
  }

}
