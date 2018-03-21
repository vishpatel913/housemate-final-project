import { Keyboard } from 'ionic-native';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { CategoryArray } from '../../models/task-item/category.model';

@IonicPage()
@Component({
  selector: 'page-item-modal',
  templateUrl: 'item-modal.html',
})
export class ItemModal {

  @ViewChild('task') taskInput;
  itemListRef$: AngularFireList<any>;
  todo = this.navParams.get('data'); // = { id, text, createdby, category, new, houseId }
  categories;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
  ) {
    this.itemListRef$ = this.database.list<any>(`/houses/${this.todo.houseId}/items`);
    this.categories = CategoryArray;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      Keyboard.show() // for android
      this.taskInput.setFocus();
    }, 150);
    const data = this.navParams.get('data');
    console.log(data);
  }

  handleItemModal() {
    if (this.todo.new) {
      this.saveItem();
    } else {
      this.editItem();
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
      category: this.todo.category || 'general'
    });
    this.closeModal();
  }

  editItem() {
    this.database.object(`/houses/${this.todo.houseId}/items/${this.todo.id}`)
      .update({
        text: this.todo.text,
        timecreated: Math.floor(Date.now() / 1000),
        category: this.todo.category
      });
    this.closeModal();
  }

  closeModal() {
    const data = {
      text: 'Buy beer'
    };
    this.viewCtrl.dismiss(data);
  }

}
