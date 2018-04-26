import { Keyboard } from 'ionic-native';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Categories } from '../../models/task-item/category.model';
import { Category } from '../../models/task-item/task-item.interface';
import { NotificationService } from '../../services/notification.service';

@IonicPage()
@Component({
  selector: 'page-task-modal',
  templateUrl: 'task-modal.html',
})
export class TaskModal {

  @ViewChild('task') taskInput;
  itemListRef$: AngularFireList<any>;
  todo = this.navParams.get('data'); // = { id, text, createdby, category, important, new, houseId }
  categories: Category[];
  usersRef;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
    private notification: NotificationService,
  ) {
    this.itemListRef$ = this.database.list<any>(`/houses/${this.todo.houseId}/items`);
    this.categories = this.getCategoryArray();
    this.usersRef = this.database.list<any>(`/houses/${this.todo.houseId}/users`).valueChanges();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      Keyboard.show() // for android
      this.taskInput.setFocus();
    }, 50);
    console.log('Task data', this.todo);
  }

  handleTaskModal() {
    let toastOptions = {
      message: '',
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Hide',
    };
    if (this.todo.text !== '') {
      if (this.todo.new) {
        this.saveItem();
        this.notification.sendHouseNotification(this.todo);
        toastOptions.message = `${Categories[this.todo.category].name} task added`
        this.toastCtrl.create(toastOptions).present();
      } else {
        this.editItem();
        toastOptions.message = `Task edited`
        this.toastCtrl.create(toastOptions).present();
      }
    } else {
      this.closeModal();
      toastOptions.message = `No task added`
      this.toastCtrl.create(toastOptions).present();
    }
  }

  saveItem() {
    const newItemRef = this.itemListRef$.push({});
    newItemRef.set({
      id: newItemRef.key,
      text: this.todo.text,
      timecreated: Math.floor(Date.now() / 1000),
      done: false,
      createdby: this.todo.createdby,
      category: this.todo.category || 'general',
      taggeduser: this.todo.taggeduser || '',
      important: this.todo.important || false
    });
    this.closeModal();
  }

  editItem() {
    this.database.object(`/houses/${this.todo.houseId}/items/${this.todo.id}`)
      .update({
        text: this.todo.text,
        timecreated: Math.floor(Date.now() / 1000),
        category: this.todo.category,
        taggeduser: this.todo.taggeduser || '',
        important: this.todo.important
      });
    this.closeModal();
  }

  closeModal() {
    const data = {
      text: 'Buy beer'
    };
    this.viewCtrl.dismiss(data);
  }

  getCategoryArray(): Category[] {
    let catArr = [];
    for (let key in Categories) {
      catArr.push(Categories[key]);
    }
    return catArr;
  }

}
