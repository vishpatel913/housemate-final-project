import { Component, Input } from '@angular/core';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { AngularFireDatabase } from "angularfire2/database";
import { TaskItem, CategoryObject } from '../../models/task-item/task-item.interface';
import { Category } from '../../models/task-item/category.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'task-item',
  templateUrl: 'task-item.html'
})
export class TaskItemComponent {

  @Input('item') task: TaskItem;
  houseId: string;
  userName: string;
  category: CategoryObject;
  userTag: string;
  easterEgg: string;

  constructor(
    private modalCtrl: ModalController,
    private user: UserService,
    private database: AngularFireDatabase
  ) {
    this.houseId = user.houseId;
  }

  ngOnInit() {
    this.category = Category[this.task.category];
    this.setTaggedUser();
    this.easterEgg = this.getEasterEgg();
  }

  toggleDone() {
    let timestamp = !this.task.done ? Math.floor(Date.now() / 1000) : this.task.timecreated;
    this.database.object<any>(`/houses/${this.houseId}/items/${this.task.id}`)
      .update({
        text: this.task.text,
        done: !this.task.done,
        timedone: timestamp
      });
  }

  editItem() {
    const editModalOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true,
    };
    const editModalData = {
      id: this.task.id,
      text: this.task.text,
      category: this.task.category,
      createdby: this.task.createdby,
      taggeduser: this.task.taggeduser || '',
      important: this.task.important || false,
      houseId: this.houseId,
      new: false,
    };
    const editTaskModal: Modal = this.modalCtrl.create('TaskModal', { data: editModalData }, editModalOptions);
    editTaskModal.present();
  }

  deleteItem() {
    this.database.object<any>(`/houses/${this.houseId}/items/${this.task.id}`)
      .remove();
  }

  setTaggedUser() {
    let tagId = this.task.taggeduser;
    if (tagId && tagId !== '') {
      this.database.object<any>(`/houses/${this.houseId}/users/${tagId}`)
        .valueChanges().subscribe(user => {
          this.userTag = '@' + user.name.split(' ')[0];
          console.log(this.task.taggeduser, this.userTag);
        })
    }
  }

  getEasterEgg() {
    let text = this.task.text;
    if (text.search('.*beer.*') == 0) return 'beer';
  }
}
