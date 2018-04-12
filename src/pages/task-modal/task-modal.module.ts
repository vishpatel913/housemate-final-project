import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskModal } from './task-modal';

@NgModule({
  declarations: [
    TaskModal,
  ],
  imports: [
    IonicPageModule.forChild(TaskModal),
  ],
  exports: [
    TaskModal
  ]
})
export class TaskModalModule {}
