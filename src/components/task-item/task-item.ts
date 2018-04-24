import { Component, Input, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import { Modal, ModalController, ModalOptions } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import { TaskItem, CategoryObject } from '../../models/task-item/task-item.interface';
import { Category } from '../../models/task-item/category.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'task-item',
  templateUrl: 'task-item.html',
  animations: [
    trigger('action', [
      state('*', style({
        opacity: 1
      })),
      transition('* => removed', animate('300ms ease-out', keyframes([
        style({ opacity: 1 }),
        style({ opacity: 0 })
      ]))),
    //   transition('* => new', animate('200ms ease-in', keyframes([
    //     style({ backgroundColor: '*'}),
    //     style({ backgroundColor: '#E91E63'}),
    //     style({ backgroundColor: '*'}),
    //   ])))
    ])
  ]
})
export class TaskItemComponent {

  @Input('item') task: TaskItem;
  state: string = 'x';
  itemRef: AngularFireObject<any>;
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
    this.itemRef = this.database.object<any>(`/houses/${this.houseId}/items/${this.task.id}`);
    this.category = Category[this.task.category];
    this.setTaggedUser();
    this.checkNew();
    this.easterEgg = this.getEasterEgg();
  }

  toggleDone() {
    let timeout = 0;
    if (!this.task.done) {
      this.state = 'removed';
      timeout = 300;
    }
    setTimeout(() => {
      let timestamp = !this.task.done ? Math.floor(Date.now() / 1000) : this.task.timecreated;
      this.itemRef
      .update({
        text: this.task.text,
        done: !this.task.done,
        timedone: timestamp
      });
    }, timeout);
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
    this.itemRef.remove();
  }

  setTaggedUser() {
    let tagId = this.task.taggeduser;
    if (tagId && tagId !== '') {
      this.database.object<any>(`/houses/${this.houseId}/users/${tagId}`)
        .valueChanges().subscribe(user => {
          if (!!user) this.userTag = '@' + user.name.split(' ')[0];
        })
    }
  }

  checkNew() {
    let now = Math.floor(Date.now() / 1000);
    if (now - this.task.timecreated < 300) {
      this.state = 'new';
    } else {
      this.state = 'x';
    }
  }

  getEasterEgg(): string {
    let text = this.task.text;
    if (text.search('.*(b|B)eer.*') == 0) return 'beer';
    else if (text.search('.*((c|C)rate|(p|P)ub).*') == 0) return 'beer';
    else if (text.search('.*(w|W)ine.*') == 0) return 'wine';
  }
}
