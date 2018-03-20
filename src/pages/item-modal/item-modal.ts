import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { CategoryArray } from '../../models/task-item/category.model';

@IonicPage()
@Component({
  selector: 'page-item-modal',
  templateUrl: 'item-modal.html',
})
export class ItemModal {

  itemListRef$: AngularFireList<any>;
  todo = this.navParams.get('data'); // = { id, text, createdby, category, new, houseId }
  categories;

  @ViewChild('task') taskInput ;
  constructor(
    public navCtrl: NavController,
    public viewCtrl : ViewController,
    public navParams: NavParams,
    private database: AngularFireDatabase,
  ) {
    this.itemListRef$ = this.database.list<any>(`/houses/${this.todo.houseId}/items`);
    this.categories = CategoryArray;
  }

  ionViewDidLoad() {
    this.taskInput.setFocus();
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
      category: this.todo.category
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
