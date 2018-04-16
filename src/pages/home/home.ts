import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
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
  noTasks: boolean = false;
  noTaskMessage: { icon: string; text: string };

  constructor(
    public navCtrl: NavController,
    public facebook: Facebook,
    private modalCtrl: ModalController,
    private database: AngularFireDatabase,
    private user: UserService,
  ) {
    this.houseId = user.houseId;
  }

  ngOnInit() {
    this.noTaskMessage = {
      icon: this.getRandomIcon(),
      text: this.getRandomMessage(),
    };
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
    this.todoItems.subscribe(data => {
      this.noTasks = data.length < 1 && !this.doneItemsBool;
      console.log('no tasks?', this.noTasks)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Welcome');
  }

  getItems(done: boolean): AngularFireList<any> {
    return this.database.list<any>(`/houses/${this.houseId}/items`,
      ref => ref.orderByChild('done').equalTo(done));
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
    const addTaskModal: Modal = this.modalCtrl.create('TaskModal', { data: addModalData }, addModalOptions);
    addTaskModal.present();
  }

  toggleShowDone() {
    this.showDoneItems = !this.showDoneItems;
    this.toggleButtonText = this.showDoneItems ? "Completed" : "Show Completed";
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

  getRandomIcon(): string {
    const iconArr = [
      'md-checkmark-circle-outline',
      'key',
      'glasses',
      'iontron',
      'paper-plane',
      'pizza',
      'ribbon',
      'rose'
    ];
    return iconArr[Math.floor(Math.random() * iconArr.length)];
  }

  getRandomMessage(): string {
    return 'Nothing needs doing today';
  }

}
