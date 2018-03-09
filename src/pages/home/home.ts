import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from "angularfire2/database";
import firebase from "firebase";
import { UserService } from "../../services/user.service"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // itemListRef$: AngularFireList<any>;
  houseRef: AngularFireObject<any>;
  houseId;
  houseName;
  userRef;
  todoItems;
  doneItems;
  showDoneItems: boolean = false;
  toggleButtonText: string = "Show Completed Items";

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public facebook: Facebook,
    private modalCtrl: ModalController,
    private database: AngularFireDatabase,
    private user: UserService,
    private auth: AuthService,
  ) {

  }

  ngOnInit() {
    // this.clearOldItems();
    this.user.retrieveUser().subscribe(user => {
      this.houseId = user.houseId;
      this.database.object<any>('/houses/' + this.houseId)
      .valueChanges().subscribe(house => {
        this.houseName = house.name;
        this.todoItems = this.getItems(false).valueChanges();
        this.doneItems = this.getItems(true).valueChanges();
        // this.itemListRef$ = this.database.list<any>(`/houses/${this.houseId}/items`);
      });
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
    const addModalData = {
      id: "",
      text: "",
      new: true,
      createdBy: this.user.userId,
      houseId: this.houseId
    };
    const addItemModal: Modal = this.modalCtrl.create('ItemModal', { data: addModalData }, addModalOptions);
    addItemModal.present();
  }

  editItem(item) {
    const editModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    const editModalData = {
      id: item.id,
      text: item.text,
      new: false,
      createdBy: this.user.userId,
      houseId: this.houseId
    };
    const editItemModal: Modal = this.modalCtrl.create('ItemModal', { data: editModalData }, editModalOptions);
    editItemModal.present();
  }

  deleteItem(item) {
    this.database.object<any>(`/houses/${this.houseId}/items/${item.id}`)
      .remove();
  }

  toggleDone(item: any) {
    let timestamp = !item.done ? Math.floor(Date.now() / 1000) : item.timecreated;
    this.database.object<any>(`/houses/${this.houseId}/items/${item.id}`)
      .update({
        text: item.text,
        done: !item.done,
        timedone: timestamp
      });
  }

  toggleShowDone() {
    this.showDoneItems = !this.showDoneItems;
    this.toggleButtonText = this.showDoneItems ? "Completed Items" : "Show Completed Items"
  }

  clearOldItems() {
    let now = Math.floor(Date.now() / 1000);
    if (this.getItems(true).valueChanges()) {
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

}
