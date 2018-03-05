import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import firebase from "firebase";
// import { ListItem } from "../../models/list-item/list-item.interface";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  itemListRef$: AngularFireList<any>;
  todoItems;
  doneItems;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public facebook: Facebook,
    private modalCtrl: ModalController,
    private database: AngularFireDatabase,
  ) {
    this.itemListRef$ = this.database.list<any>('/itemlist');
  }

  ngOnInit() {
    this.clearOldItems();
    this.todoItems = this.getItems(false).valueChanges();
    this.doneItems = this.getItems(true).valueChanges();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Welcome');
  }

  getItems(done: boolean) {
    return this.database.list<any>('/itemlist', ref => ref.orderByChild('done').equalTo(done));
  }

  openAddItem() {
    const addModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    const addModalData = {
      id: "",
      text: "",
      new: true
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
      new: false
    };
    const editItemModal: Modal = this.modalCtrl.create('ItemModal', { data: editModalData }, editModalOptions);
    editItemModal.present();
  }

  deleteItem(item) {
    this.database.object('/itemlist/' + item.id)
      .remove();
  }

  toggleDone(item: any) {
    let timestamp = !item.done ? Math.floor(Date.now() / 1000) : item.timecreated;
    this.database.object('/itemlist/' + item.id)
      .update({
        text: item.text,
        done: !item.done,
        timedone: timestamp
      });
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
